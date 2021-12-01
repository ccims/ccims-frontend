import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {StartDateChangedEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-start-date-changed',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> changed start date from {{ event.oldStartDate }} to {{ event.newStartDate }}
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventStartDateChangedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: StartDateChangedEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as StartDateChangedEvent;
  }
}
