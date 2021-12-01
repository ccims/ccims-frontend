import {Injectable} from '@angular/core';
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
  IssueCategory,
  ListProjectIssuesQuery,
  ListComponentIssuesQuery,
  ListComponentIssuesOnLocationQuery,
  ListComponentInterfaceIssuesOnLocationQuery,
  ListIssueLinksToIssuesQuery,
  ListIssueLinkedByIssuesQuery,
  ListArtifactIssuesQuery,
  GetIssueHeaderQuery,
  ListIssueTimelineItemsQuery,
  ListIssueLabelsQuery,
  ListIssueLocationsQuery,
  ListIssueComponentsQuery,
  ListProjectLabelsQuery,
  ListComponentLabelsQuery,
  ListIssueParticipantsQuery,
  ListIssueAssigneesQuery,
  GetLabelQuery,
  ListLabelComponentsQuery,
  MutCreateIssueMutation,
  MutRenameIssueTitleMutation,
  MutChangeIssueCategoryMutation,
  MutCloseIssueMutation,
  MutReopenIssueMutation,
  MutAddIssueCommentMutation,
  MutUpdateIssueCommentMutation,
  MutDeleteLabelMutation,
  MutRemoveLabelFromComponentMutation,
  MutAddLabelToComponentMutation,
  MutUpdateLabelMutation,
  MutCreateLabelMutation,
  MutUnlinkIssueMutation,
  MutLinkIssueMutation,
  MutRemoveIssueAssigneeMutation,
  MutAddIssueAssigneeMutation,
  MutRemoveIssueFromLocationMutation,
  MutAddIssueToLocationMutation,
  MutRemoveIssueFromComponentMutation,
  MutAddIssueToComponentMutation,
  MutRemoveIssueLabelMutation,
  MutAddIssueLabelMutation,
  MutDeleteIssueCommentMutation
} from 'src/generated/graphql-dgql';
import {promisifyApolloFetch, QueryListParams} from '@app/data-dgql/queries/util';
import {CreateIssueInput} from '../../../generated/graphql';

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

  listProjectIssues(project: string, list: IssueListParams): Promise<ListProjectIssuesQuery> {
    return promisifyApolloFetch(this.qListProjectIssues.fetch({project, ...list}));
  }

  listComponentIssues(component: string, list: IssueListParams): Promise<ListComponentIssuesQuery> {
    return promisifyApolloFetch(this.qListComponentIssues.fetch({component, ...list}));
  }

  listComponentIssuesOnLocation(component: string, list: IssueListParams): Promise<ListComponentIssuesOnLocationQuery> {
    return promisifyApolloFetch(this.qListComponentIssuesOnLocation.fetch({component, ...list}));
  }

  listComponentInterfaceIssuesOnLocation(cInterface: string, list: IssueListParams): Promise<ListComponentInterfaceIssuesOnLocationQuery> {
    return promisifyApolloFetch(
      this.qListComponentInterfaceIssuesOnLocation.fetch({
        interface: cInterface,
        ...list
      })
    );
  }

  listIssueLinksToIssues(issue: string, list: IssueListParams): Promise<ListIssueLinksToIssuesQuery> {
    return promisifyApolloFetch(this.qListIssueLinksToIssues.fetch({issue, ...list}));
  }

  listIssueLinkedByIssues(issue: string, list: IssueListParams): Promise<ListIssueLinkedByIssuesQuery> {
    return promisifyApolloFetch(this.qListIssueLinkedByIssues.fetch({issue, ...list}));
  }

  listArtifactIssues(artifact: string, list: IssueListParams): Promise<ListArtifactIssuesQuery> {
    return promisifyApolloFetch(this.qListArtifactIssues.fetch({artifact, ...list}));
  }

  getIssueHeader(id: string): Promise<GetIssueHeaderQuery> {
    return promisifyApolloFetch(this.qGetIssueHeader.fetch({id}));
  }

  listIssueTimelineItems(id: string, list: QueryListParams<IssueTimelineItemFilter>): Promise<ListIssueTimelineItemsQuery> {
    return promisifyApolloFetch(this.qListIssueTimelineItems.fetch({id, ...list}));
  }

  listIssueLabels(issue: string, list: QueryListParams<LabelFilter>): Promise<ListIssueLabelsQuery> {
    return promisifyApolloFetch(this.qListIssueLabels.fetch({issue, ...list}));
  }

  listIssueLocations(issue: string, list: QueryListParams<IssueLocationFilter>): Promise<ListIssueLocationsQuery> {
    return promisifyApolloFetch(this.qListIssueLocations.fetch({issue, ...list}));
  }

  listIssueComponents(issue: string, list: QueryListParams<ComponentFilter>): Promise<ListIssueComponentsQuery> {
    return promisifyApolloFetch(this.qListIssueComponents.fetch({issue, ...list}));
  }

  listProjectLabels(project: string, list: QueryListParams<LabelFilter>): Promise<ListProjectLabelsQuery> {
    return promisifyApolloFetch(this.qListProjectLabels.fetch({project, ...list}));
  }

  listComponentLabels(project: string, list: QueryListParams<LabelFilter>): Promise<ListComponentLabelsQuery> {
    return promisifyApolloFetch(this.qListComponentLabels.fetch({project, ...list}));
  }

  listIssueParticipants(issue: string, list: QueryListParams<UserFilter>): Promise<ListIssueParticipantsQuery> {
    return promisifyApolloFetch(this.qListIssueParticipants.fetch({issue, ...list}));
  }

  listIssueAssignees(issue: string, list: QueryListParams<UserFilter>): Promise<ListIssueAssigneesQuery> {
    return promisifyApolloFetch(this.qListIssueAssignees.fetch({issue, ...list}));
  }

  getLabel(id: string): Promise<GetLabelQuery> {
    return promisifyApolloFetch(this.qGetLabel.fetch({id}));
  }

  listLabelComponents(label: string, list: QueryListParams<ComponentFilter>): Promise<ListLabelComponentsQuery> {
    return promisifyApolloFetch(this.qListLabelComponents.fetch({label, ...list}));
  }

  mutCreateIssue(issue: CreateIssueInput): Promise<MutCreateIssueMutation> {
    return promisifyApolloFetch(this.qMutCreateIssue.mutate({issue}));
  }

  mutRenameIssueTitle(id: string, issue: string, title: string): Promise<MutRenameIssueTitleMutation> {
    return promisifyApolloFetch(this.qMutRenameIssueTitle.mutate({id, issue, title}));
  }

  mutChangeIssueCategory(id: string, issue: string, category: IssueCategory): Promise<MutChangeIssueCategoryMutation> {
    return promisifyApolloFetch(this.qMutChangeIssueCategory.mutate({id, issue, category}));
  }

  mutCloseIssue(id: string, issue: string): Promise<MutCloseIssueMutation> {
    return promisifyApolloFetch(this.qMutCloseIssue.mutate({id, issue}));
  }

  mutReopenIssue(id: string, issue: string): Promise<MutReopenIssueMutation> {
    return promisifyApolloFetch(this.qMutReopenIssue.mutate({id, issue}));
  }

  mutAddIssueComment(id: string, issue: string, body: string): Promise<MutAddIssueCommentMutation> {
    return promisifyApolloFetch(this.qMutAddIssueComment.mutate({id, issue, body}));
  }

  mutUpdateIssueComment(id: string, comment: string, body: string): Promise<MutUpdateIssueCommentMutation> {
    return promisifyApolloFetch(this.qMutUpdateIssueComment.mutate({id, comment, body}));
  }

  mutDeleteIssueComment(id: string, comment: string): Promise<MutDeleteIssueCommentMutation> {
    return promisifyApolloFetch(this.qMutDeleteIssueComment.mutate({id, comment}));
  }

  mutAddIssueLabel(id: string, issue: string, label: string): Promise<MutAddIssueLabelMutation> {
    return promisifyApolloFetch(this.qMutAddIssueLabel.mutate({id, issue, label}));
  }

  mutRemoveIssueLabel(id: string, issue: string, label: string): Promise<MutRemoveIssueLabelMutation> {
    return promisifyApolloFetch(this.qMutRemoveIssueLabel.mutate({id, issue, label}));
  }

  mutAddIssueComponent(id: string, issue: string, component: string): Promise<MutAddIssueToComponentMutation> {
    return promisifyApolloFetch(this.qMutAddIssueComponent.mutate({id, issue, component}));
  }

  mutRemoveIssueComponent(id: string, issue: string, component: string): Promise<MutRemoveIssueFromComponentMutation> {
    return promisifyApolloFetch(this.qMutRemoveIssueComponent.mutate({id, issue, component}));
  }

  mutAddIssueLocation(id: string, issue: string, location: string): Promise<MutAddIssueToLocationMutation> {
    return promisifyApolloFetch(this.qMutAddIssueLocation.mutate({id, issue, location}));
  }

  mutRemoveIssueLocation(id: string, issue: string, location: string): Promise<MutRemoveIssueFromLocationMutation> {
    return promisifyApolloFetch(this.qMutRemoveIssueLocation.mutate({id, issue, location}));
  }

  mutAddIssueAssignee(id: string, issue: string, assignee: string): Promise<MutAddIssueAssigneeMutation> {
    return promisifyApolloFetch(this.qMutAddIssueAssignee.mutate({id, issue, assignee}));
  }

  mutRemoveIssueAssignee(id: string, issue: string, assignee: string): Promise<MutRemoveIssueAssigneeMutation> {
    return promisifyApolloFetch(this.qMutRemoveIssueAssignee.mutate({id, issue, assignee}));
  }

  mutLinkIssue(id: string, issue: string, link: string): Promise<MutLinkIssueMutation> {
    return promisifyApolloFetch(this.qMutLinkIssue.mutate({id, issue, link}));
  }

  mutUnlinkIssue(id: string, issue: string, link: string): Promise<MutUnlinkIssueMutation> {
    return promisifyApolloFetch(this.qMutUnlinkIssue.mutate({id, issue, link}));
  }

  mutCreateLabel(id: string, components: string[], name: string, color: string, description?: string): Promise<MutCreateLabelMutation> {
    return promisifyApolloFetch(this.qMutCreateLabel.mutate({id, components, name, description, color}));
  }
  mutUpdateLabel(id: string, label: string, name?: string, color?: string, description?: string): Promise<MutUpdateLabelMutation> {
    return promisifyApolloFetch(this.qMutUpdateLabel.mutate({id, label, name, description, color}));
  }
  mutAddLabelToComponent(id: string, label: string, component: string): Promise<MutAddLabelToComponentMutation> {
    return promisifyApolloFetch(this.qMutAddLabelToComponent.mutate({id, label, component}));
  }
  mutRemoveLabelFromComponent(id: string, label: string, component: string): Promise<MutRemoveLabelFromComponentMutation> {
    return promisifyApolloFetch(this.qMutRemoveLabelFromComponent.mutate({id, label, component}));
  }
  mutDeleteLabel(id: string, label: string): Promise<MutDeleteLabelMutation> {
    return promisifyApolloFetch(this.qMutDeleteLabel.mutate({id, label}));
  }
}
