import { Observable, Subscriber } from 'rxjs';
import {
  decodeNodeId,
  encodeNodeId,
  ListId,
  ListParams,
  NodeId,
  NodeIdEnc,
  nodeTypeFromTypename,
} from './id';
import { QueriesService } from './queries/queries.service';
import { ListResult, queryList, queryNode } from './load';
import { PageInfo } from '../../generated/graphql-dgql';

/** How long {@link DataQuery} will wait to debounce requests until actually sending a request, in milliseconds. */
const CACHE_FAST_DEBOUNCE_TIME_MS = 200;
/** How long {@link DataQuery} will wait to debounce requests, if the {@link DataQuery#interactive} flag is set, in milliseconds. */
const CACHE_INTERACTIVE_DEBOUNCE_TIME_MS = 500;
/** Number of milliseconds beyond which cached data will be considered stale, and will be reloaded if a new subscriber is added. */
const CACHE_STALE_TIME_MS = 5000;

/**
 * A piece of observable data.
 *
 * DataQuery is a stateful interface for interacting with an API object.
 * Instead of calling a function to make an API request, DataQuery lets you declare the ID (like an endpoint) and
 * request parameters (in {@link #params}) of the data you want, and will automatically load the data when needed.
 * Data can then be accessed synchronously with the {@link #current} property.
 *
 * Upon adding a subscriber with [#subscribe]{@link Observable#subscribe}, data will loaded from the API and stored in the
 * cache. Subsequent viewers can then immediately access the cached data.
 *
 * - To check if data is loaded, use {@link #hasData},
 *   and to check if data is still loading, use {@link #loading}.
 * - To (re-)load the data from the API, use {@link #load}.
 *   This happens automatically upon subscription after a sufficient delay (see debounce time constants).
 * - To add a subscriber without triggering this behavior, use {@link #subscribeLazy}, which will
 *   only make an API request if the data is not cached.
 * - To invalidate (i.e. delete) the cached data, use {@link #invalidate}.
 * - If you only need the data right now and don't want to deal with subscriptions, use {@link #dataAsPromise}
 *   to access it as a promise that will either return cached data or load new data.
 *
 * When done using a DataQuery subscription, it *must* be manually destroyed by calling
 * [`sub.unsubscribe()`]{@link Subscription#unsubscribe} on the Subscription object returned by
 * [subscribe]{@link Observable#subscribe}, as it may leak memory otherwise.
 *
 * See {@link DataNode} and {@link DataList} for the two main types of data that use DataQuery.
 *
 * @typeParam I - ID type (e.g. NodeId or ListId)
 * @typeParam T - type of data accessible via .current
 * @typeParam R - type returned by innerQueryFn
 * @typeParam P - parameter type for innerQueryFn
 */
export abstract class DataQuery<I, T, R, P> extends Observable<T> {
  /** The ID of this data. */
  id: I;
  loading = false; // TODO: maybe make this value observable too?
  /**
   * @ignore
   * Private: this is the currently loaded data, externally accessible via .current.
   */
  protected currentData?: T;
  /**
   * @ignore
   * Private: this is the time the data was last loaded, to compare against the cache invalidation
   * timeout. This is a millisecond epoch timestamp from Date.now().
   */
  protected lastLoadTime = 0;
  /**
   * @ignore
   * Private: this flag may be set by subclasses to avoid having writes to .params load any data.
   */
  protected pSetParamsNoUpdate = false;

  /** Returns true if data is currently available. */
  get hasData(): boolean {
    return this.currentData !== undefined;
  }

  /** The currently loaded data. */
  get current(): T {
    return this.currentData;
  }

  /**
   * @ignore
   * The current query parameters, externally accessible via .params.
   */
  protected currentQueryParams?: P;
  /**
   * Parameters that will be passed to the request.
   * Changing this property will automatically trigger a load.
   */
  get params(): P | undefined {
    return this.currentQueryParams;
  }
  set params(p: P) {
    this.currentQueryParams = p;
    if (!this.pSetParamsNoUpdate) {
      this.loadDebounced();
    }
  }

