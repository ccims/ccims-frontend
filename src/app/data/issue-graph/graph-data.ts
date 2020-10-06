import { IssueType } from '@app/model/state';
import {
  Scalars, Component, IssueLocation, GetIssueGraphDataQuery, IssueCategory,
  ComponentInterface, Issue, IssuePage, ComponentPage
} from 'src/generated/graphql';

import { Dictionary, DefaultDictionary } from 'typescript-collections';

type LocationId = Scalars['ID'];

export interface GraphData {
  components: Map<LocationId, GraphComponent>;
  interfaces: Map<LocationId, GraphInterface>;
  // linkIssues: GraphIssue[];
  //issueLocations: Map<GraphIssue, LocationId[]>;
  //issueLinks: Dictionary<GraphIssue, GraphIssue>;
  //relatedFolders: DefaultDictionary<GraphFolder, GraphFolder[]>;
}

interface Folder {
  issueType: IssueType;
  totalIssueCount: number;
  linkIssues: GraphIssue[];
}

type GraphFolder = [LocationId, IssueCategory];
type GraphLocation = GraphInterface | GraphComponent;

function computeRelatedFolders(linkIssues: GraphIssue[]): DefaultDictionary<GraphFolder, GraphFolder[]> {
  let targetFolders: GraphFolder[];
  const relatedFolders: DefaultDictionary<GraphFolder, GraphFolder[]> = new DefaultDictionary<GraphFolder, GraphFolder[]>(() => []);
  for (const issue of linkIssues) {
    const sourceFolders: GraphFolder[] = issue.locations.map(locationId => [locationId, issue.category]);
    for (const linkedIssue of issue.linksIssues) {
      targetFolders = linkedIssue.locations.map(locationId => [locationId, linkedIssue.category]);
    }
    sourceFolders.forEach(folder =>
      relatedFolders.setValue(folder,
        (relatedFolders.getValue(folder).concat(targetFolders))));
  }
  return relatedFolders;
}



function issueCounts(bugCount: number, featureRequestCount: number, unclassifiedCount: number): Map<IssueCategory, number> {
  return new Map([
    [IssueCategory.Bug, bugCount],
    [IssueCategory.FeatureRequest, featureRequestCount],
    [IssueCategory.Unclassified, unclassifiedCount]
  ]);
}

type GQLInterface = Pick<ComponentInterface, 'id' | 'name'> & {
  bugs?: Pick<IssuePage, 'totalCount'>;
  featureRequests?: Pick<IssuePage, 'totalCount'>;
  unclassified?: Pick<IssuePage, 'totalCount'>;
  consumedBy?: { nodes?: Pick<Component, 'id'>[]; };
  component: Pick<Component, 'id'>;
};

export class GraphInterface {
  id: Scalars['ID'];
  name: string;
  offeredBy: Scalars['ID'];
  consumedBy: Scalars['ID'][];
  issues: Map<IssueCategory, number>;

  static fromGQL(gqlInterface: GQLInterface): GraphInterface {
    const issues = issueCounts(gqlInterface.bugs.totalCount,
      gqlInterface.featureRequests.totalCount,
      gqlInterface.unclassified.totalCount);
    return {
      id: gqlInterface.id,
      name: gqlInterface.name,
      offeredBy: gqlInterface.component.id,
      consumedBy: gqlInterface.consumedBy.nodes.map(component => component.id),
      issues
    };
  }
  static mapFromGQL(gqlInterfaces: GQLInterface[]): Map<LocationId, GraphInterface> {
    return new Map(gqlInterfaces.map(gqlInterface => [gqlInterface.id, GraphInterface.fromGQL(gqlInterface)]));
  }
}


type GQLGraphComponent = Pick<Component, 'name' | 'id'> & {
  bugs?: Pick<IssuePage, 'totalCount'>;
  featureRequests?: Pick<IssuePage, 'totalCount'>;
  unclassified?: Pick<IssuePage, 'totalCount'>;
};


export class GraphComponent {
  name: string;
  id: Scalars['ID'];
  issues: Map<IssueCategory, number>;

  static fromGQL(gqlGraphComponent: GQLGraphComponent): GraphComponent {
    const issues = issueCounts(gqlGraphComponent.bugs.totalCount,
      gqlGraphComponent.featureRequests.totalCount,
      gqlGraphComponent.unclassified.totalCount);
    return {
      id: gqlGraphComponent.id,
      name: gqlGraphComponent.name,
      issues
    };
  }

  static mapFromGQL(gqlGraphComponents: GQLGraphComponent[]): Map<LocationId, GraphComponent> {
    return new Map(gqlGraphComponents.map(gqlComponent => [gqlComponent.id, GraphComponent.fromGQL(gqlComponent)]));
  }
}

type GQLIssue = Pick<Issue, 'id' | 'category'> & {
  locations?: {
    nodes?: (Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>)[];
  };
  linksToIssues?: {
    nodes?: (Pick<Issue, 'id' | 'category'> & { locations?: { nodes?: (Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>)[]; }; })[];
  };
};

class GraphIssue {
  id: Scalars['ID'];
  category: IssueCategory;
  locations: LocationId[];
  linksIssues?: GraphIssue[];

  static fromGQLNoLinks(gqlPartialIssue: Pick<GQLIssue, 'id' | 'category' | 'locations'>) {
    return {
      id: gqlPartialIssue.id,
      category: gqlPartialIssue.category,
      locations: gqlPartialIssue.locations.nodes.map(location => location.id)
    };
  }

  static fromGQL(gqlIssue: GQLIssue): GraphIssue {
    const issue: GraphIssue = this.fromGQLNoLinks(gqlIssue);
    issue.linksIssues = gqlIssue.linksToIssues.nodes.map(gqlPartialIssue => this.fromGQLNoLinks(gqlPartialIssue));
    return issue;
  }

}


export class GraphDataFactory {
  static graphDataFromGQL(data: GetIssueGraphDataQuery): GraphData {
    //const components = data.node.components.nodes.map(gqlComponent => [gqlComponent.id, GraphComponent.fromGQL(gqlComponent)]);
    // const interfaces = data.node.interfaces.nodes.map(gqlInterface => GraphInterface.fromGQL(gqlInterface));
    const components = GraphComponent.mapFromGQL(data.node.components.nodes);
    const interfaces = GraphInterface.mapFromGQL(data.node.interfaces.nodes);
    const linkIssues = data.node.linkingIssues.nodes.map(gqlIssue => GraphIssue.fromGQL(gqlIssue));
    const relatedFolders = computeRelatedFolders(linkIssues);
    console.log(components, interfaces);
    return {
      components, interfaces,// linkIssues, relatedFolders
    };
  }

  static graphDataMock(): GraphData {

    const issueCount1: Map<IssueCategory, number> = issueCounts(1,2,3);
    const issueCount2: Map<IssueCategory, number> = issueCounts(4,5,6);

    const component: GraphComponent = {
      id: "1",
      name: "TestComponent",
      issues: issueCount1
    };
    const interFace: GraphInterface = {
      id: "2",
      name: "TestInterface",
      offeredBy: "1",
      issues:issueCount2,
      consumedBy:[]
    };
    const data: GraphData = {
      components: new Map([[component.id, component]]),
      interfaces: new Map([[interFace.id, interFace]])
    };
    return data;
  }

  /*
  static graphInterfaceFromQueryInterface( ): GraphInterface {

  }
  */
}
