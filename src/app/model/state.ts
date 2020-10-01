import { IssueGraphComponent } from '../graphs/issue-graph/issue-graph.component';
import { Point } from '@ustutt/grapheditor-webcomponent/lib/edge';


export interface Project {

    id: string;

    // general information
    name: string;
    description: string;
    projectOwnerName: string;

    // imsInformation
    //imsURL: string;
    //imsProviderType: string;
    //imsOwnerName: string;

    // rsInformation
    //rsURL: string;
    //rsProviderType: string;
    //rsOwnerName: string;

    components: string[];

    // state related information
}

export interface ProjectsState {
    [projectId: string]: Project;
}


export interface ComponentInterface {
    id: string;
    interfaceName: string;
    issues: string[];
}

//TODO: refactor this to ComponentInterface when integration complete
export interface GraphComponentInterface {
  id: string;
  interfaceName: string;
  issueCounts: IssueCounts;
  issues: string[];
  position: Point;
}

export interface ComponentInterfaces {
    [id: string]: ComponentInterface;
}

export interface GraphComponentInterfaces {
  [id: string]: GraphComponentInterface;
}

export interface ComponentRelation {
    targetId: string;
    targetType: 'interface' | 'component';
}

export interface GraphComponent {
  id: string;
  name: string;
  description: string;
  issueCounts: IssueCounts;
  issues: string[];
  imsId: string;
  imsRepository;
  owner: string;
  interfaces: GraphComponentInterfaces;
  componentRelations: ComponentRelation[];
}
export type IssueCounts = {
  [key in IssueType]: number;
};

export interface Component {

    id: string;

    name: string;
    description: string;

    issues: string[];

    imsId: string;
    imsRepository: string;
    imsOwner: string;

    interfaces: ComponentInterfaces;

    componentRelations: ComponentRelation[];
}

export interface ComponentsState {
    [componentId: string]: Component;
}

export enum IssueRelationType {
    RELATED_TO = "RELATED_TO",
    DUPLICATES = "DUPLICATES",
    DEPENDS = "DEPENDS",
}

export interface IssueRelation {
    relationType: IssueRelationType;
    relatedIssueId: string;
}

export interface IssueLabel {
    name: string;
}

export enum IssueLocationType {
    COMPONENT,
    COMPONENT_INTERFACE,
}

export interface IssueLocation {
    locationId: string;
    locationType: IssueLocationType;
}

export interface IssueComment {
    author: string;
    text: string;
    html: string;
}

export enum IssueType {
    UNCLASSIFIED = "UNCLASSIFIED",
    BUG = "BUG",
    FEATURE_REQUEST = "FEATURE_REQUEST",
}

export interface Issue {
    id: string;
    title: string;
    textBody: string;
    htmlBody: string;
    type: IssueType;
    isOpen: boolean;
    relatedIssues: IssueRelation[];
    labels: IssueLabel[];
    comments: IssueComment[];
}

export interface IssuesState {
    [issueId: string]: Issue;
}

export interface IssueGraph {
    // TODO node positions and metadata

}

export interface IssueGraphsState {
    [graphId: string]: IssueGraph;
}

export interface State {
    projects: ProjectsState;
    components: ComponentsState;
    issues: IssuesState;
    issueGraphs: IssueGraphsState;
}
