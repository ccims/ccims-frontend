import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IssueComment } from '../../../generated/graphql-dgql';
import { TimeFormatter } from '@app/issue-detail/TimeFormatter';
import DataService from '@app/data-dgql';
import { encodeNodeId, NodeId, NodeType } from '@app/data-dgql/id';
import { DataNode } from '@app/data-dgql/query';
import { Subscription } from 'rxjs';
import {RemoveDialogComponent} from '@app/dialogs/remove-dialog/remove-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UserNotifyService} from '@app/user-notify/user-notify.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
/**
 * This Component contains one comment
 */
export class CommentComponent implements OnInit, OnDestroy {
  public timeFormatter = new TimeFormatter();
  public editBody = false;
  public savingBody = false;

  @Input() isIssueBody: boolean;
  @Input() commentId: NodeId;
  @Input() issueId: NodeId;
  comment$: DataNode<IssueComment>;
  commentSub: Subscription;

  constructor(private dataService: DataService,
              private dialog: MatDialog,
              private notify: UserNotifyService) {}

  ngOnInit() {
    this.comment$ = this.dataService.getNode(this.commentId);
    this.commentSub = this.comment$.subscribeLazy();
  }

  ngOnDestroy() {
    this.commentSub?.unsubscribe();
  }

  /**
   * Edits the description of the current comment.
   *
   * @param body - The new description of the current issue.
   */
  public editComment(body: string): void {
    this.savingBody = true;
    this.dataService.mutations.updateIssueComment(
      Math.random().toString(),
      // use given id or guess
      this.commentId || encodeNodeId({ type: NodeType.IssueComment, id: this.commentId }),
      body
    ).then(() => {
      // only exit if successful
      this.editBody = false;
    }).finally(() => {
      this.savingBody = false;
    });
  }

  /**
   * Deletes the current comment.
   */
  public deleteComment(): void {

    const confirmDeleteDialogRef = this.dialog.open(RemoveDialogComponent,
      {
        data: {
          title: 'Really delete comment ?',
          messages: ['Are you sure you want to delete this comment ?',
            'This action cannot be undone!']
        }
      });

    confirmDeleteDialogRef.afterClosed().subscribe(del => {
      if (del) {
        // User confirmed deletion
        this.dataService.mutations.deleteIssueComment(
          Math.random().toString(),
          encodeNodeId({type: NodeType.Issue, id: this.issueId}),
          // use given id or guess
          this.commentId || encodeNodeId({type: NodeType.IssueComment, id: this.commentId})
        ).then(() => {
          this.notify.notifyInfo('Successfully deleted comment');
        });
      }
    },
      error => this.notify.notifyError('Failed to delete project!', error));
  }
}
