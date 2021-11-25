import { NodeId, ListId, ListType, encodeListId, decodeListId, ListIdEnc } from './id';
import { Injectable } from '@angular/core';
import { QueriesService } from './queries/queries.service';
import { DataNode, DataList, NodeCache } from './query';
import { Mutations } from '@app/data-dgql/mutate';

/**
 * The data service provides access to the backend API.
 * It provides automatic caching of data to reducing unnecessary requests, and a mutation API that
 * automatically propagates updates to all observers of affected data.
 *
 * To get data, use {@link #getNode} and {@link #getList}. To mutate data, use {@link #mutations}.
 */
@Injectable({
  providedIn: 'root'
})
export default class DataService {
  /**
   * @ignore
   * Internal: node cache. You probably do not need to use this directly.
   */
  nodes: NodeCache;
  /**
   * @ignore
   * internal: list of all lists. You probably do not need to use this directly.
   */
  lists: Map<ListIdEnc, Set<DataList<unknown, unknown>>> = new Map();

  /** Data mutations. */
  mutations: Mutations;

  constructor(private queries: QueriesService) {
    this.nodes = new NodeCache(queries);
    this.mutations = new Mutations(queries, this.nodes, this.invalidateLists.bind(this));
  }

  /** Returns the {@link DataNode} for the given {@link NodeId}. */
  getNode<T>(id: NodeId): DataNode<T> {
    return this.nodes.getNode(id);
  }

  /** Invalidates all lists with the given id or type. */
  invalidateLists(selector: ListId | ListType) {
    if (typeof selector === 'object') {
      const id = encodeListId(selector);
      if (!this.lists.has(id)) {
        return;
      }
      const lists = this.lists.get(id);
      for (const list of lists) {
        if (list.subscriberCount) {
          // invalidating the list causes layout changes we might not want (e.g. emptying a list)
          // list.invalidate();
          list.loadDebounced();
        }
      }
    } else {
      for (const [id, lists] of this.lists) {
        if (decodeListId(id).type === selector) {
          for (const list of lists) {
            if (list.subscriberCount) {
              list.loadDebounced();
            }
          }
        }
      }
    }
  }

  /** Returns a new {@link DataList} for the given {@link ListId}. */
  getList<T, F>(id: ListId): DataList<T, F> {
    const encodedId = encodeListId(id);
    const list = new DataList<T, F>(this.queries, this.nodes, id);
    if (!this.lists.has(encodedId)) {
      this.lists.set(encodedId, new Set());
    }
    this.lists.get(encodedId).add(list);
    return list;
  }
}