  /**
   * @ignore
   * Private: set of all subscribers to this data. This set is used to send updates.
   */
  protected subscribers: Set<Subscriber<T>> = new Set();
  // FIXME: innerQuery/MapFn is a bit inelegant; it may be possible to refactor this
  /**
   * @ignore
   * Private: this is the inner query function that actually loads the data, provided by a subclass.
   */
  protected innerQueryFn: (id: I, p: P) => Promise<R>;
  /**
   * @ignore
   * Private: this function maps data returned by the inner query into our format, if necessary.
   */
  protected innerMapFn: (r: R) => T;
  /**
   * @ignore
   * Private: this is a simple counter used to determine whether the result of a load operation is
   * still relevant.
   */
  protected stateLock = 0;
  /**
   * @ignore
   * Private: this is a javascript timeout ID set when doing debounced loading.
   */
  protected loadTimeout = null;
  /**
   * @ignore
   * Private: if true, the data will be hydrated (see {@link DataList#hydrateInitial}) and we should
   * *not* trigger a load when a subscriber is added, until we have received the hydration.
   */
  protected hydrated = false;
  /**
   * @ignore
   * Private: if true, the next call to subscribe will add a lazy subscriber.
   * The flag will be reset automatically. Used in subscribeLazy.
   */
  protected isNextSubLazy = false;

  /** If true, will prolong debounce time a bit. */
  interactive = false;

  /**
   * @ignore
   * Creates a new DataQuery (you should never need to use this directly)
   *
   * @param id an identifier for the data being loaded
   * @param query the inner query function
   * @param map maps returned data from the query R to usable data T
   */
  protected constructor(
    id: I,
    query: (id: I, p: P) => Promise<R>,
    map: (r: R) => T
  ) {
    super((subscriber) => {
      this.addSubscriber(subscriber, this.isNextSubLazy);
      this.isNextSubLazy = false;
    });
    this.id = id;
    this.innerQueryFn = query;
    this.innerMapFn = map;
  }

  /**
   * Returns the data as a promise, without having to create a subscription.
   *
   * If cached data is available, this will return the data immediately; otherwise, this will
   * load the data with an API request.
   *
   * #### Example
   * ```ts
   * const node = dataService.getNode(someNodeId);
   * node.dataAsPromise().then(data => {
   *   console.log('node data:', data);
   * }).catch(error => console.error('oh no'));
   * ```
   */
  dataAsPromise(): Promise<T> {
    if (this.hasData) {
      return Promise.resolve(this.current);
    }
    return new Promise((resolve, reject) => {
      const sub = this.subscribe(
        (data) => {
          resolve(data);
          sub.unsubscribe();
        },
        (error) => {
          reject(error);
          sub.unsubscribe();
        }
      );
    });
  }

  /**
   * @ignore
   * Private: the actual implementation of the load function.
   */
  private loadImpl(fut: Promise<R>) {
    clearTimeout(this.loadTimeout);
    this.loadTimeout = null;
    this.lastLoadTime = Date.now();
    this.loading = true;

    // if load is called twice; only the newest load call will have an effect
    const stateLock = ++this.stateLock;

    fut
      .then((data) => {
        if (stateLock !== this.stateLock) {
          return;
        }
        this.insertResult(data);
        this.loading = false;
        this.hydrated = false;
      })
      .catch((error) => {
        if (stateLock !== this.stateLock) {
          return;
        }
        this.emitErrorToAllSubscribers(error);
        this.loading = false;
        this.hydrated = false;
      });
  }

  /** Loads data. */
  load() {
    this.hydrated = false;
    this.loadImpl(this.innerQueryFn(this.id, this.currentQueryParams));
  }

  /**
   * @internal
   * Use when data has not yet been loaded but is available from elsewhere.
   */
  hydrateRaw(preparedData: Promise<R>) {
    if (this.hasData) {
      return; // don't need hydration
    }
    this.hydrated = true;
    this.loadImpl(preparedData);
  }

  /** Will load data if it's stale or not present. */
  loadIfNeeded() {
    if (this.loading) {
      return;
    }
    if (!this.hasData || Date.now() - this.lastLoadTime > CACHE_STALE_TIME_MS) {
      this.load();
    }
  }

  /** Loads data after a short delay. Will debounce. */
  loadDebounced(interactive = this.interactive) {
    if (this.loadTimeout) {
      return;
    }
    this.loadTimeout = setTimeout(
      () => {
        this.loadTimeout = null;
        this.load();
      },
      interactive
        ? CACHE_INTERACTIVE_DEBOUNCE_TIME_MS
        : CACHE_FAST_DEBOUNCE_TIME_MS
    );
  }

