import { Injectable } from '@angular/core';
import {
  ListProjectIssuesGQL,
  ListComponentIssuesGQL,
  ListComponentIssuesOnLocationGQL,
  ListComponentInterfaceIssuesOnLocationGQL,
  ListIssueLinksToIssuesGQL,
  ListIssueLinkedByIssuesGQL,
  ListArtifactIssuesGQL,
  IssueFilter,
} from 'src/generated/graphql-dgql';
import { promisifyApolloFetch } from '@app/data-dgql/queries/util';

export interface IssueListParams {
  before?: string;
  after?: string;
  first?: number;
  last?: number;
  filterBy?: IssueFilter;
}

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  constructor(
    private qListProjectIssues: ListProjectIssuesGQL,
    private qListComponentIssues: ListComponentIssuesGQL,
    private qListComponentIssuesOnLocation: ListComponentIssuesOnLocationGQL,
    private qListComponentInterfaceIssuesOnLocation: ListComponentInterfaceIssuesOnLocationGQL,
    private qListIssueLinksToIssues: ListIssueLinksToIssuesGQL,
    private qListIssueLinkedByIssues: ListIssueLinkedByIssuesGQL,
    private qListArtifactIssues: ListArtifactIssuesGQL,
  ) {}

  listProjectIssues(project: string, list: IssueListParams) {
    return promisifyApolloFetch(this.qListProjectIssues.fetch({ project, ...list }));
  }

  listComponentIssues(component: string, list: IssueListParams) {
    return promisifyApolloFetch(this.qListComponentIssues.fetch({ component, ...list }));
  }

  listComponentIssuesOnLocation(component: string, list: IssueListParams) {
    return promisifyApolloFetch(this.qListComponentIssuesOnLocation.fetch({ component, ...list }));
  }

  listComponentInterfaceIssuesOnLocation(cInterface: string, list: IssueListParams) {
    return promisifyApolloFetch(this.qListComponentInterfaceIssuesOnLocation.fetch({ interface: cInterface, ...list }));
  }

  listIssueLinksToIssues(issue: string, list: IssueListParams) {
    return promisifyApolloFetch(this.qListIssueLinksToIssues.fetch({ issue, ...list }));
  }

  listIssueLinkedByIssues(issue: string, list: IssueListParams) {
    return promisifyApolloFetch(this.qListIssueLinkedByIssues.fetch({ issue, ...list }));
  }

  listArtifactIssues(artifact: string, list: IssueListParams) {
    return promisifyApolloFetch(this.qListArtifactIssues.fetch({ artifact, ...list }));
  }
}
