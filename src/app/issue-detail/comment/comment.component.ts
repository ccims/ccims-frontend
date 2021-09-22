import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IssueComment, UpdateCommentInput} from "../../../generated/graphql";
import {TimeFormatter} from "@app/issue-detail/TimeFormatter";
import {IssueStoreService} from "@app/data/issue/issue-store.service";
import {Observable, Subscription} from "rxjs";
import {map} from 'rxjs/operators';

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
  private comment$: Observable<any>;
  private commentSub = new Subscription();


  @Input() comment: IssueComment;

  constructor(private issueStoreService: IssueStoreService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.commentSub.unsubscribe();
  }

  editComment(body: string){

    const updateCommentInput: UpdateCommentInput = {
      comment: this.comment.id,
      body
    };

    this.comment$ = this.issueStoreService.updateComment(updateCommentInput).pipe(map(({data}) => data));
    this.commentSub = this.comment$.subscribe(data => {
      this.comment = data.updateComment.comment;
    });

    this.editBody = !this.editBody;
  }

}
