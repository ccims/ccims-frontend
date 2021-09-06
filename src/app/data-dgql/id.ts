// Because Javascript does not allow objects to be comparable (i.e. apart from identity) we need to
// encode node IDs as strings such that they can be used as keys in Maps.
export type QueryNodeId = string;
export type NodeId = string;
export type ListId = string;

export enum NodeType {
  Root,
  Component,
  ComponentInterface,
  Issue,
  IssueTimelineItem,
  Label,
  Project,
  Artifact,
  User
}

export function nodeTypeFromTypename(typename: string) {
  return NodeType[typename] || null;
}

export interface NodeDescriptor {
  type: NodeType;
  id: string;
}

export function decodeNodeId(id: NodeId): NodeDescriptor {
  if (!id) {
    throw new Error('Could not decode node ID: no id given');
  }
  const parts = id.split('/');
  return { type: NodeType[parts[0]], id: parts[1] };
}

export function encodeNodeId(nd: NodeDescriptor): NodeId {
  return NodeType[nd.type] + '/' + nd.id;
}

export const ROOT_NODE = { type: NodeType.Root, id: '' };
export const ROOT_NODE_ID = encodeNodeId(ROOT_NODE);

export enum ListType {
  Projects,
  Components,
  ComponentInterfaces,
  Issues,
  IssuesOnLocation,
  IssueLocations,
  TimelineItems,
  Labels,
  Artifacts,
  Participants,
  Assignees,
  SearchUsers,
  LinkedIssues,
  LinkedByIssues
}

export interface ListDescriptor {
  node: NodeDescriptor;
  type: ListType;
}

/** List cursor and filter. */
export interface ListParams<F> {
  /** Cursor node. */
  cursor?: NodeId;
  /** Max number of items to load. */
  count: number;
  /** Whether to look forward from the cursor, or backwards. */
  forward: boolean;
  /** The filter. */
  filter?: F;
}

export function decodeListId(id: ListId): ListDescriptor {
  if (!id) {
    throw new Error('Could not decode list ID: no id given');
  }
  const parts = id.split('#');
  return { node: decodeNodeId(parts[0]), type: ListType[parts[1]] };
}

export function encodeListId(ld: ListDescriptor): ListId {
  return encodeNodeId(ld.node) + '#' + ListType[ld.type];
}
