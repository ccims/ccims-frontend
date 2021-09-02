import { Observable, Subscriber } from 'rxjs';
import { encodeNodeId, ListId, ListParams, NodeId, nodeTypeFromTypename, QueryNodeId } from './id';
import { QueriesService } from './queries/queries.service';
import { ListResult, queryList, queryNode } from './load';
import { PageInfo } from '../../generated/graphql-dgql';

const CACHE_FAST_DEBOUNCE_TIME_MS = 200;
const CACHE_INTERACTIVE_DEBOUNCE_TIME_MS = 500;
const CACHE_STALE_TIME_MS = 5000;

// TODO: passive subscribers

/**
 * A declarative query.
 *
 * @typeParam T - type of data accessible via .current
 * @typeParam R - type returned by innerQueryFn
 * @typeParam P - parameter type for innerQueryFn
 */
export class DataQuery<T, R, P> extends Observable<T> {
  id: QueryNodeId;
  loading = false; // TODO: maybe make this value observable too?
  protected currentData?: T;
  protected lastLoadTime = 0;
  protected pSetParamsNoUpdate = false;

  get hasData(): boolean {
    return this.currentData !== undefined;
  }

  get current(): T {
    return this.currentData;
  }

  protected currentQueryParams?: P;
  get params(): P | undefined {
    return this.currentQueryParams;
  }
  set params(p: P) {
    this.currentQueryParams = p;
    if (!this.pSetParamsNoUpdate) {
      this.loadDebounced();
    }
  }

  protected subscribers: Set<Subscriber<T>> = new Set();
  protected innerQueryFn: (id: QueryNodeId, p: P) => Promise<R>;
  protected innerMapFn: (r: R) => T;
  protected stateLock = 0;
  protected loadTimeout = null;
  protected hydrated = false;

  /** If true, will prolong debounce time a bit. */
  interactive = false;

  /**
   * @param id an identifier for the data being loaded
   * @param query the inner query function
   * @param map maps returned data from the query R to usable data T
   */
  constructor(id: QueryNodeId, query: (id: QueryNodeId, p: P) => Promise<R>, map: (r: R) => T) {
    super(subscriber => this.addSubscriber(subscriber));
    this.id = id;
    this.innerQueryFn = query;
    this.innerMapFn = map;
  }

  public dataAsPromise(): Promise<T> {
    if (this.hasData) {
      return Promise.resolve(this.current);
    }
    return new Promise((resolve, reject) => {
      const sub = this.subscribe(data => {
        resolve(data);
        sub.unsubscribe();
      }, error => {
        reject(error);
        sub.unsubscribe();
      });
    });
  }

