import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IssueComment } from '../../../generated/graphql-dgql';
import { TimeFormatter } from '@app/issue-detail/TimeFormatter';
import DataService from '@app/data-dgql';
import { encodeNodeId, NodeId, NodeType } from '@app/data-dgql/id';
import { DataNode } from '@app/data-dgql/query';
import { Subscription } from 'rxjs';

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

  @Input() commentId: NodeId;
  comment$: DataNode<IssueComment>;
  commentSub: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.comment$ = this.dataService.getNode(this.commentId);
    this.commentSub = this.comment$.subscribe();
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

}
