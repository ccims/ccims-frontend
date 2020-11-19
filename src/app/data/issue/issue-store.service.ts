import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AddIssueCommentInput, CommentIssueGQL, CreateIssueGQL, CreateIssueInput, GetIssueGQL, GetIssueQuery, Issue, IssueCategory, LinkIssueGQL, LinkIssueInput} from 'src/generated/graphql';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueStoreService {

  constructor(private createIssue: CreateIssueGQL, private linkIssue: LinkIssueGQL, private getFullIssueQuery: GetIssueGQL,
              private commentIssueMutation: CommentIssueGQL) { }

  create(issueInput: CreateIssueInput) {
    return this.createIssue.mutate({input: issueInput});
  }

  link(linkIssueInput: LinkIssueInput){
    return this.linkIssue.mutate({input: linkIssueInput});
  }
  getFullIssue(id: string): Observable<GetIssueQuery>{
    return this.getFullIssueQuery.fetch({ id }).pipe(
      map(({ data }) => data)
    );
  }
  commentIssue(commentIssueInput: AddIssueCommentInput) {
    return this.commentIssueMutation.mutate({input: commentIssueInput});
  }

}
