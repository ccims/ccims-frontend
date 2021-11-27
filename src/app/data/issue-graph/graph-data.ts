import {
  Component,
  ComponentInterface,
  GetIssueGraphDataDocument,
  GetIssueGraphDataQuery,
  Issue,
  IssueCategory,
  IssuePage,
  Maybe,
  Scalars
} from 'src/generated/graphql';
import {DefaultDictionary} from 'typescript-collections';

type LocationId = Scalars['ID'];
type GraphFolder = [LocationId, IssueCategory];
type GraphLocation = GraphInterface | GraphComponent;

/**
 * Describes data needed by IssueGraphComponent to draw the graph.
 */
export interface GraphData {
  components: Map<LocationId, GraphComponent>;
  interfaces: Map<LocationId, GraphInterface>;
  // graphLocations is the union of all components and interfaces
  graphLocations: Map<string, GraphLocation>;
  relatedFolders: DefaultDictionary<GraphFolder, GraphFolder[]>;
  linkIssues: GraphIssue[];
}

export class GraphDataFactory {
  /**
   * Removes the counts for issue categories which are filtered. This is a workaround
   * needed because the backend doesn't allow us to only ask for the counts of non-filtered categories.
   * @param graphData the data with the unnecessary counts
   * @param activeCategories the categories corresponding to the activated toggles of the graph component
   */
  static removeFilteredData(graphData: GraphData, activeCategories: IssueCategory[]) {
    for (const location of graphData.graphLocations.values()) {
      location.issues = new Map([...location.issues].filter(([category, count]) => activeCategories.includes(category)));
    }
    return graphData;
  }

  /**
   * Converts the data required for the graph from the format the backend delivers into a
   * GraphData object as needed by the IssueGraphComponent for rendering.
   */
  static graphDataFromGQL(data: GetIssueGraphDataQuery): GraphData {
    const components = GraphComponent.mapFromGQL(data.node.components.nodes);
    const interfaces = GraphInterface.mapFromGQL(data.node.interfaces.nodes);
    const graphLocations: Map<string, GraphLocation> = new Map([...components, ...interfaces]);
    const linkIssues = data.node.linkingIssues.nodes.map((gqlIssue) => GraphIssue.fromGQL(gqlIssue));
    const relatedFolders = computeRelatedFolders(linkIssues, interfaces);
    return {
      components,
      interfaces,
      graphLocations,
      relatedFolders,
      linkIssues
    };
  }
}

/**
 * @param locationIds ids of components and interfaces
 * @param interfaces mapping from
 * @returns locationIds with ids of components offering interfaces whoose id is alo in locationIds removed
 */
function removeOfferingComponents(locationIds: string[], interfaces: Map<LocationId, GraphInterface>) {
  // compute components that offer an interface whoose id is in locationIds
  const interfaceOfferingComponents: Set<string> = new Set(
    locationIds.filter((locationId) => interfaces.has(locationId)).map((interfaceId) => interfaces.get(interfaceId).offeredBy)
  );
  // return location ids with the components offering an interface with id in locationIds removed
  return locationIds.filter((id) => !interfaceOfferingComponents.has(id));
}

/**
 * Issues counts
 * @param bugCount number of bugs
 * @param featureRequestCount number of feature requests
 * @param unclassifiedCount number of unclassified issues
 * @returns counts mapping IssueCategory values to the count specified by arguments
 */
function issueCounts(bugCount: number, featureRequestCount: number, unclassifiedCount: number): Map<IssueCategory, number> {
  return new Map([
    [IssueCategory.Bug, bugCount],
    [IssueCategory.FeatureRequest, featureRequestCount],
    [IssueCategory.Unclassified, unclassifiedCount]
  ]);
}

// backend data format for interface
type GQLInterface = Pick<ComponentInterface, 'id' | 'name'> & {
  component?: Maybe<Pick<Component, 'id'>>;
  bugs?: Maybe<Pick<IssuePage, 'totalCount'>>;
  featureRequests?: Maybe<Pick<IssuePage, 'totalCount'>>;
  unclassified?: Maybe<Pick<IssuePage, 'totalCount'>>;
  consumedBy?: Maybe<{nodes?: Maybe<Array<Maybe<Pick<Component, 'id'>>>>}>;
};

// desired frontend data format for interface
export class GraphInterface {
  id: Scalars['ID'];
  name: string;
  offeredBy: Scalars['ID'];
  consumedBy: Scalars['ID'][];
  issues: Map<IssueCategory, number>;

