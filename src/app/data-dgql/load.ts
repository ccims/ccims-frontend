import {
  NodeType,
  NodeId,
  ListParams,
  ListType,
  CURRENT_USER_NODE, NodeIdEnc, ListId
} from './id';
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
  [NodeType.Component]: (i, id) => i.q.components.getComponent(id).then(data => data.node),
  [NodeType.ComponentInterface]: (i, id) => i.q.components.getInterface(id).then(data => data.node),
  [NodeType.Issue]: (i, id) => i.q.issues.getIssueHeader(id).then(data => data.node),
  [NodeType.User]: (i, id) => id === CURRENT_USER_NODE.id
    ? i.q.users.currentUser().then(data => data.currentUser)
    : Promise.reject(new Error('not implemented')),
  [NodeType.Label]: (i, id) => i.q.issues.getLabel(id).then(data => data.node)
};

export const queryNode = (q: QueriesService) => async <T>(nodeId: NodeId): Promise<T> => {
  const { type, id } = nodeId;

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
      output.after = params.cursor.id;
    } else {
      output.before = params.cursor.id;
    }
  }
  if (params.filter) {
    output.filterBy = params.filter;
  }
  return output;
}

type ListQueryInput = {
  q: QueriesService,
  c: NodeCache,
};

type ListQueries = {
  [listType: number]: {
    [nodeType: number]: (i: ListQueryInput, listId: ListId, params: ListParams<unknown>) => Promise<ListResult<unknown>>,
  },
};

