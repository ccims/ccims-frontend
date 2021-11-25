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
  GetIssueHeaderGQL,
  ListIssueTimelineItemsGQL,
  IssueTimelineItemFilter,
  ListIssueLabelsGQL,
  ListProjectLabelsGQL,
  LabelFilter,
  MutAddIssueLabelGQL,
  MutRemoveIssueLabelGQL,
  IssueLocationFilter,
  ListIssueLocationsGQL,
  MutAddIssueToLocationGQL,
  MutRemoveIssueFromLocationGQL,
  ComponentFilter,
  MutRemoveIssueFromComponentGQL,
  MutAddIssueToComponentGQL,
  ListIssueComponentsGQL,
  ListComponentLabelsGQL,
  MutLinkIssueGQL,
  MutUnlinkIssueGQL,
  ListIssueAssigneesGQL,
  ListIssueParticipantsGQL,
  UserFilter,
  MutAddIssueAssigneeGQL,
  MutRemoveIssueAssigneeGQL,
  MutCreateIssueGQL,
  MutRenameIssueTitleGQL,
  MutAddIssueCommentGQL,
  MutDeleteIssueCommentGQL,
  MutUpdateIssueCommentGQL,
  MutCloseIssueGQL,
  MutReopenIssueGQL,
  MutCreateLabelGQL,
  MutDeleteLabelGQL,
  MutUpdateLabelGQL,
  MutAddLabelToComponentGQL,
  MutRemoveLabelFromComponentGQL,
  ListLabelComponentsGQL,
  GetLabelGQL,
  MutChangeIssueCategoryGQL,
  IssueCategory
} from 'src/generated/graphql-dgql';
import { promisifyApolloFetch, QueryListParams } from '@app/data-dgql/queries/util';
import { CreateIssueInput } from '../../../generated/graphql';

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
    private qListProjectLabels: ListProjectLabelsGQL,
    private qListComponentLabels: ListComponentLabelsGQL,
    private qListIssueLabels: ListIssueLabelsGQL,
    private qListIssueLocations: ListIssueLocationsGQL,
    private qListIssueComponents: ListIssueComponentsGQL,
    private qListIssueParticipants: ListIssueParticipantsGQL,
    private qListIssueAssignees: ListIssueAssigneesGQL,
    private qGetLabel: GetLabelGQL,
    private qListLabelComponents: ListLabelComponentsGQL,
    private qMutCreateIssue: MutCreateIssueGQL,
    private qMutRenameIssueTitle: MutRenameIssueTitleGQL,
    private qMutChangeIssueCategory: MutChangeIssueCategoryGQL,
    private qMutCloseIssue: MutCloseIssueGQL,
    private qMutReopenIssue: MutReopenIssueGQL,
    private qMutAddIssueComment: MutAddIssueCommentGQL,
    private qMutUpdateIssueComment: MutUpdateIssueCommentGQL,
    private qMutDeleteIssueComment: MutDeleteIssueCommentGQL,
    private qMutAddIssueLabel: MutAddIssueLabelGQL,
    private qMutRemoveIssueLabel: MutRemoveIssueLabelGQL,
    private qMutAddIssueComponent: MutAddIssueToComponentGQL,
    private qMutRemoveIssueComponent: MutRemoveIssueFromComponentGQL,
    private qMutAddIssueLocation: MutAddIssueToLocationGQL,
    private qMutRemoveIssueLocation: MutRemoveIssueFromLocationGQL,
    private qMutAddIssueAssignee: MutAddIssueAssigneeGQL,
    private qMutRemoveIssueAssignee: MutRemoveIssueAssigneeGQL,
    private qMutLinkIssue: MutLinkIssueGQL,
    private qMutUnlinkIssue: MutUnlinkIssueGQL,
    private qMutCreateLabel: MutCreateLabelGQL,
    private qMutUpdateLabel: MutUpdateLabelGQL,
    private qMutAddLabelToComponent: MutAddLabelToComponentGQL,
    private qMutRemoveLabelFromComponent: MutRemoveLabelFromComponentGQL,
    private qMutDeleteLabel: MutDeleteLabelGQL
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
    return promisifyApolloFetch(
      this.qListComponentInterfaceIssuesOnLocation.fetch({
        interface: cInterface,
        ...list
      })
    );
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

  listIssueLabels(issue: string, list: QueryListParams<LabelFilter>) {
    return promisifyApolloFetch(this.qListIssueLabels.fetch({ issue, ...list }));
  }

  listIssueLocations(issue: string, list: QueryListParams<IssueLocationFilter>) {
    return promisifyApolloFetch(this.qListIssueLocations.fetch({ issue, ...list }));
  }

  listIssueComponents(issue: string, list: QueryListParams<ComponentFilter>) {
    return promisifyApolloFetch(this.qListIssueComponents.fetch({ issue, ...list }));
  }

  listProjectLabels(project: string, list: QueryListParams<LabelFilter>) {
    return promisifyApolloFetch(this.qListProjectLabels.fetch({ project, ...list }));
  }

  listComponentLabels(project: string, list: QueryListParams<LabelFilter>) {
    return promisifyApolloFetch(this.qListComponentLabels.fetch({ project, ...list }));
  }

  listIssueParticipants(issue: string, list: QueryListParams<UserFilter>) {
    return promisifyApolloFetch(this.qListIssueParticipants.fetch({ issue, ...list }));
  }

  listIssueAssignees(issue: string, list: QueryListParams<UserFilter>) {
    return promisifyApolloFetch(this.qListIssueAssignees.fetch({ issue, ...list }));
  }

  getLabel(id: string) {
    return promisifyApolloFetch(this.qGetLabel.fetch({ id }));
  }

  listLabelComponents(label: string, list: QueryListParams<ComponentFilter>) {
    return promisifyApolloFetch(this.qListLabelComponents.fetch({ label, ...list }));
  }

  mutCreateIssue(issue: CreateIssueInput) {
    return promisifyApolloFetch(this.qMutCreateIssue.mutate({ issue }));
  }

  mutRenameIssueTitle(id: string, issue: string, title: string) {
    return promisifyApolloFetch(this.qMutRenameIssueTitle.mutate({ id, issue, title }));
  }

  mutChangeIssueCategory(id: string, issue: string, category: IssueCategory) {
    return promisifyApolloFetch(this.qMutChangeIssueCategory.mutate({ id, issue, category }));
  }

  mutCloseIssue(id: string, issue: string) {
    return promisifyApolloFetch(this.qMutCloseIssue.mutate({ id, issue }));
  }

  mutReopenIssue(id: string, issue: string) {
    return promisifyApolloFetch(this.qMutReopenIssue.mutate({ id, issue }));
  }

  mutAddIssueComment(id: string, issue: string, body: string) {
    return promisifyApolloFetch(this.qMutAddIssueComment.mutate({ id, issue, body }));
  }

  mutUpdateIssueComment(id: string, comment: string, body: string) {
    return promisifyApolloFetch(this.qMutUpdateIssueComment.mutate({ id, comment, body }));
  }

  mutDeleteIssueComment(id: string, comment: string) {
    return promisifyApolloFetch(this.qMutDeleteIssueComment.mutate({ id, comment }));
  }

  mutAddIssueLabel(id: string, issue: string, label: string) {
    return promisifyApolloFetch(this.qMutAddIssueLabel.mutate({ id, issue, label }));
  }

  mutRemoveIssueLabel(id: string, issue: string, label: string) {
    return promisifyApolloFetch(this.qMutRemoveIssueLabel.mutate({ id, issue, label }));
  }

  mutAddIssueComponent(id: string, issue: string, component: string) {
    return promisifyApolloFetch(this.qMutAddIssueComponent.mutate({ id, issue, component }));
  }

  mutRemoveIssueComponent(id: string, issue: string, component: string) {
    return promisifyApolloFetch(this.qMutRemoveIssueComponent.mutate({ id, issue, component }));
  }

  mutAddIssueLocation(id: string, issue: string, location: string) {
    return promisifyApolloFetch(this.qMutAddIssueLocation.mutate({ id, issue, location }));
  }

  mutRemoveIssueLocation(id: string, issue: string, location: string) {
    return promisifyApolloFetch(this.qMutRemoveIssueLocation.mutate({ id, issue, location }));
  }

  mutAddIssueAssignee(id: string, issue: string, assignee: string) {
    return promisifyApolloFetch(this.qMutAddIssueAssignee.mutate({ id, issue, assignee }));
  }

  mutRemoveIssueAssignee(id: string, issue: string, assignee: string) {
    return promisifyApolloFetch(this.qMutRemoveIssueAssignee.mutate({ id, issue, assignee }));
  }

  mutLinkIssue(id: string, issue: string, link: string) {
    return promisifyApolloFetch(this.qMutLinkIssue.mutate({ id, issue, link }));
  }

  mutUnlinkIssue(id: string, issue: string, link: string) {
    return promisifyApolloFetch(this.qMutUnlinkIssue.mutate({ id, issue, link }));
  }

  mutCreateLabel(id: string, components: string[], name: string, color: string, description?: string) {
    return promisifyApolloFetch(this.qMutCreateLabel.mutate({ id, components, name, description, color }));
  }
  mutUpdateLabel(id: string, label: string, name?: string, color?: string, description?: string) {
    return promisifyApolloFetch(this.qMutUpdateLabel.mutate({ id, label, name, description, color }));
  }
  mutAddLabelToComponent(id: string, label: string, component: string) {
    return promisifyApolloFetch(this.qMutAddLabelToComponent.mutate({ id, label, component }));
  }
  mutRemoveLabelFromComponent(id: string, label: string, component: string) {
    return promisifyApolloFetch(this.qMutRemoveLabelFromComponent.mutate({ id, label, component }));
  }
  mutDeleteLabel(id: string, label: string) {
    return promisifyApolloFetch(this.qMutDeleteLabel.mutate({ id, label }));
  }
}
