import { Injectable } from '@angular/core';
import { CreateIssueGQL, CreateIssueInput, Issue, IssueCategory, LinkIssueGQL, LinkIssueInput} from 'src/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class IssueStoreService {

  constructor(private createIssue: CreateIssueGQL, private linkIssue:LinkIssueGQL) { }

  create(issueInput: CreateIssueInput) {
    return this.createIssue.mutate({input: issueInput});
  }

  link(linkIssueInput: LinkIssueInput){
    return this.linkIssue.mutate({input: linkIssueInput});
  }

}
