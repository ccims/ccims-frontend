import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {ReferencedByOtherEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-referenced-by-other',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.component">
        <ng-template appSingleTimelineItem>
          <a>{{ timelineItem.user }}</a> referenced this issue in component
          <app-issue-location [projectId]="projectID" [location]="event.component"></app-issue-location>
          with
          <a href="{{ event.sourceURL }}">{{ event.source }}</a>
        </ng-template>
        <ng-template appTimelineItemDeleted>
          <a>{{ timelineItem.user }}</a> referenced this issue in deleted component
        </ng-template>
      </app-timeline-item>
    `
})
export class TimelineEventReferencedByOtherComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: ReferencedByOtherEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as ReferencedByOtherEvent;
  }
}
