import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {LinkEvent, PriorityChangedEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-priority-changed',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> changed priority from {{ event.oldPriority }} to {{ event.newPriority }}
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventPriorityChangedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: PriorityChangedEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as LinkEvent;
  }
}