  /** Deletes current data. */
  invalidate() {
    this.currentData = undefined;
    this.emitUpdateToAllSubscribers();
  }

  /**
   * @ignore
   * Private: callback for adding a new subscriber.
   */
  protected addSubscriber(subscriber: Subscriber<T>, lazy: boolean) {
    this.subscribers.add(subscriber);
    if (this.current !== undefined) {
      // data is available right now! emit current state
      subscriber.next(this.current);
    }

    if (!this.hydrated && (!lazy || !this.hasData)) {
      this.loadIfNeeded();
    }

    return {
      unsubscribe: () => {
        this.subscribers.delete(subscriber);
      },
    };
  }

  /**
   * Will subscribe to the data, but not cause a reload unless there is no data.
   * @param args passed verbatim to [#subscribe]{@link Observable#subscribe}
   */
  subscribeLazy(...args) {
    this.isNextSubLazy = true;
    return this.subscribe(...args);
  }

  /**
   * @ignore
   * Internal: will send an update with the current data (.current) to all subscribers.
   */
  emitUpdateToAllSubscribers() {
    for (const sub of this.subscribers) {
      sub.next(this.current);
    }
  }

  /**
   * @ignore
   * Internal: will send the given error to all subscribers.
   */
  emitErrorToAllSubscribers(error: unknown) {
    for (const sub of this.subscribers) {
      sub.error(error);
    }
  }

  /**
   * @ignore
   * Updates current data with a result from innerQueryFn, and emits an update.
   */
  insertResult(result: R) {
    this.currentData = this.innerMapFn(result);
    this.emitUpdateToAllSubscribers();
  }

  /** Returns the number of subscribers for this data. */
  get subscriberCount(): number {
    return this.subscribers.size;
  }
}

/**
 * A cacheable node with no parameters.
 *
 * See {@link DataQuery} for more information, and {@link DataService} to obtain a DataNode.
 * Nodes are identified by a {@link NodeId}.
 *
 * #### Example
 * ```html
 * <div class="example-component">
 *   Is it loading? {{thing$.loading ? 'yes' : 'no'}}
 *   Is the thing loaded? {{thing$.hasData ? 'yes' : 'no'}}
 *   <div *ngIf="thing$.current as thing">
 *     Thing data: {{thing.something}}
 *   </div>
 * </div>
 * ```
 * ```ts
 * class ExampleComponent implements OnInit, OnDestroy {
 *   @Input() thingId: NodeId;
 *
 *   public thing$: DataNode<Thing>;
 *   public thingSub: Subscription; // subscription to thing$
 *
 *   constructor(private dataService: DataService) {}}
 *
 *   ngOnInit() {
 *     // obtain the DataNode from the data service
 *     this.thing$ = this.dataService.getNode(this.thingId);
 *
 *     // subscribe to indicate that we want some data
 *     this.thingSub = this.thing$.subscribe();
 *   }
 *
 *   ngOnDestroy() {
 *     // remember to unsubscribe!!
 *     this.thingSub.unsubscribe();
 *   }
 * }
 * ```
 */
export class DataNode<T> extends DataQuery<NodeId, T, T, void> {
  /** @ignore */
  constructor(queries: QueriesService, id: NodeId) {
    super(id, queryNode(queries), (data) => data);
  }

  set params(p) {
    throw new Error('parameters not available on nodes');
  }

  loadIfNeeded() {
    if (!this.loading && Date.now() - this.lastLoadTime > CACHE_STALE_TIME_MS) {
      this.load();
    }
  }
}

