import { IssueType } from '@app/model/state';
import { Scalars, Component, Issue, IssueLocation, GetIssueGraphDataQuery, IssueCategory, ComponentInterface } from 'src/generated/graphql';


export interface GraphData {
  components: Map<Scalars['ID'], GraphComponent>;
  interfaces: Map<Scalars['ID'], GraphInterface>;
  linkIssues: Issue[];
  issueLocations: Map<Issue, GraphLocationId[]>;
  issueLinks: Map<Issue, Issue>;
}

interface Folder{
  issueType: IssueType;
  totalIssueCount: number;
  linkIssues: Issue[];
}

type NodeState = Folder[];

type GraphLocation = GraphInterface | GraphComponent;
type GraphLocationId = Scalars['ID'];

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
    return null;
    /*
    return {
      components: [],
      interfaces: [], issueLinks: new Map(), issueLocations: new Map()
    };
    */
  }

  /*
  static graphInterfaceFromQueryInterface( ): GraphInterface {

  }
  */
}
