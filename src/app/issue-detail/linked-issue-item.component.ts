import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Issue } from '../../generated/graphql-dgql';
import { DataNode } from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import { NodeType } from '@app/data-dgql/id';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Displays a linked issue in a list.
 *
 * By default, only information from {@link #issueStub} will be displayed. When the user expands
 * the accordion card, the issue's body will be loaded separately.
 */
@Component({
  selector: 'app-issue-detail-linked-issue-item',
  templateUrl: 'linked-issue-item.component.html',
  styleUrls: ['linked-issue-item.component.scss']
})
export class LinkedIssueItemComponent implements OnInit, OnDestroy {
  /** The raw project ID. */
  @Input() projectId: string;
  /** Cursory information about the linked issue. */
  @Input() issueStub: Issue;

  /** Link to the full issue page. */
  public fullIssueLink: string;
  /** @ignore */
  public fullIssue?: DataNode<Issue>;
  /** @ignore */
  private fullIssueSub: Subscription;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.fullIssueLink = this.router.serializeUrl(this.router.createUrlTree(
      ['/projects', this.projectId, 'issues', this.issueStub.id]
    ));
  }

  /** Event handler for when the accordion is opened. Loads the full issue if it hasn't been loaded yet. */
  didOpen() {
    if (!this.fullIssue) {
      this.fullIssue = this.dataService.getNode({
        type: NodeType.Issue,
        id: this.issueStub.id
      });
      this.fullIssueSub = this.fullIssue.subscribe();
    }
  }

  ngOnDestroy() {
    this.fullIssueSub?.unsubscribe();
  }
}
