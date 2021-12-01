import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {DueDateChangedEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-due-date-changed',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> changed due date from {{ event.oldDueDate }} to {{ event.newDueDate }}
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventDueDateChangedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: DueDateChangedEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as DueDateChangedEvent;
  }
}
