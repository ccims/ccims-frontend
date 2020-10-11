import { Injectable } from '@angular/core';
import { CreateIssueGQL, CreateIssueInput, Issue, IssueCategory } from 'src/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class IssueStoreService {

  constructor(private createIssue: CreateIssueGQL) { }
  create(issue: any) {
    const input: CreateIssueInput = {
      title: issue.title,
      componentIDs: issue.components,
      body: issue.body,
      category: this.getCategory(issue)
    };
    return this.createIssue.mutate({input});
  }
  private getCategory(issue: any): IssueCategory {
    if (issue.category == 'bug') {
      return IssueCategory.Bug;
    }
    if (issue.category == 'feature') {
      return IssueCategory.FeatureRequest;
    }
    if (issue.category == 'undefined') {
      return IssueCategory.Unclassified;
    }
  }
}
