import { GraphComponent, GraphInterface } from '@app/data/issue-graph/graph-data';
import { IssueCategory } from 'src/generated/graphql';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';

export {
  IssueNode, ComponentNode, InterfaceNode, IssueGroupContainerNode,
  createComponentNode, createInterfaceNode, createIssueGroupContainerNode, createIssueFolderNode,
  Position
};

interface IssueNode extends Node {
  title: string;
  issueGroupContainer?: IssueGroupContainerNode;
}

interface ComponentNode extends IssueNode {
  data: GraphComponent;
}

function createComponentNode(component: GraphComponent, position: Position): ComponentNode {
  return  {
    ...(position || zeroPosition),
    id: component.id,
    title: component.name,
    type: 'component',
    data: component,
  };
}

interface InterfaceNode extends IssueNode {
  offeredById: string;
}
function createInterfaceNode(intrface: GraphInterface, position: Position): InterfaceNode {
  return {
    ...(position || zeroPosition),
    id: intrface.id,
    title: intrface.name,
    type: 'interface',
    offeredById: intrface.offeredBy,
  };
}

interface IssueGroupContainerNode extends Node {
  position: string;
  issueGroupNodeIds: Set<string>;
}
function createIssueGroupContainerNode(node: IssueNode): IssueGroupContainerNode {
return {
  id: `${node.id}__issue-group-container`,
  type: 'issue-group-container',
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

function createIssueFolderNode(node: Node, issueCategory: IssueCategory): IssueFolderNode {
  return {
    id: getIssueFolderId(node, issueCategory),
    type: issueCategory,
    x: 0,
    y: 0,
    issues: new Set<string>(),
    issueCount: '0'
  };
}


function getIssueFolderId(node: Node, issueCategory: IssueCategory): string {
  return `${node.id}__${issueCategory}`;
}

interface Position {
  x: number;
  y: number;
}
const zeroPosition = {x: 0, y: 0};

class NodeFactory {

}

