import { Injectable } from '@angular/core';
import { CreateIssueGQL, CreateIssueInput, Issue, IssueCategory } from 'src/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class IssueStoreService {

  constructor(private createIssue: CreateIssueGQL) { }

  create(issueInput: CreateIssueInput) {
    return this.createIssue.mutate({input: issueInput});
  }

}
