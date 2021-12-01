import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {MarkedAsDuplicateEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-marked-duplicate',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.originalIssue">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> marked this issue as duplicate of issue
        <app-issue-item [issue]="event.originalIssue" [interactive]="true" [projectId]="projectID"> </app-issue-item>
      </ng-template>
      <ng-template appTimelineItemDeleted>
        <a>{{ timelineItem.user }}</a> marked this issue as duplicate of deleted issue
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventMarkedDuplicateComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: MarkedAsDuplicateEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as MarkedAsDuplicateEvent;
  }
}
