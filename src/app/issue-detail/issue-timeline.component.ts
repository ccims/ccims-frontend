import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DataList, DataNode } from '@app/data-dgql/query';
import { AddIssueCommentInput, CloseIssueInput, Issue, ReopenIssueInput, UpdateCommentInput } from '../../generated/graphql';
import { Subscription } from 'rxjs';
import DataService from '@app/data-dgql';
import { encodeListId, ListType, NodeType } from '@app/data-dgql/id';

@Component({
  selector: 'app-issue-timeline',
  templateUrl: 'issue-timeline.component.html',
  styleUrls: ['issue-timeline.component.scss']
})
export class IssueTimelineComponent implements OnInit, OnDestroy {
  @Input() issue$: DataNode<Issue>;
  @Input() issueId: string;
  @Input() projectId: string;

  public linkedIssues$: DataList<Issue, unknown>;
  public linkedIssueSub: Subscription;
  public editBody = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.linkedIssues$ = this.dataService.getList(encodeListId({
      node: { type: NodeType.Issue, id: this.issueId },
      type: ListType.LinkedIssues
    }));
    this.linkedIssueSub = this.linkedIssues$.subscribe();
  }

  ngOnDestroy() {
    this.linkedIssueSub.unsubscribe();
  }

  formatTime(a: any) {
    return 'TODO';
  }
  formatIssueOpenTime() {
    return 'TODO';
  }
  formatTimeDifference(a: any) {
    return 'TODO';
  }

  /**
   * Closes the current issue and refreshes its information.
   */
  public closeIssue(): void {

    // input for the closeIssue mutation
    const closeIssueInput: CloseIssueInput = {
      issue: this.issueId
    };

    /*// calsl the closeIssue mutation
    this.issueStoreService.close(closeIssueInput).subscribe(data => {
      // TODO
    });*/
  }


  /**
   * Reopens the closed current issue.
   */
  public reopenIssue(): void {

    // input for the reopenIssueInput mutation
    const reopenIssueInput: ReopenIssueInput = {
      issue: this.issueId
    };

    // calls the reopenIssueInput mutation
    /* this.issueStoreService.reopen(reopenIssueInput).subscribe(data => {
      console.log(data);
      // TODO
    }); */
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
    // ...
    const updateCommentInput: UpdateCommentInput = {
      comment: this.issueId,
      body
    };
    /*
    this.issueStoreService.updateComment(updateCommentInput).subscribe((data) => {
      console.log(data);
      // TODO
      /*
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
        this.issue = issue;
      });* /
    });*/

    this.editBody = !this.editBody;
  }

  /**
   * Adds a comment to the current issue.
   *
   * @param {string} commentBody - Comment to be added.
   */
  public commentIssue(commentBody: string): void {

    // input for the addIssueComment mutation
    const mutationInput: AddIssueCommentInput = {
      issue: this.issueId,
      body: commentBody
    };

    // calls the addIssueComment mutation
    /* this.issueStoreService.commentIssue(mutationInput).subscribe(data => {
      console.log(data);
      // TODO
    }); */
  }
}
