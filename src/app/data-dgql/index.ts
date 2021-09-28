import { NodeId, ListId } from './id';
import { Injectable } from '@angular/core';
import { QueriesService } from './queries/queries.service';
import { DataNode, DataList, NodeCache } from './query';
import { Mutations } from '@app/data-dgql/mutate';

@Injectable({
  providedIn: 'root'
})
export default class DataService {
  nodes: NodeCache;
  lists: Map<ListId, Set<DataList<unknown, unknown>>> = new Map();
  mutations: Mutations;

  constructor(
    private queries: QueriesService
  ) {
    this.nodes = new NodeCache(queries);
    this.mutations = new Mutations(queries, this.nodes, this.invalidateLists.bind(this));
  }

  getNode<T>(id: NodeId): DataNode<T> {
    return this.nodes.getNode(id);
  }

  /** Invalidates all lists with the given ID. */
  invalidateLists(id: ListId) {
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
  }

  getList<T, F>(id: ListId): DataList<T, F> {
    const list = new DataList<T, F>(this.queries, this.nodes, id);
    if (!this.lists.has(id)) {
      this.lists.set(id, new Set());
    }
    this.lists.get(id).add(list);
    return list;
  }
}
