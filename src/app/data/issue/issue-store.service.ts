import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {
  AddIssueCommentInput,
  CloseIssueGQL,
  CommentIssueGQL,
  CreateIssueGQL,
  CreateIssueInput,
  GetIssueGQL,
  GetIssueQuery,
  LinkIssueGQL,
  LinkIssueInput,
  UnlinkIssueGQL,
  CloseIssueInput,
  UnlinkIssueInput,
  ReopenIssueGQL,
  ReopenIssueInput,
  RenameIssueTitleInput,
  RenameIssueTitleGQL,
  AddIssueToLocationInput,
  RemoveIssueFromLocationInput,
  AddIssueToLocationGQL,
  RemoveIssueFromLocationGQL,
  DeleteIssueCommentInput,
  DeleteIssueCommentGQL,
  UpdateCommentInput,
  UpdateCommentGQL,
  GetAllTimelineItemsGQL,
  GetAllTimelineItemsQuery,
  ChangeIssueCategoryGQL,
  ChangeIssueCategoryInput
} from 'src/generated/graphql';
import {Observable} from 'rxjs';
/**
 * This service provides CRUD operations and linking for issues
 * The code for the mutations are automaticly generated by a code generator for the GraphQL schema
 * based on the definitions in the issue.graphql file in the same folder
 */
@Injectable({
  providedIn: 'root'
})
export class IssueStoreService {
  constructor(
    private createIssue: CreateIssueGQL,
    private linkIssue: LinkIssueGQL,
    private getFullIssueQuery: GetIssueGQL,
    private commentIssueMutation: CommentIssueGQL,
    private deleteIssueCommentMutation: DeleteIssueCommentGQL,
    private unlinkIssueMutation: UnlinkIssueGQL,
    private closeIssueMutation: CloseIssueGQL,
    private reopenIssueMutation: ReopenIssueGQL,
    private renameIssueMutation: RenameIssueTitleGQL,
    private changeIssueCategoryMutation: ChangeIssueCategoryGQL,
    private addIssueToLocationMutation: AddIssueToLocationGQL,
    private removeIssueFromLocationMutation: RemoveIssueFromLocationGQL,
    private updateCommentMutation: UpdateCommentGQL,
    private getAllTimelineItemsQuery: GetAllTimelineItemsGQL
  ) {}

  create(issueInput: CreateIssueInput) {
    return this.createIssue.mutate({input: issueInput});
  }

  link(linkIssueInput: LinkIssueInput) {
    return this.linkIssue.mutate({input: linkIssueInput});
  }

  unlink(unlinkIssueInput: UnlinkIssueInput) {
    return this.unlinkIssueMutation.mutate({input: unlinkIssueInput});
  }

  commentIssue(commentIssueInput: AddIssueCommentInput) {
    return this.commentIssueMutation.mutate({input: commentIssueInput});
  }

  deleteComment(deleteIssueCommentInput: DeleteIssueCommentInput) {
    return this.deleteIssueCommentMutation.mutate({
      input: deleteIssueCommentInput
    });
  }

  close(closeInput: CloseIssueInput) {
    return this.closeIssueMutation.mutate({input: closeInput});
  }

  reopen(reopenInput: ReopenIssueInput) {
    return this.reopenIssueMutation.mutate({input: reopenInput});
  }

  rename(renameInput: RenameIssueTitleInput) {
    return this.renameIssueMutation.mutate({input: renameInput});
  }

  changeIssueCategory(changeIssueCategoryInput: ChangeIssueCategoryInput) {
    return this.changeIssueCategoryMutation.mutate({
      input: changeIssueCategoryInput
    });
  }

  addToLocation(addLocationInput: AddIssueToLocationInput) {
    return this.addIssueToLocationMutation.mutate({input: addLocationInput});
  }

  removeFromLocation(removeLocationInput: RemoveIssueFromLocationInput) {
    return this.removeIssueFromLocationMutation.mutate({
      input: removeLocationInput
    });
  }

  updateComment(updateCommentInput: UpdateCommentInput) {
    return this.updateCommentMutation.mutate({input: updateCommentInput});
  }

  getFullIssue(id: string): Observable<GetIssueQuery> {
    return this.getFullIssueQuery.fetch({id}).pipe(map(({data}) => data));
  }

  getAllTimelineItems(id: string): Observable<GetAllTimelineItemsQuery> {
    return this.getAllTimelineItemsQuery.fetch({input: id}).pipe(map(({data}) => data));
  }
}
