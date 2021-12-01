import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {RenamedTitleEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-renamed',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem">
        <ng-template appSingleTimelineItem>
          <a>{{ timelineItem.user }}</a> changed title of this issue from {{ event.oldTitle }} to {{ event.newTitle }}
        </ng-template>
      </app-timeline-item>
    `
})
export class TimelineEventRenamedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: RenamedTitleEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as RenamedTitleEvent;
  }
}
