import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Issue } from '../../generated/graphql-dgql';
import { DataNode } from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import { encodeNodeId, NodeType } from '@app/data-dgql/id';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issue-detail-linked-issue-item',
  templateUrl: 'linked-issue-item.component.html',
  styleUrls: ['linked-issue-item.component.scss']
})
export class LinkedIssueItemComponent implements OnInit, OnDestroy {
  @Input() projectId: string;
  @Input() issueStub: Issue;

  public fullIssueLink: string;
  public fullIssue?: DataNode<Issue>;
  private fullIssueSub: Subscription;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.fullIssueLink = this.router.serializeUrl(this.router.createUrlTree(
      ['/projects', this.projectId, 'issues', this.issueStub.id]
    ));
  }

  didOpen() {
    if (!this.fullIssue) {
      this.fullIssue = this.dataService.getNode(encodeNodeId({
        type: NodeType.Issue,
        id: this.issueStub.id
      }));
      this.fullIssueSub = this.fullIssue.subscribe();
    }
  }

  ngOnDestroy() {
    this.fullIssueSub?.unsubscribe();
  }
}
