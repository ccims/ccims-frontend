import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {AddedToComponentEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-added-to-component',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> added this issue to component
        <app-issue-location [projectId]="projectID" [location]="event.component"></app-issue-location>
      </ng-template>
      <ng-template appCoalescedTimelineItems>
        <a>{{ timelineItem.user }}</a> added this issue to components
        <ng-container *ngFor="let item of events">
          <app-issue-location [projectId]="projectID" [location]="item.component"></app-issue-location>
        </ng-container>
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventAddedToComponentComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: AddedToComponentEvent;
  events: AddedToComponentEvent[];

  ngOnInit(): void {
    if (this.timelineItem.isCoalesced) {
      this.events = this.timelineItem.item as AddedToComponentEvent[];
    } else {
      this.event = this.timelineItem.item as AddedToComponentEvent;
    }
  }
}
