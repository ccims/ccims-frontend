import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {CategoryChangedEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-category-changed',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem">
        <ng-template appSingleTimelineItem>
          <a>{{ timelineItem.user }}</a>
          changed category from
          <app-issue-category [category]="event.oldCategory"></app-issue-category>
          &nbsp;to&nbsp;
          <app-issue-category [category]="event.newCategory"></app-issue-category>
        </ng-template>
      </app-timeline-item>
    `
})
export class TimelineEventCategoryChangedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: CategoryChangedEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as CategoryChangedEvent;
  }
}
