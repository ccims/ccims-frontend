import { NodeId, ListId } from './id';
import { Injectable } from '@angular/core';
import { QueriesService } from './queries/queries.service';
import { DataNode, DataList, NodeCache } from './query';

@Injectable({
  providedIn: 'root'
})
export default class DataService {
  nodes: NodeCache;

  constructor(
    private queries: QueriesService
  ) {
    this.nodes = new NodeCache(queries);
  }

  getNode<T>(id: NodeId): DataNode<T> {
    return this.nodes.getNode(id);
  }

  getList<T, F>(id: ListId): DataList<T, F> {
    return new DataList(this.queries, this.nodes, id);
  }
}
