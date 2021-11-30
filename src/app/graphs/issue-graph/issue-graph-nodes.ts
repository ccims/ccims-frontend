import {GraphComponent, GraphInterface} from '@app/data/issue-graph/graph-data';
import {IssueCategory} from 'src/generated/graphql';
import {Node} from '@ustutt/grapheditor-webcomponent/lib/node';
import {Edge} from '@ustutt/grapheditor-webcomponent/lib/edge';

export {
  IssueNode,
  ComponentNode,
  InterfaceNode,
  IssueGroupContainerNode,
  RelationEdge,
  createComponentNode,
  createInterfaceNode,
  createIssueGroupContainerNode,
  createIssueFolderNode,
  createRelationEdge,
  createConsumptionEdge,
  createInterfaceProvisionEdge,
  Position,
  getIssueFolderId
};

/**
 * The type of node shown in the graph
 */
export enum NodeType {
  Component = 'component',
  Interface = 'interface',
  InterfaceConsumer = 'interface-connect',
  IssueGroupContainer = 'issue-group-container'
}

/**
 * An abstract node on the component graph
 */
interface IssueNode extends Node {
  id: string;
  title: string;
  issueGroupContainer?: IssueGroupContainerNode;
}

/**
 * A component node on the graph
 */
interface ComponentNode extends IssueNode {
  data: GraphComponent;
}

/**
 * Create a new {@link ComponentNode}
 * @param component The component data
 * @param position The initial position, nullable
 */
function createComponentNode(component: GraphComponent, position?: Position): ComponentNode {
  return {
    ...(position || zeroPosition),
    id: component.id,
    title: component.name,
    type: NodeType.Component,
    data: component
  };
}

/**
 * An interface node on the graph
 */
interface InterfaceNode extends IssueNode {
  /**
   * The component id, which offers this interface
   */
  offeredById: string;
}

/**
 * Create a new {@link InterfaceNode}
 * @param intrface The interface data
 * @param position The initial position, nullable
 */
function createInterfaceNode(intrface: GraphInterface, position?: Position): InterfaceNode {
  return {
    ...(position || zeroPosition),
    id: intrface.id,
    title: intrface.name,
    type: NodeType.Interface,
    offeredById: intrface.offeredBy
  };
}

/**
 * An invisible node, containing multiple {@link IssueFolderNode}
 */
interface IssueGroupContainerNode extends Node {
  /**
   * The position of this container relative to the component node it belongs to.
   * Can be either 'top', 'bottom', 'left' or 'right'
   */
  position: string;
  issueGroupNodeIds: Set<string>;
}

/**
 * Create a new {@link IssueGroupContainerNode}
 * @param node The node (e.g. {@link InterfaceNode} or {@link ComponentNode}) to which this container belongs to
 */
function createIssueGroupContainerNode(node: IssueNode): IssueGroupContainerNode {
  return {
    id: `${node.id}__issue-group-container`,
    type: NodeType.IssueGroupContainer,
    dynamicTemplate: 'issue-group-container',
    x: 0,
    y: 0,
    position: 'bottom',
    issueGroupNodeIds: new Set<string>()
  };
}

/**
 * A node showing the issue folder icon
 */
interface IssueFolderNode extends Node {
  type: IssueCategory;
  issueCount: string;
}

/**
 * Creates a new {@link IssueFolderNode}
 * @param node The node (e.g. a {@link ComponentNode}) to which this issue folder belongs to
 * @param issueCategory The issue category
 * @param issueCount How many issues of this category the node has assigned to it
 */
function createIssueFolderNode(node: IssueNode, issueCategory: IssueCategory, issueCount: string): IssueFolderNode {
  return {
    id: getIssueFolderId(node.id, issueCategory),
    type: issueCategory,
    x: 0,
    y: 0,
    issues: new Set<string>(),
    issueCount
  };
}

/**
 * The arrow showing the relation between issues
 */
interface RelationEdge extends Edge {
  sourceIssues: Set<string>;
}

/**
 * Create a new {@link RelationEdge}
 * @param sourceId The source node id
 * @param targetId The target node id
 * @param edgeType The type of edge
 */
function createRelationEdge(sourceId: string, targetId: string, edgeType = FolderEdgeType.RelatedTo): RelationEdge {
  return {
    id: `s${sourceId}t${targetId}r${edgeType}`,
    source: sourceId,
    target: targetId,
    type: FolderEdgeType.RelatedTo,
    markerEnd: {
      template: 'arrow',
      relativeRotation: 0
    },
    dragHandles: [],
    sourceIssues: new Set<string>()
  };
}

/**
 * Create an edge consuming an interface
 * @param componentId The component node id consuming the interface
 * @param interfaceId The interface node id providing the interface
 */
function createConsumptionEdge(componentId: string, interfaceId: string): Edge {
  return {
    source: componentId,
    target: interfaceId,
    type: NodeType.InterfaceConsumer,
    markerEnd: {
      template: 'interface-connector',
      relativeRotation: 0
    }
  };
}

/**
 * Create an edge connecting the component with the interface this component provides
 * @param componentId The component node id providing the interface
 * @param interfaceId The interface node id
 */
function createInterfaceProvisionEdge(componentId: string, interfaceId: string): Edge {
  return {
    source: componentId,
    target: interfaceId,
    type: NodeType.Interface,
    dragHandles: []
  };
}

/**
 * Encode the node id and the issue category into a folder id
 * @param id The id of the node the folder belongs to, e.g. a {@link ComponentNode}
 * @param issueCategory The category of the issue
 */
function getIssueFolderId(id: string, issueCategory: IssueCategory): string {
  return `${id}__${issueCategory}`;
}

/**
 * A point on the component graph
 */
interface Position {
  x: number;
  y: number;
}

/**
 * The zero position on the graph
 */
const zeroPosition = {x: 0, y: 0};

/**
 * The type of the relation edge shown in between issue folders
 */
enum FolderEdgeType {
  RelatedTo = 'relatedTo',
  Depends = 'dependency',
  Duplicates = 'duplicate'
}
