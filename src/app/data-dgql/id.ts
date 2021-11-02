// Because Javascript does not allow objects to be comparable (i.e. apart from identity) we need to
// encode node IDs as strings such that they can be used as keys in Maps.
export type NodeIdEnc = string;
export type ListIdEnc = string;

/**
 * API node types. The names should match the respective value of __typename for a given node.
 */
export enum NodeType {
  Root,
  Component,
  ComponentInterface,
  Issue,
  IssueTimelineItem,
  Label,
  Project,
  Artifact,
  User,
  IssueComment
}

/**
 * Returns the NodeType for a given __typename value.
 * @param typename the __typename value
 */
export function nodeTypeFromTypename(typename: string) {
  return NodeType[typename] || null;
}

export interface NodeId {
  type: NodeType;
  id: string;
}

export function decodeNodeId(id: NodeIdEnc): NodeId {
  if (!id) {
    throw new Error('Could not decode node ID: no id given');
  }
  const parts = id.split('/');
  return { type: NodeType[parts[0]], id: parts[1] };
}

export function encodeNodeId(nd: NodeId): NodeIdEnc {
  return NodeType[nd.type] + '/' + nd.id;
}

export const ROOT_NODE = { type: NodeType.Root, id: '' };

export const CURRENT_USER_NODE = { type: NodeType.User, id: 'self' };

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

export interface ListId {
  node: NodeId;
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

export function decodeListId(id: ListIdEnc): ListId {
  if (!id) {
    throw new Error('Could not decode list ID: no id given');
  }
  const parts = id.split('#');
  return { node: decodeNodeId(parts[0]), type: ListType[parts[1]] };
}

export function encodeListId(ld: ListId): ListIdEnc {
  return encodeNodeId(ld.node) + '#' + ListType[ld.type];
}
