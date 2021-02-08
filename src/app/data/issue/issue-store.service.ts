import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AddIssueCommentInput, CloseIssueGQL, CommentIssueGQL, CreateIssueGQL, CreateIssueInput, GetIssueGQL,
  GetIssueQuery, LinkIssueGQL, LinkIssueInput, UnlinkIssueGQL, CloseIssueInput, UnlinkIssueInput, ReopenIssueGQL,
  ReopenIssueInput, RenameIssueTitleInput, RenameIssueTitleGQL, AddIssueToLocationInput, RemoveIssueFromLocationInput,
  AddIssueToLocationGQL, RemoveIssueFromLocationGQL} from 'src/generated/graphql';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueStoreService {

  constructor(private createIssue: CreateIssueGQL, private linkIssue: LinkIssueGQL, private getFullIssueQuery: GetIssueGQL,
              private commentIssueMutation: CommentIssueGQL, private unlinkIssueMutation: UnlinkIssueGQL,
              private closeIssueMutation: CloseIssueGQL, private reopenIssueMutation: ReopenIssueGQL,
              private renameIssueMutation: RenameIssueTitleGQL, private addIssueToLocationMutation: AddIssueToLocationGQL,
              private removeIssueFromLocationMutation: RemoveIssueFromLocationGQL) { }

  create(issueInput: CreateIssueInput) {
    return this.createIssue.mutate({input: issueInput});
  }

  link(linkIssueInput: LinkIssueInput){
    return this.linkIssue.mutate({input: linkIssueInput});
  }

  unlink(unlinkIssueInput: UnlinkIssueInput){
    return this.unlinkIssueMutation.mutate({input: unlinkIssueInput});
  }

  getFullIssue(id: string): Observable<GetIssueQuery>{
    return this.getFullIssueQuery.fetch({ id }).pipe(
      map(({ data }) => data)
    );
  }

  commentIssue(commentIssueInput: AddIssueCommentInput) {
    return this.commentIssueMutation.mutate({input: commentIssueInput});
  }

  close(closeInput: CloseIssueInput){
    return this.closeIssueMutation.mutate({input: closeInput});
  }

  reopen(reopenInput: ReopenIssueInput){
    return this.reopenIssueMutation.mutate({input: reopenInput});
  }

  rename(renameInput: RenameIssueTitleInput){
    return this.renameIssueMutation.mutate({input: renameInput});
  }

  addToLocation(addLocationInput: AddIssueToLocationInput){
    return this.addIssueToLocationMutation.mutate({input: addLocationInput});
  }

  removeFromLocation(removeLocationInput: RemoveIssueFromLocationInput){
    return this.removeIssueFromLocationMutation.mutate({input: removeLocationInput});
  }
}
