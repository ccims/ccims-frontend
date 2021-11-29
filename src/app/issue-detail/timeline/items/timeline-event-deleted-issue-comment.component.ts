import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {DeletedIssueComment} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-deleted-issue-comment',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem">
        <ng-template appSingleTimelineItem>
          <a>{{ event.deletedBy?.displayName }}</a> deleted comment by <a>{{ timelineItem.user }}</a>
        </ng-template>
      </app-timeline-item>
    `
})
export class TimelineEventDeletedIssueCommentComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: DeletedIssueComment;

  ngOnInit(): void {
    this.event = this.timelineItem.item as DeletedIssueComment;
  }
}
