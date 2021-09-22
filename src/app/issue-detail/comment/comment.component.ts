import { Component, Input } from '@angular/core';
import { Issue, IssueComment } from '../../../generated/graphql-dgql';
import { TimeFormatter } from '@app/issue-detail/TimeFormatter';
import DataService from '@app/data-dgql';
import { encodeNodeId, NodeId, NodeType } from '@app/data-dgql/id';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
/**
 * This Component contains one comment
 */
export class CommentComponent {
  public timeFormatter = new TimeFormatter();
  public editBody = false;
  public savingBody = false;

  @Input() commentId?: NodeId;
  @Input() comment: Issue | IssueComment;

  constructor(private dataService: DataService) {}

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
      this.commentId || encodeNodeId({ type: NodeType.IssueComment, id: this.comment.id }),
      body
    ).then(() => {
      // only exit if successful
      this.editBody = false;
    }).finally(() => {
      this.savingBody = false;
    });
  }

}
