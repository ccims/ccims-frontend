import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataList, DataNode } from '@app/data-dgql/query';
import { AddIssueCommentInput, CloseIssueInput, Issue, ReopenIssueInput, UpdateCommentInput } from '../../generated/graphql';
import { Subscription } from 'rxjs';
import DataService from '@app/data-dgql';
import { CURRENT_USER_NODE_ID, encodeListId, ListType, NodeType } from '@app/data-dgql/id';
import { User } from '../../generated/graphql-dgql';

@Component({
  selector: 'app-issue-contents',
  templateUrl: 'issue-contents.component.html',
  styleUrls: ['issue-contents.component.scss']
})
export class IssueContentsComponent implements OnInit, OnDestroy {
  @Input() issue$: DataNode<Issue>;
  @Input() issueId: string;
  @Input() projectId: string;

  public linkedIssues$: DataList<Issue, unknown>;
  public linkedIssueSub: Subscription;
  public currentUser$: DataNode<User>;
  public currentUserSub: Subscription;

  public editBody = false;
  public savingBody = false;
  public savingComment = false;
  @ViewChild('comment') commentEditor;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.linkedIssues$ = this.dataService.getList(encodeListId({
      node: { type: NodeType.Issue, id: this.issueId },
      type: ListType.LinkedIssues
    }));
    this.linkedIssueSub = this.linkedIssues$.subscribe();

    this.currentUser$ = this.dataService.getNode(CURRENT_USER_NODE_ID);
    this.currentUserSub = this.currentUser$.subscribe();
  }

  ngOnDestroy() {
    this.linkedIssueSub.unsubscribe();
    this.currentUserSub.unsubscribe();
  }

  formatTime(a: any) {
    return 'TODO';
  }
  formatIssueOpenTime() {
    return 'TODO';
  }

  /**
   * Closes the current issue and refreshes its information.
   */
  public closeIssue(): void {
    this.dataService.mutations.closeIssue(Math.random().toString(), this.issue$.id);
  }


  /**
   * Reopens the closed current issue.
   */
  public reopenIssue(): void {
    this.dataService.mutations.reopenIssue(Math.random().toString(), this.issue$.id);
  }

  /**
   * Edits the description of the current issue.
   *
   * @param {string} body - The new description of the current issue.
   *
   * TODO: Implement the edittIssueBody mutation that's to be used
   * to edit the issue's description (in ccims-frontend and in ccims-backed-gql).
   */
  public editIssueBody(body: string): void {
    this.savingBody = true;
    this.dataService.mutations.updateIssueComment(
      Math.random().toString(),
      this.issue$.id,
      body
    ).then(() => {
      // only exit if successful
      this.editBody = false;
    }).finally(() => {
      this.savingBody = false;
    });
  }

  /**
   * Adds a comment to the current issue.
   *
   * @param commentBody - Comment to be added.
   */
  public commentIssue(commentBody: string): void {
    this.savingComment = true;
    this.dataService.mutations.addIssueComment(
      Math.random().toString(),
      this.issue$.id,
      commentBody
    ).then(() => {
      // only clear if successful
      // TODO: clear comment box
    }).finally(() => {
      this.savingComment = false;
    });
  }
}
