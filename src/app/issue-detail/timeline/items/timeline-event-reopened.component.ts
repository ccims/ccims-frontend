import {Component, Input} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';

@Component({
  selector: 'app-timeline-event-reopened',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem">
        <ng-template appSingleTimelineItem>Issue was closed by <a>{{ timelineItem.user }}</a></ng-template>
        <app-timeline-item>
    `
})
export class TimelineEventReopenedComponent {
  @Input() timelineItem: CoalescedTimelineItem;
}
