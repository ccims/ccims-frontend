import { NodeType, NodeId, decodeNodeId, ListId, decodeListId, ListParams, ListType, ListDescriptor, NodeDescriptor } from './id';
import { QueriesService } from './queries/queries.service';
import { PageInfo } from '../../generated/graphql-dgql';
import { NodeCache } from './query';

type NodeQueryInput = {
  q: QueriesService,
};

type NodeQueries = {
  [nodeType: number]: (i: NodeQueryInput, id: string) => Promise<unknown>,
};

const nodeQueries: NodeQueries = {
  [NodeType.Project]: (i, id) => i.q.projects.getProject(id).then(data => data.node),
  [NodeType.Issue]: (i, id) => i.q.issues.getIssueHeader(id).then(data => data.node),
};

export const queryNode = (q: QueriesService) => async <T>(nodeId: NodeId): Promise<T> => {
  const { type, id } = decodeNodeId(nodeId);

  if (!nodeQueries[type]) {
    throw new Error(`${NodeType[type]} cannot be loaded directly`);
  }

  const i = { q };
  return (await nodeQueries[type](i, id)) as T;
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

type ListQueryInput = {
  q: QueriesService,
  c: NodeCache,
};

type ListQueries = {
  [listType: number]: {
    [nodeType: number]: (i: ListQueryInput, listId: ListDescriptor, params: ListParams<unknown>) => Promise<ListResult<unknown>>,
  },
};

/** Available list queries. */
const listQueries: ListQueries = {
  [ListType.Projects]: {
    [NodeType.Root]: (i, list, params) => i.q.projects.listProjects(listParams(params)).then(data => ({
      totalCount: data.projects.totalCount,
      pageInfo: data.projects.pageInfo,
      items: i.c.insertNodes(NodeType.Project, data.projects.nodes),
    })),
  },
  [ListType.Issues]: {
    [NodeType.Project]: (i, list, params) => i.q.issues.listProjectIssues(list.node.id, listParams(params)).then(data => ({
      totalCount: data.node.issues.totalCount,
      pageInfo: data.node.issues.pageInfo,
      items: i.c.insertNodes(NodeType.Issue, data.node.issues.nodes),
    })),
    [NodeType.Component]: (i, list, params) => i.q.issues.listComponentIssues(list.node.id, listParams(params)).then(data => ({
      totalCount: data.node.issues.totalCount,
      pageInfo: data.node.issues.pageInfo,
      items: i.c.insertNodes(NodeType.Issue, data.node.issues.nodes),
    })),
  },
  [ListType.IssuesOnLocation]: {
    [NodeType.Component]: (i, list, params) => i.q.issues.listComponentIssuesOnLocation(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.issuesOnLocation.totalCount,
        pageInfo: data.node.issuesOnLocation.pageInfo,
        items: i.c.insertNodes(NodeType.Issue, data.node.issuesOnLocation.nodes),
      })),
    [NodeType.Interface]: (i, list, params) => i.q.issues.listComponentInterfaceIssuesOnLocation(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.issuesOnLocation.totalCount,
        pageInfo: data.node.issuesOnLocation.pageInfo,
        items: i.c.insertNodes(NodeType.Issue, data.node.issuesOnLocation.nodes),
      })),
  },
  [ListType.TimelineItems]: {
    [NodeType.Issue]: (i, list, params) => i.q.issues.listIssueTimelineItems(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.timeline.totalCount,
        pageInfo: data.node.timeline.pageInfo,
        items: i.c.insertNodes(NodeType.TimelineItem, data.node.timeline.nodes),
      })),
  }
};

export type ListResult<T> = {
  totalCount: number,
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
