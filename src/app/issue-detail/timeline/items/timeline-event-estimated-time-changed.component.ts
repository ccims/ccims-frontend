import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {EstimatedTimeChangedEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-estimated-time-changed',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem">
        <ng-template appSingleTimelineItem>
          <a>{{ timelineItem.user }}</a> changed the estimated time from {{ event.oldEstimatedTime }}
          to {{ event.newEstimatedTime }}
        </ng-template>
      </app-timeline-item>
    `
})
export class TimelineEventEstimatedTimeChangedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: EstimatedTimeChangedEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as EstimatedTimeChangedEvent;
  }
}
