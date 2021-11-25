import {
  GraphComponent,
  GraphInterface,
} from '@app/data/issue-graph/graph-data';
import { IssueCategory } from 'src/generated/graphql';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Edge } from '@ustutt/grapheditor-webcomponent/lib/edge';

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
  getIssueFolderId,
};

export enum NodeType {
  Component = 'component',
  Interface = 'interface',
  InterfaceConsumer = 'interface-connect',
  IssueGroupContainer = 'issue-group-container',
}

/**
 * This file includes type definitions and creation functions (think constructors)
 * for nodes and edges that are added to the graph editor in order to visualize the project.
 * Since the data that is stored with these differs based on what they represent (e.g.
 * interface vs component node) we give each their own type. We do this by extending
 * the Node class or the Edge class of the grapheditor. These classes are instantiated
 * via calls to the contained create* functions within the drawGraph method of the IssueGraphComponent.
 */

interface IssueNode extends Node {
  id: string;
  title: string;
  issueGroupContainer?: IssueGroupContainerNode;
}

interface ComponentNode extends IssueNode {
  data: GraphComponent;
}

function createComponentNode(
  component: GraphComponent,
  position: Position
): ComponentNode {
  return {
    ...(position || zeroPosition),
    id: component.id,
    title: component.name,
    type: NodeType.Component,
    data: component,
  };
}

interface InterfaceNode extends IssueNode {
  offeredById: string;
}

function createInterfaceNode(
  intrface: GraphInterface,
  position: Position
): InterfaceNode {
  return {
    ...(position || zeroPosition),
    id: intrface.id,
    title: intrface.name,
    type: NodeType.Interface,
    offeredById: intrface.offeredBy,
  };
}

interface IssueGroupContainerNode extends Node {
  position: string;
  issueGroupNodeIds: Set<string>;
}

function createIssueGroupContainerNode(
  node: IssueNode
): IssueGroupContainerNode {
  return {
    id: `${node.id}__issue-group-container`,
    type: NodeType.IssueGroupContainer,
    dynamicTemplate: 'issue-group-container',
    x: 0,
    y: 0,
    position: 'bottom',
    issueGroupNodeIds: new Set<string>(),
  };
}

interface IssueFolderNode extends Node {
  type: IssueCategory;
  issueCount: string;
}

function createIssueFolderNode(
  node: IssueNode,
  issueCategory: IssueCategory,
  issueCount: string
): IssueFolderNode {
  return {
    id: getIssueFolderId(node.id, issueCategory),
    type: issueCategory,
    x: 0,
    y: 0,
    issues: new Set<string>(),
    issueCount,
  };
}

interface RelationEdge extends Edge {
  sourceIssues: Set<string>;
}

function createRelationEdge(
  sourceId: string,
  targetId: string,
  edgeType = folderEdgeTypes.RelatedTo
): RelationEdge {
  return {
    id: `s${sourceId}t${targetId}r${edgeType}`,
    source: sourceId,
    target: targetId,
    type: folderEdgeTypes.RelatedTo,
    markerEnd: {
      template: 'arrow',
      relativeRotation: 0,
    },
    dragHandles: [],
    sourceIssues: new Set<string>(),
  };
}

function createConsumptionEdge(componentId: string, interfaceId: string): Edge {
  return {
    source: componentId,
    target: interfaceId,
    type: NodeType.InterfaceConsumer,
    markerEnd: {
      template: 'interface-connector',
      relativeRotation: 0,
    },
  };
}

function createInterfaceProvisionEdge(
  componentId: string,
  interfaceId: string
): Edge {
  return {
    source: componentId,
    target: interfaceId,
    type: NodeType.Interface,
    dragHandles: [],
  };
}

function getIssueFolderId(id: string, issueCategory: IssueCategory): string {
  return `${id}__${issueCategory}`;
}

interface Position {
  x: number;
  y: number;
}

const zeroPosition = { x: 0, y: 0 };

enum folderEdgeTypes {
  RelatedTo = 'relatedTo',
  Depends = 'dependency',
  Duplicates = 'duplicate',
}
