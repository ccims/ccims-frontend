import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {RemovedFromLocationEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-removed-from-location',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> removed this issue from location
        <app-issue-location [projectId]="projectID" [location]="event.removedLocation"></app-issue-location>
      </ng-template>
      <ng-template appCoalescedTimelineItems>
        <a>{{ timelineItem.user }}</a> removed this issue from locations
        <ng-container *ngFor="let item of events">
          <app-issue-location [projectId]="projectID" [location]="item.removedLocation"></app-issue-location>
        </ng-container>
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventRemovedFromLocationComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: RemovedFromLocationEvent;
  events: RemovedFromLocationEvent[];

  ngOnInit(): void {
    if (this.timelineItem.isCoalesced) {
      this.events = this.timelineItem.item as RemovedFromLocationEvent[];
    } else {
      this.event = this.timelineItem.item as RemovedFromLocationEvent;
    }
  }
}