  private loadImpl(fut: Promise<R>) {
    clearTimeout(this.loadTimeout);
    this.loadTimeout = null;
    this.lastLoadTime = Date.now();
    this.loading = true;

    // if load is called twice; only the newest load call will have an effect
    const stateLock = ++this.stateLock;

    fut.then(data => {
      if (stateLock !== this.stateLock) {
        return;
      }
      this.insertResult(data);
      this.loading = false;
      this.hydrated = false;
    }).catch(error => {
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

  /** Use when data has not yet been loaded but is available from elsewhere. */
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
    this.loadTimeout = setTimeout(() => {
      this.loadTimeout = null;
      this.load();
    }, interactive ? CACHE_INTERACTIVE_DEBOUNCE_TIME_MS : CACHE_FAST_DEBOUNCE_TIME_MS);
  }

  /** Deletes current data. */
  invalidate() {
    this.currentData = undefined;
    this.emitUpdateToAllSubscribers();
  }

  protected addSubscriber(subscriber: Subscriber<T>) {
    this.subscribers.add(subscriber);
    if (this.current !== undefined) {
      // data is available right now! emit current state
      subscriber.next(this.current);
    }

    if (!this.hydrated) {
      // TODO: don't call if passive
      this.loadIfNeeded();
    }

    return {
      unsubscribe: () => {
        this.subscribers.delete(subscriber);
      },
    };
  }

  emitUpdateToAllSubscribers() {
    for (const sub of this.subscribers) {
      sub.next(this.current);
    }
  }

  emitErrorToAllSubscribers(error: unknown) {
    for (const sub of this.subscribers) {
      sub.error(error);
    }
  }

  insertResult(result: R) {
    this.currentData = this.innerMapFn(result);
    this.emitUpdateToAllSubscribers();
  }

  get subscriberCount(): number {
    return this.subscribers.size;
  }
}

const identity = id => id;

/**
 * A cacheable node with no parameters.
 */
export class DataNode<T> extends DataQuery<T, T, void> {
  constructor(queries: QueriesService, id: NodeId) {
    super(id, queryNode(queries), identity);
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
 * Loads a list of items. Note that the Map is making use of ordered keys.
 */
export class DataList<T, F> extends DataQuery<Map<NodeId, T>, ListResult<T>, ListParams<F>> {
  private pCursor?: NodeId;
  private pCount = 10;
  private pFilter?: F;
  private pForward = true;
  private pageInfo?: PageInfo;
  private pTotalCount?: number;
  private previouslyHadPageContents = false;
  private pNodes: NodeCache;

  constructor(queries: QueriesService, nodes: NodeCache, id: ListId) {
    super(id, queryList(queries, nodes), result => {
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

  setParams() {
    this.params = {
      cursor: this.pCursor,
      count: this.pCount,
      forward: this.pForward,
      filter: this.pFilter,
    };
  }

  get totalCount() {
    return this.pTotalCount;
  }

  get currentItems(): T[] {
    if (!this.hasData) {
      return [];
    }
    return [...this.current.values()];
  }

  get filter(): F | undefined {
    return this.pFilter;
  }
  set filter(f: F) {
    this.pFilter = f;
    this.setParams();
  }

  get cursor(): NodeId {
    return this.pCursor;
  }
  set cursor(c: NodeId) {
    this.pCursor = c;
    this.setParams();
  }

  get count(): number {
    return this.pCount;
  }
  set count(c: number) {
    this.pCount = c;
    this.setParams();
  }

  get forward(): boolean {
    return this.pForward;
  }
  set forward(f: boolean) {
    this.pForward = f;
    this.setParams();
  }

  get firstPageItemId(): NodeId | null {
    return this.current ? this.current.keys().next()?.value || null : null;
  }

  get lastPageItemId(): NodeId | null {
    if (!this.current) {
      return;
    }
    const keys = [...this.current.keys()];
    return keys[keys.length - 1] || null;
  }

  get hasPrevPage() {
    return !this.pageInfo || this.pageInfo.hasPreviousPage;
  }
  get hasNextPage() {
    return !this.pageInfo || this.pageInfo.hasNextPage;
  }

  firstPage() {
    this.cursor = null;
    this.forward = true;
    this.previouslyHadPageContents = false;
    this.invalidate();
    return true;
  }

  prevPage() {
    if (this.pageInfo && !this.pageInfo.hasPreviousPage) {
      return false;
    }
    this.cursor = this.firstPageItemId;
    this.forward = false;
    this.invalidate();
    return true;
  }

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
   * Hydrates this list with initial data in the API format (e.g. loaded from a node request).
   * @param type NodeType of the list (implementation detail! ideally this would not be part of this API)
   * @param data a promise that returns the API data
   */
  hydrateInitial<IdT extends T & { id: string, __typename: string }>(data: Promise<HydrateList<IdT>>) {
    this.hydrateRaw(data.then(value => ({
      totalCount: value.totalCount,
      pageInfo: value.pageInfo,
      items: this.pNodes.insertNodes(value.nodes || [])
    })));
  }
}

export type HydrateList<T> = {
  totalCount: number,
  pageInfo: PageInfo,
  /** This is nullable because it's nullable in the GQL schema. In practice it should always exist */
  nodes?: (T | null)[]
};

export class NodeCache {
  // TODO: garbage collection?
  nodes: Map<NodeId, DataNode<unknown>> = new Map();

  constructor(private queries: QueriesService) {}

  private createNode(id: NodeId) {
    this.nodes.set(id, new DataNode(this.queries, id));
  }

  getNode<T>(id: NodeId): DataNode<T> {
    if (!this.nodes.has(id)) {
      this.createNode(id);
    }
    return this.nodes.get(id) as DataNode<T>;
  }

  /**
   * Inserts nodes into the cache and returns them as a map (in the same order).
   *
   * Note: the ID parameter of the node is only optional for type compatibility with the GQL schema.
   * Nodes without an ID will be ignored.
   */
  insertNodes<T extends { id?: string, __typename?: string }>(nodes: T[]) {
    const map = new Map();

    for (const node of nodes) {
      if (!node?.id) {
        continue;
      }
      const type = nodeTypeFromTypename(node.__typename);
      const dataNode: DataNode<T> = this.getNode(encodeNodeId({ type, id: node.id }));
      if (!dataNode.hasData) {
        // FIXME: different queries load different amounts of data, simple overwriting doesn't work
        //  S1: distinguish between nodes and "partial nodes"?
        //  S2: deep merge data?
        dataNode.insertResult(node);
      }
      map.set(node.id, node);
    }

    return map;
  }
}

