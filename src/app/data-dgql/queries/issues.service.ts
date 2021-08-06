import { Injectable } from '@angular/core';
import {
  ListProjectIssuesGQL,
  ListComponentIssuesGQL,
  ListComponentIssuesOnLocationGQL,
  ListComponentInterfaceIssuesOnLocationGQL,
  ListIssueLinksToIssuesGQL,
  ListIssueLinkedByIssuesGQL,
  ListArtifactIssuesGQL,
  IssueFilter, GetIssueHeaderGQL, ListIssueTimelineItemsGQL, IssueTimelineItemFilter,
} from 'src/generated/graphql-dgql';
import { promisifyApolloFetch, QueryListParams } from '@app/data-dgql/queries/util';

type IssueListParams = QueryListParams<IssueFilter>;

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
    private qGetIssueHeader: GetIssueHeaderGQL,
    private qListIssueTimelineItems: ListIssueTimelineItemsGQL,
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

  getIssueHeader(id: string) {
    return promisifyApolloFetch(this.qGetIssueHeader.fetch({ id }));
  }

  listIssueTimelineItems(id: string, list: QueryListParams<IssueTimelineItemFilter>) {
    return promisifyApolloFetch(this.qListIssueTimelineItems.fetch({ id, ...list }));
  }
}
