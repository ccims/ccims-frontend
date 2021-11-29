import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {UnmarkedAsDuplicateEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-unmarked-duplicate',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem">
        <ng-template appSingleTimelineItem>
          <a>{{ timelineItem.user }}</a> unmarked this issue as duplicate
        </ng-template>
      </app-timeline-item>
    `
})

export class TimelineEventUnmarkedDuplicateComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: UnmarkedAsDuplicateEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as UnmarkedAsDuplicateEvent;
  }
}
