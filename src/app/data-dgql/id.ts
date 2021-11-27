// Because Javascript does not allow objects to be comparable (i.e. apart from identity) we need to
// encode node IDs as strings such that they can be used as keys in Maps.
export type NodeIdEnc = string;
export type ListIdEnc = string;

/**
 * Backend API node types.
 * The names should match the respective value of `__typename` in the GraphQL data for any given node.
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
 * Returns the NodeType for a given `__typename` value.
 * `__typename` is a tag found in GraphQL data.
 *
 * @param typename the __typename value
 */
export function nodeTypeFromTypename(typename: string) {
  return NodeType[typename] || null;
}

/**
 * Uniquely identifies a node.
 *
 * Node IDs are composed of a {@link #type} and an {@link #id}.
 * The {@link #id} corresponds to the ID used in the backend API.
 */
export interface NodeId {
  /**
   * The type of this node.
   */
  type: NodeType;
  /**
   * The ID of this node. This is the same as the node ID in the backend API.
   */
  id: string;
}

/**
 * See {@link encodeNodeId}.
 * @param id the encoded node ID
 */
export function decodeNodeId(id: NodeIdEnc): NodeId {
  if (!id) {
    throw new Error('Could not decode node ID: no id given');
  }
  const parts = id.split('/');
  return {type: NodeType[parts[0]], id: parts[1]};
}

/**
 * Encodes a {@link NodeId} into a string.
 * This is due to a limitation in Javascript where objects cannot be `==` compared with each other
 * apart from identity. Encoding them as a string allows `NodeId`s to be used as object or `Map` keys.
 *
 * @param nd the node ID
 */
export function encodeNodeId(nd: NodeId): NodeIdEnc {
  return NodeType[nd.type] + '/' + nd.id;
}

/** The ID of the root node. */
export const ROOT_NODE = {type: NodeType.Root, id: ''};

/** The special ID of the current user node. */
export const CURRENT_USER_NODE = {type: NodeType.User, id: 'self'};

/**
 * All list types represent their respective list queries in the backend API.
 */
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

/**
 * Uniquely identifies a list of items.
 *
 * Lists are always attached to a specific node.
 * For example, a list of issues may be attached to a project or a component.
 *
 * Lists that do not have a specific parent node in the backend API are attached to the
 * {@link ROOT_NODE}.
 *
 * #### Examples
 * The list of all issues on a component:
 * ```ts
 * { node: { type: NodeType.Component, id: '...' }, type: ListType.Issues }
 * ```
 *
 * The list of linked issues on an issue:
 * ```ts
 * { node: { type: NodeType.Issue, id: '...' }, type: ListType.LinkedIssues }
 * ```
 */
export interface ListId {
  /**
   * The parent node.
   */
  node: NodeId;
  /**
   * The type of list.
   */
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

/**
 * See {@link decodeListId}.
 * @param id an encoded List ID
 */
export function decodeListId(id: ListIdEnc): ListId {
  if (!id) {
    throw new Error('Could not decode list ID: no id given');
  }
  const parts = id.split('#');
  return {node: decodeNodeId(parts[0]), type: ListType[parts[1]]};
}

/**
 * Encodes a List ID into a string.
 *
 * See {@link encodeNodeId} for more details.
 * @param ld a List ID
 */
export function encodeListId(ld: ListId): ListIdEnc {
  return encodeNodeId(ld.node) + '#' + ListType[ld.type];
}