/**
 * Provides a view into a list of items.
 *
 * See {@link DataQuery} for more information, and {@link DataService} to obtain a DataList.
 * Lists are identified by a {@link ListId}.
 *
 * - To access list items, use {@link #currentItems}.
 * - If you need the IDs as well, use {@link #current} (note that the Map is ordered).
 *
 * The current view is defined by following properties:
 *
 * - {@link #cursor}: the current NodeId cursor (see backend API documentation for details)
 * - {@link #count}: number of items to load
 * - {@link #forward}: if true, will load items after the cursor. If false, will load items before.
 * - {@link #filter}: filter object (type parameter F)
 *
 * Changing any of these properties will reload the list (debounced).
 *
 * @typeParam T - list item type
 * @typeParam F - list filter type
 *
 * #### Example
 * ```html
 * <div class="example-component">
 *   <div *ngFor="let thing of things$.currentItems">
 *     a thing! {{thing.something}}
 *   </div>
 * </div>
 * ```
 * ```ts
 * class ExampleComponent implements OnInit, OnDestroy {
 *   @Input() thingsListId: ListId;
 *
 *   things$: DataList<Thing, unknown>; // filter type unknown because we're not using here
 *   thingsSub: Subscription;
 *
 *   constructor(private dataService: DataService) {}}
 *
 *   ngOnInit() {
 *     // obtain a list view from the data service
 *     this.things$ = this.dataService.getList(this.thingsListId);
 *
 *     // subscribe to the list to indicate that we want some data
 *     this.thingsSub = this.things$.subscribe();
 *   }
 *
 *   ngOnDestroy() {
 *     // remember to unsubscribe!!
 *     this.thingsSub.unsubscribe();
 *   }
 * }
 * ```
 */
export class DataList<T, F> extends DataQuery<
  ListId,
  Map<NodeIdEnc, T>,
  ListResult<T>,
  ListParams<F>
> {
  // these are all just the private versions of the corresponding list properties.
  /** @ignore */
  private pCursor?: NodeId;
  /** @ignore */
  private pCount = 10;
  /** @ignore */
  private pFilter?: F;
  /** @ignore */
  private pForward = true;

  /**
   * @ignore
   * Private: page info for the currently loaded data.
   */
  private pageInfo?: PageInfo;
  /**
   * @ignore
   * Private: accessible via .totalCount (read-only)
   */
  private pTotalCount?: number;
  /**
   * @ignore
   * Private: used to correct hasPrevious/NextPage when receiving data.
   */
  private previouslyHadPageContents = false;
  /**
   * @ignore
   * Private: pointer to the global node cache, used to insert results.
   */
  private pNodes: NodeCache;

  /** @ignore */
  constructor(queries: QueriesService, nodes: NodeCache, id: ListId) {
    super(id, queryList(queries, nodes), (result) => {
      this.pageInfo = result.pageInfo;
      this.pTotalCount = result.totalCount;

      // API *only* reports hasPreviousPage or hasNextPage correctly if we are navigating in that
      // same direction. Hence, we need to amend pageInfo with prior knowledge.
      if (this.forward) {
        this.pageInfo.hasPreviousPage = this.previouslyHadPageContents;
      } else {
        this.pageInfo.hasNextPage = this.previouslyHadPageContents;
      }
      this.previouslyHadPageContents = !!result.items.size;

      return result.items;
    });
    this.pNodes = nodes;
    this.pSetParamsNoUpdate = true;
    this.setParams();
    this.pSetParamsNoUpdate = false;
  }

  /**
   * @internal
   * Updates the `params` value from list parameters
   */
  setParams() {
    this.params = {
      cursor: this.pCursor,
      count: this.pCount,
      forward: this.pForward,
      filter: this.pFilter,
    };
  }

  /** Returns the total number of items. Null if not loaded. */
  get totalCount() {
    return this.pTotalCount;
  }

  /** Returns the currently loaded items in an array. */
  get currentItems(): T[] {
    if (!this.hasData) {
      return [];
    }
    return [...this.current.values()];
  }

  /** Current list filter object. */
  get filter(): F | undefined {
    return this.pFilter;
  }
  set filter(f: F) {
    this.pFilter = f;
    this.setParams();
  }

  /** The current pagination cursor (a node relative to which items will be loaded). Nullable. */
  get cursor(): NodeId {
    return this.pCursor;
  }
  set cursor(c: NodeId) {
    this.pCursor = c;
    this.setParams();
  }

  /** The max amount of items to be loaded. */
  get count(): number {
    return this.pCount;
  }
  set count(c: number) {
    this.pCount = c;
    this.setParams();
  }

  /** Whether to load items after the cursor (true), or items before the cursor (false). */
  get forward(): boolean {
    return this.pForward;
  }
  set forward(f: boolean) {
    this.pForward = f;
    this.setParams();
  }

  /** Returns the node ID of the first item on the current page. */
  get firstPageItemId(): NodeId | null {
    const firstKey = this.current
      ? this.current.keys().next()?.value || null
      : null;
    return firstKey ? decodeNodeId(firstKey) : null;
  }

  /** Returns the node ID of the last item on the current page. */
  get lastPageItemId(): NodeId | null {
    if (!this.current) {
      return;
    }
    const keys = [...this.current.keys()];
    return keys[keys.length - 1] ? decodeNodeId(keys[keys.length - 1]) : null;
  }

  /** Returns true if the current result contains the given node. */
  currentHasNode(key: NodeId): boolean {
    return this.current?.has(encodeNodeId(key));
  }

  get hasPrevPage() {
    return !this.pageInfo || this.pageInfo.hasPreviousPage;
  }
  get hasNextPage() {
    return !this.pageInfo || this.pageInfo.hasNextPage;
  }

  /** Moves the view to the first page. */
  firstPage() {
    this.cursor = null;
    this.forward = true;
    this.previouslyHadPageContents = false;
    this.invalidate();
    return true;
  }

  /** Moves the view to the previous page. */
  prevPage() {
    if (this.pageInfo && !this.pageInfo.hasPreviousPage) {
      return false;
    }
    this.cursor = this.firstPageItemId;
    this.forward = false;
    this.invalidate();
    return true;
  }

  /** Moves the view to the next page. */
  nextPage() {
    if (this.pageInfo && !this.pageInfo.hasNextPage) {
      return false;
    }
    this.cursor = this.lastPageItemId;
    this.forward = true;
    this.invalidate();
    return true;
  }

  /**
   * Hydrates this list with initial data in the API format
   *
   * If you've already got data from the API that contains the first page of this list, you can use
   * this method to insert that data directly and avoid triggering a redundant API request.
   *
   * @param data a promise that returns the API data
   * @typeParam IdT - equivalent to T
   */
  hydrateInitial<IdT extends T & { id: string; __typename: string }>(
    data: Promise<HydrateList<IdT>>
  ) {
    this.hydrateRaw(
      data.then((value) => ({
        totalCount: value.totalCount,
        pageInfo: value.pageInfo,
        items: this.pNodes.insertNodes(value.nodes || []),
      }))
    );
  }
}

