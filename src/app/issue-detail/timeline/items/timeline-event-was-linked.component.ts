import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {WasLinkedEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-was-linked',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.linkedBy">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> linked issue
        <app-issue-item [issue]="event.linkedBy" [interactive]="true" [projectId]="projectID"> </app-issue-item>
        to this issue
      </ng-template>
      <ng-template appTimelineItemDeleted>
        <a>{{ timelineItem.user }}</a> linked deleted issue to this issue
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventWasLinkedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: WasLinkedEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as WasLinkedEvent;
  }
}
