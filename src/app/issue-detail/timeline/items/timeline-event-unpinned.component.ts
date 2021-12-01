import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {UnpinnedEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-unpinned',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.component">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> unpinned this issue in component
        <app-issue-location [projectId]="projectID" [location]="event.component"></app-issue-location>
      </ng-template>
      <ng-template appTimelineItemDeleted>
        <a>{{ timelineItem.user }}</a> unpinned this issue in deleted component
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventUnpinnedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: UnpinnedEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as UnpinnedEvent;
  }
}
