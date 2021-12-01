import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {UnlabelledEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-unlabelled',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> removed label
        <span style="display: inline-block">
          <app-issue-label [label]="event.removedLabel"></app-issue-label>
        </span>
      </ng-template>
      <ng-template appCoalescedTimelineItems>
        <a>{{ timelineItem.user }}</a> removed labels
        <span style="display: inline-block" *ngFor="let node of events">
          <app-issue-label [label]="node.removedLabel"></app-issue-label>
        </span>
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventUnlabelledComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: UnlabelledEvent;
  events: UnlabelledEvent[];

  ngOnInit(): void {
    if (this.timelineItem.isCoalesced) {
      this.events = this.timelineItem.item as UnlabelledEvent[];
    } else {
      this.event = this.timelineItem.item as UnlabelledEvent;
    }
  }
}