/** List hydration object (constructing this manually shouldn't be necessary as it mirrors the structure of GQL objects) */
export type HydrateList<T> = {
  totalCount: number;
  pageInfo: PageInfo;
  /** This is nullable because it's nullable in the GQL schema. In practice it should always exist */
  nodes?: (T | null)[];
};

/** Keeps a cache of DataNodes such that each NodeId has at most one associated DataNode. */
export class NodeCache {
  // TODO: garbage collection? (nodes with zero subscribers)
  /**
   * @internal
   * Internal node storage. Do not use directly.
   */
  nodes: Map<NodeIdEnc, DataNode<unknown>> = new Map();

  constructor(private queries: QueriesService) {}

  /** Creates a new node. */
  private createNode(id: NodeId) {
    const encodedId = encodeNodeId(id);
    this.nodes.set(encodedId, new DataNode(this.queries, id));
  }

  /** Returns the DataNode for the given NodeId. */
  getNode<T>(id: NodeId): DataNode<T> {
    const encodedId = encodeNodeId(id);
    if (!this.nodes.has(encodedId)) {
      this.createNode(id);
    }
    return this.nodes.get(encodedId) as DataNode<T>;
  }

  /**
   * Inserts nodes into the cache and returns them as a map (in the same order).
   *
   * Note: the ID parameter of the node is only optional for type compatibility with the GQL schema.
   * Nodes without an ID will be ignored.
   */
  insertNodes<T extends { id?: string; __typename?: string }>(
    nodes: T[]
  ): Map<NodeIdEnc, T> {
    const map = new Map();

    for (const node of nodes) {
      if (!node?.id) {
        continue;
      }
      const type = nodeTypeFromTypename(node.__typename);
      const id = { type, id: node.id };
      const dataNode: DataNode<T> = this.getNode(id);
      if (!dataNode.hasData) {
        // FIXME: different queries load different amounts of data, simple overwriting doesn't always have the desired effect
        //  S1: distinguish between nodes and "partial nodes"?
        //  S2: deep merge data?
        dataNode.insertResult(node);
      }
      map.set(encodeNodeId(id), node);
    }

    return map;
  }
}
