import { IssueType } from '@app/model/state';
import {
  Scalars, Component, IssueLocation, GetIssueGraphDataQuery, IssueCategory,
  ComponentInterface, Issue, IssuePage, ComponentPage
} from 'src/generated/graphql';

type LocationId = Scalars['ID'];

export interface GraphData {
  components: Map<LocationId, GraphComponent>;
  interfaces: Map<LocationId, GraphInterface>;
  linkIssues: GraphIssue[];
  issueLocations: Map<GraphIssue, LocationId[]>;
  issueLinks: Map<GraphIssue, GraphIssue>;
  relatedFolders: Map<GraphFolder, GraphFolder[]>;
}

interface Folder {
  issueType: IssueType;
  totalIssueCount: number;
  linkIssues: GraphIssue[];
}

type GraphFolder = [LocationId, IssueCategory];
type GraphLocation = GraphInterface | GraphComponent;

function computeRelatedFolders(linkIssues: GraphIssue[]) {
  let targetFolders: GraphFolder[];
  const relatedFolders: Map<GraphFolder, GraphFolder[]> = new Map();
  for (const issue of linkIssues) {
    for (const linkedIssue of issue.linksIssues) {
      targetFolders = linkedIssue.locations.map(locationId => [locationId, linkedIssue.category]);
    }
    const sourceFolders: GraphFolder[] = issue.locations.map(locationId => [locationId, issue.category]);
    sourceFolders.forEach(folder =>
      relatedFolders.set(folder,
        (relatedFolders.get(folder) || []).concat(targetFolders)));
  }

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

class GraphInterface {
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


class GraphComponent {
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
    const components = data.node.components.nodes.map(gqlComponent => [gqlComponent.id, GraphComponent.fromGQL(gqlComponent)]);
    // const interfaces = data.node.interfaces.nodes.map(gqlInterface => GraphInterface.fromGQL(gqlInterface));
    const componentMap = GraphComponent.mapFromGQL(data.node.components.nodes);
    const interfaceMap = GraphInterface.mapFromGQL(data.node.interfaces.nodes);
    const linkIssues = data.node.linkingIssues.nodes.map(gqlIssue => GraphIssue.fromGQL(gqlIssue));
    /*
    let interfaces = data.node.components.nodes.flatMap(component => component.interfaces.nodes.map(intrface => {
      {id: intrface.id;
        name: intrface.name;
        consumedBy: intrface.consumedBy;
       offeredBy: intrface.component.id;
    }}));
    */
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