/** Available list queries. */
const listQueries: ListQueries = {
  [ListType.Projects]: {
    [NodeType.Root]: (i, list, params) => i.q.projects.listProjects(listParams(params)).then(data => ({
      totalCount: data.projects.totalCount,
      pageInfo: data.projects.pageInfo,
      items: i.c.insertNodes(data.projects.nodes),
    })),
  },
  [ListType.Components]: {
    [NodeType.Project]: (i, list, params) => i.q.components.listProjectComponents(list.node.id, listParams(params)).then(data => ({
      totalCount: data.node.components.totalCount,
      pageInfo: data.node.components.pageInfo,
      items: i.c.insertNodes(data.node.components.nodes),
    })),
    [NodeType.Issue]: (i, list, params) => i.q.issues.listIssueComponents(list.node.id, listParams(params)).then(data => ({
      totalCount: data.node.components.totalCount,
      pageInfo: data.node.components.pageInfo,
      items: i.c.insertNodes(data.node.components.nodes),
    })),
    [NodeType.Label]: (i, list, params) => i.q.issues.listLabelComponents(list.node.id, listParams(params)).then(data => ({
      totalCount: data.node.components.totalCount,
      pageInfo: data.node.components.pageInfo,
      items: i.c.insertNodes(data.node.components.nodes),
    }))
  },
  [ListType.ComponentInterfaces]: {
    [NodeType.Project]: (i, list, params) => i.q.components.listProjectInterfaces(list.node.id, listParams(params)).then(data => ({
      totalCount: data.node.interfaces.totalCount,
      pageInfo: data.node.interfaces.pageInfo,
      items: i.c.insertNodes(data.node.interfaces.nodes),
    })),
  },
  [ListType.Issues]: {
    [NodeType.Project]: (i, list, params) => i.q.issues.listProjectIssues(list.node.id, listParams(params)).then(data => ({
      totalCount: data.node.issues.totalCount,
      pageInfo: data.node.issues.pageInfo,
      items: i.c.insertNodes(data.node.issues.nodes),
    })),
    [NodeType.Component]: (i, list, params) => i.q.issues.listComponentIssues(list.node.id, listParams(params)).then(data => ({
      totalCount: data.node.issues.totalCount,
      pageInfo: data.node.issues.pageInfo,
      items: i.c.insertNodes(data.node.issues.nodes),
    })),
  },
  [ListType.IssuesOnLocation]: {
    [NodeType.Component]: (i, list, params) => i.q.issues.listComponentIssuesOnLocation(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.issuesOnLocation.totalCount,
        pageInfo: data.node.issuesOnLocation.pageInfo,
        items: i.c.insertNodes(data.node.issuesOnLocation.nodes),
      })),
    [NodeType.ComponentInterface]: (i, list, params) => i.q.issues.listComponentInterfaceIssuesOnLocation(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.issuesOnLocation.totalCount,
        pageInfo: data.node.issuesOnLocation.pageInfo,
        items: i.c.insertNodes(data.node.issuesOnLocation.nodes),
      })),
  },
  [ListType.TimelineItems]: {
    [NodeType.Issue]: (i, list, params) => i.q.issues.listIssueTimelineItems(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.timeline.totalCount,
        pageInfo: data.node.timeline.pageInfo,
        items: i.c.insertNodes(data.node.timeline.nodes),
      })),
  },
  [ListType.IssueLocations]: {
    [NodeType.Issue]: (i, list, params) => i.q.issues.listIssueLocations(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.locations.totalCount,
        pageInfo: data.node.locations.pageInfo,
        items: i.c.insertNodes(data.node.locations.nodes),
      }))
  },
  [ListType.Labels]: {
    [NodeType.Project]: (i, list, params) => i.q.issues.listProjectLabels(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.labels.totalCount,
        pageInfo: data.node.labels.pageInfo,
        items: i.c.insertNodes(data.node.labels.nodes)
      })),
    [NodeType.Component]: (i, list, params) => i.q.issues.listComponentLabels(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.labels.totalCount,
        pageInfo: data.node.labels.pageInfo,
        items: i.c.insertNodes(data.node.labels.nodes)
      })),
    [NodeType.Issue]: (i, list, params) => i.q.issues.listIssueLabels(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.labels.totalCount,
        pageInfo: data.node.labels.pageInfo,
        items: i.c.insertNodes(data.node.labels.nodes)
      }))
  },
  [ListType.Assignees]: {
    [NodeType.Issue]: (i, list, params) => i.q.issues.listIssueAssignees(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.assignees.totalCount,
        pageInfo: data.node.assignees.pageInfo,
        items: i.c.insertNodes(data.node.assignees.nodes)
      }))
  },
  [ListType.LinkedIssues]: {
    [NodeType.Issue]: (i, list, params) => i.q.issues.listIssueLinksToIssues(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.linksToIssues.totalCount,
        pageInfo: data.node.linksToIssues.pageInfo,
        items: i.c.insertNodes(data.node.linksToIssues.nodes)
      }))
  },
  [ListType.LinkedByIssues]: {
    [NodeType.Issue]: (i, list, params) => i.q.issues.listIssueLinkedByIssues(list.node.id, listParams(params))
      .then(data => ({
        totalCount: data.node.linkedByIssues.totalCount,
        pageInfo: data.node.linkedByIssues.pageInfo,
        items: i.c.insertNodes(data.node.linkedByIssues.nodes)
      }))
  },
  [ListType.SearchUsers]: {
    [NodeType.Root]: (i, list, params) => i.q.users.searchUsers(params.filter as (string | { username: string }))
      .then(data => ({
        totalCount: data.length,
        pageInfo: {
          startCursor: data[0]?.id || null,
          endCursor: data[data.length - 1]?.id || null,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        items: i.c.insertNodes(data)
      }))
  }
};

export type ListResult<T> = {
  totalCount: number,
  pageInfo: PageInfo,
  items: Map<NodeIdEnc, T>,
};

export const queryList = (q: QueriesService, c: NodeCache) => async <T, F>(
  listId: ListId,
  params: ListParams<F>
): Promise<ListResult<T>> => {
  const { node, type } = listId;

  if (!listQueries[type] || !listQueries[type][node.type]) {
    throw new Error(`${NodeType[node.type]} has no list ${ListType[type]}`);
  }

  const i = { q, c };
  return (await listQueries[type][node.type](i, { node, type }, params)) as ListResult<T>;
};
