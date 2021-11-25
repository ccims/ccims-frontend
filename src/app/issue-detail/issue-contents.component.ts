import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataList, DataNode } from '@app/data-dgql/query';
import { Issue } from '../../generated/graphql';
import { Subscription } from 'rxjs';
import DataService from '@app/data-dgql';
import { CURRENT_USER_NODE, ListType, NodeType } from '@app/data-dgql/id';
import { User } from '../../generated/graphql-dgql';

/**
 * This component renders the contents of the issue: the issue body, timeline, and comment box.
 */
@Component({
  selector: 'app-issue-contents',
  templateUrl: 'issue-contents.component.html',
  styleUrls: ['issue-contents.component.scss'],
})
export class IssueContentsComponent implements OnInit, OnDestroy {
  /** The issue to be rendered. */
  @Input() issue$: DataNode<Issue>;
  /** The raw project ID. */
  @Input() projectId: string;

  /** @ignore */
  public linkedIssues$: DataList<Issue, unknown>;
  /** @ignore */
  public linkedIssueSub: Subscription;
  /** @ignore */
  public currentUser$: DataNode<User>;
  /** @ignore */
  public currentUserSub: Subscription;

  /** True if the issue comment is currently being saved. */
  public savingComment = false;
  /** The comment editor (app-markdown-editor). */
  @ViewChild('comment') commentEditor;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.linkedIssues$ = this.dataService.getList({
      node: this.issue$.id,
      type: ListType.LinkedIssues,
    });
    this.linkedIssueSub = this.linkedIssues$.subscribe();

    this.currentUser$ = this.dataService.getNode(CURRENT_USER_NODE);
    this.currentUserSub = this.currentUser$.subscribe();
  }

  ngOnDestroy() {
    this.linkedIssueSub.unsubscribe();
    this.currentUserSub.unsubscribe();
  }

  /** Closes the current issue. */
  public closeIssue(): void {
    this.dataService.mutations.closeIssue(
      Math.random().toString(),
      this.issue$.id
    );
  }

  /** Reopens the currently closed issue. */
  public reopenIssue(): void {
    this.dataService.mutations.reopenIssue(
      Math.random().toString(),
      this.issue$.id
    );
  }

  /** Adds a comment to the current issue with the data provided in the comment box. */
  public commentIssue(): void {
    this.savingComment = true;
    this.dataService.mutations
      .addIssueComment(
        Math.random().toString(),
        this.issue$.id,
        this.commentEditor.code
      )
      .then(() => {
        // only clear if successful
        this.commentEditor.code = '';
      })
      .finally(() => {
        this.savingComment = false;
      });
  }
}
