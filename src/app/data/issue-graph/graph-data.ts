import { IssueType } from '@app/model/state';
import { Interface } from 'readline';
import { Scalars, Component, Issue, IssueLocation, GetIssueGraphDataQuery, IssueCategory, ComponentInterface } from 'src/generated/graphql';


export interface GraphData {
  components: GraphComponent[];
  interfaces: GraphInterface[];
  issueLocations: Map<Issue, GraphIssueLocation>;
  issueLinks: Map<Issue, Issue>;
}

interface Folder{
  issueType: IssueType;
  totalIssueCount: number;
  linkIssues: Issue[];
}

type NodeState = Folder[];

type GraphIssueLocation = GraphInterface | GraphComponent;

export interface  GraphInterface {
  name: string;
  id: Scalars['ID'];
  offeredBy: Scalars['ID'];
  consumedBy: Scalars['ID'];
  issues: Map<IssueCategory, Issue>;
}

export interface GraphComponent {
  name: string;
  id: Scalars['ID'];
  issues: Map<IssueCategory, Issue>;
}

export class GraphDataFactory {
  static graphDataFromGQL(data: GetIssueGraphDataQuery): GraphData {
    let interfaces = data.node.components.nodes.flatMap(component => component.interfaces.nodes.map(intrface => {
      {id: intrface.id;
        name: intrface.name;
        consumedBy: intrface.consumedBy;
       offeredBy: intrface.component.id;
    }}));
    return {
      components: [],
      interfaces: [], issueLinks: new Map(), issueLocations: new Map()
    };
  }

  type
  static graphInterfaceFromQueryInterface( ): GraphInterface {

  }
}
