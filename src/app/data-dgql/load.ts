import { NodeType, NodeId, decodeNodeId, ListId, decodeListId, ListParams, ListType, ListDescriptor } from './id';
import { QueriesService } from './queries/queries.service';
import { PageInfo } from '../../generated/graphql-dgql';
import { NodeCache } from './query';

export const queryNode = (q: QueriesService) => async <T>(nodeId: NodeId): Promise<T> => {
  const { type, id } = decodeNodeId(nodeId);

  if (type === NodeType.Root) {
    throw new Error('Cannot load root node');
  }

  // TODO
  return await new Promise(() => { /* never */ });
};

/** Converts ListParams to GraphQL parameters. */
function listParams<F>(params: ListParams<F>) {
  const output: any = {};
  if (params.forward) {
    output.first = params.count;
  } else {
    output.last = params.count;
  }
  if (params.cursor) {
    if (params.forward) {
      output.after = params.cursor;
    } else {
      output.before = params.cursor;
    }
  }
  if (params.filter) {
    output.filter = params.filter;
  }
  return output;
}

type QueryInput = {
  q: QueriesService,
  c: NodeCache,
};
type ListQueries = {
  [listType: number]: {
    [nodeType: number]: (i: QueryInput, listId: ListDescriptor, params: ListParams<unknown>) => Promise<ListResult<unknown>>,
  },
};

/** Available list queries. */
const listQueries: ListQueries = {
  [ListType.Issues]: {
    [NodeType.Project]: (i, list, params) => i.q.issues.listProjectIssues(list.node.id, listParams(params)).then(data => ({
      pageInfo: data.node.issues.pageInfo,
      items: i.c.insertNodes(NodeType.Issue, data.node.issues.nodes),
    })),
    [NodeType.Component]: (i, list, params) => i.q.issues.listComponentIssues(list.node.id, listParams(params)).then(data => ({
      pageInfo: data.node.issues.pageInfo,
      items: i.c.insertNodes(NodeType.Issue, data.node.issues.nodes),
    })),
  },
  [ListType.IssuesOnLocation]: {
    [NodeType.Component]: (i, list, params) => i.q.issues.listComponentIssuesOnLocation(list.node.id, listParams(params))
      .then(data => ({
        pageInfo: data.node.issuesOnLocation.pageInfo,
        items: i.c.insertNodes(NodeType.Issue, data.node.issuesOnLocation.nodes),
      })),
    [NodeType.Interface]: (i, list, params) => i.q.issues.listComponentInterfaceIssuesOnLocation(list.node.id, listParams(params))
      .then(data => ({
        pageInfo: data.node.issuesOnLocation.pageInfo,
        items: i.c.insertNodes(NodeType.Issue, data.node.issuesOnLocation.nodes),
      })),
  },
};

export type ListResult<T> = {
  pageInfo: PageInfo,
  items: Map<NodeId, T>,
};

export const queryList = (q: QueriesService, c: NodeCache) => async <T, F>(
  listId: ListId,
  params: ListParams<F>
): Promise<ListResult<T>> => {
  const { node, type } = decodeListId(listId);

  if (!listQueries[type] || !listQueries[type][node.type]) {
    throw new Error(`${NodeType[node.type]} has no list ${ListType[type]}`);
  }

  const i = { q, c };
  return (await listQueries[type][node.type](i, { node, type }, params)) as ListResult<T>;
};
