import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {LabelledEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-labelled',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> added label
        <span style="display: inline-block">
          <app-issue-label [label]="event.label"></app-issue-label>
        </span>
      </ng-template>
      <ng-template appCoalescedTimelineItems>
        <a>{{ timelineItem.user }}</a> added labels
        <span style="display: inline-block" *ngFor="let node of events">
          <app-issue-label [label]="node.label"></app-issue-label>
        </span>
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventLabelledComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: LabelledEvent;
  events: LabelledEvent[];

  ngOnInit(): void {
    if (this.timelineItem.isCoalesced) {
      this.events = this.timelineItem.item as LabelledEvent[];
    } else {
      this.event = this.timelineItem.item as LabelledEvent;
    }
  }
}