  static fromGQL(gqlInterface: GQLInterface): GraphInterface {
    const issues = issueCounts(gqlInterface.bugs.totalCount, gqlInterface.featureRequests.totalCount, gqlInterface.unclassified.totalCount);
    return {
      id: gqlInterface.id,
      name: gqlInterface.name,
      offeredBy: gqlInterface.component.id,
      consumedBy: gqlInterface.consumedBy.nodes.map((component) => component.id),
      issues
    };
  }

  static mapFromGQL(gqlInterfaces: GQLInterface[]): Map<LocationId, GraphInterface> {
    return new Map(gqlInterfaces.map((gqlInterface) => [gqlInterface.id, GraphInterface.fromGQL(gqlInterface)]));
  }
}

// backend data format for component
type GQLGraphComponent = Pick<Component, 'name' | 'id'> & {
  bugs?: Pick<IssuePage, 'totalCount'>;
  featureRequests?: Pick<IssuePage, 'totalCount'>;
  unclassified?: Pick<IssuePage, 'totalCount'>;
};

// desired frontend data format for component
export class GraphComponent {
  name: string;
  id: Scalars['ID'];
  issues: Map<IssueCategory, number>;

  /**
   * Convert backend representation of graph component to frontend representation.
   * @param gqlGraphComponent backend representation of component
   */
  static fromGQL(gqlGraphComponent: GQLGraphComponent): GraphComponent {
    const issues = issueCounts(
      gqlGraphComponent.bugs.totalCount,
      gqlGraphComponent.featureRequests.totalCount,
      gqlGraphComponent.unclassified.totalCount
    );
    return {
      id: gqlGraphComponent.id,
      name: gqlGraphComponent.name,
      issues
    };
  }

  static mapFromGQL(gqlGraphComponents: GQLGraphComponent[]): Map<LocationId, GraphComponent> {
    return new Map(gqlGraphComponents.map((gqlComponent) => [gqlComponent.id, GraphComponent.fromGQL(gqlComponent)]));
  }
}

// backend data fromat for issue
type GQLIssue = Pick<Issue, 'id' | 'category'> & {
  locations?: {
    nodes?: (Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>)[];
  };
  linksToIssues?: {
    nodes?: (Pick<Issue, 'id' | 'category'> & {
      locations?: {
        nodes?: (Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>)[];
      };
    })[];
  };
};

// desired frontend data format for issue
class GraphIssue {
  id: Scalars['ID'];
  category: IssueCategory;
  locations: LocationId[];
  linksIssues?: GraphIssue[];

  /**
   * Convert issue from backend to frontend format ignoring links between issues
   * @param gqlPartialIssue backend representation of issue
   */
  static fromGQLNoLinks(gqlPartialIssue: Pick<GQLIssue, 'id' | 'category' | 'locations'>) {
    return {
      id: gqlPartialIssue.id,
      category: gqlPartialIssue.category,
      locations: gqlPartialIssue.locations.nodes.map((location) => location.id)
    };
  }

  /**
   * Convert issue from backend to frontend format ignoring links between issues
   * @param gqlIssue backend representation of Issues
   */
  static fromGQL(gqlIssue: GQLIssue): GraphIssue {
    const issue: GraphIssue = this.fromGQLNoLinks(gqlIssue);
    issue.linksIssues = gqlIssue.linksToIssues.nodes.map((gqlPartialIssue) => this.fromGQLNoLinks(gqlPartialIssue));
    return issue;
  }
}

/**
 * The graph displays edges between issue folders that contain issues which link
 * to each other. This function computes this information. Drawing is handled in
 * IssueGraphComponent.
 * @param linkIssues contains only issues that link to other issues
 * @param interfaces mapping from ids of locations to interfaces attached to locations
 */
function computeRelatedFolders(
  linkIssues: GraphIssue[],
  interfaces: Map<LocationId, GraphInterface>
): DefaultDictionary<GraphFolder, GraphFolder[]> {
  let targetFolders: GraphFolder[];
  const relatedFolders: DefaultDictionary<GraphFolder, GraphFolder[]> = new DefaultDictionary<GraphFolder, GraphFolder[]>(() => []);
  for (const issue of linkIssues) {
    const sourceLocationIds = removeOfferingComponents(issue.locations, interfaces);
    const sourceFolders: GraphFolder[] = sourceLocationIds.map((locationId) => [locationId, issue.category]);
    targetFolders = [];
    for (const linkedIssue of issue.linksIssues) {
      const targetLocationIds = removeOfferingComponents(linkedIssue.locations, interfaces);
      // @ts-ignore
      targetFolders = targetFolders.concat(targetLocationIds.map((locationId) => [locationId, linkedIssue.category]));
    }
    sourceFolders.forEach((folder) => relatedFolders.setValue(folder, relatedFolders.getValue(folder).concat(targetFolders)));
  }
  return relatedFolders;
}
