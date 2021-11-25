import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IssueComment } from '../../../generated/graphql-dgql';
import { TimeFormatter } from '@app/issue-detail/time-formatter';
import DataService from '@app/data-dgql';
import { NodeId } from '@app/data-dgql/id';
import { DataNode } from '@app/data-dgql/query';
import { Subscription } from 'rxjs';
import { RemoveDialogComponent } from '@app/dialogs/remove-dialog/remove-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserNotifyService } from '@app/user-notify/user-notify.service';

/**
 * This component displays an issue comment.
 * The comment will be subscribed to lazily (see {@link DataNode#subscribeLazy}).
 */
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, OnDestroy {
  /** If true, this comment component is actually editing an issue's body. */
  @Input() isIssueBody: boolean;
  /** The comment or issue ID. If this is an issue ID, set {@link #isIssueBody} to true. */
  @Input() commentId: NodeId;
  /** The issue this comment belongs to. */
  @Input() issueId: NodeId;

  /** Used to format time. */
  public timeFormatter = new TimeFormatter();
  /** True if the comment body is being edited. */
  public editBody = false;
  /** True if the comment body is being saved. */
  public savingBody = false;

  /**
   * @ignore
   * Internal: comment data node view.
   */
  comment$: DataNode<IssueComment>;
  /**
   * @ignore
   * Internal: subscription to comment$.
   */
  commentSub: Subscription;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private notify: UserNotifyService
  ) {}

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
   * @param body - The new description of the current issue or comment.
   */
  public editComment(body: string): void {
    this.savingBody = true;
    this.dataService.mutations
      .updateIssueComment(Math.random().toString(), this.commentId, body)
      .then(() => {
        // only exit if successful
        this.editBody = false;
      })
      .finally(() => {
        this.savingBody = false;
      });
  }

  /**
   * Deletes the current comment.
   */
  public deleteComment(): void {
    const confirmDeleteDialogRef = this.dialog.open(RemoveDialogComponent, {
      data: {
        title: 'Really delete comment ?',
        messages: [
          'Are you sure you want to delete this comment ?',
          'This action cannot be undone!',
        ],
      },
    });

    confirmDeleteDialogRef.afterClosed().subscribe(
      (del) => {
        if (del) {
          // User confirmed deletion
          this.dataService.mutations
            .deleteIssueComment(
              Math.random().toString(),
              this.issueId,
              this.commentId
            )
            .then(() => {
              this.notify.notifyInfo('Successfully deleted comment');
            });
        }
      },
      (error) => this.notify.notifyError('Failed to delete project!', error)
    );
  }
}
