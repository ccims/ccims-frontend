import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {PinnedEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-pinned',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.component">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> pinned this issue on component
        <app-issue-location [projectId]="projectID" [location]="event.component"></app-issue-location>
      </ng-template>
      <ng-template appTimelineItemDeleted>
        <a>{{ timelineItem.user }}</a> pinned this issue on deleted component
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventPinnedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: PinnedEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as PinnedEvent;
  }
}
