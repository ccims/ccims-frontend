import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {AddedToLocationEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-added-to-location',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem">
        <ng-template appSingleTimelineItem>
          <a>{{ timelineItem.user }}</a> added this issue to location
          <app-issue-location [projectId]="projectID" [location]="event.location"></app-issue-location>
        </ng-template>

        <ng-template appCoalescedTimelineItems>
          <a>{{ timelineItem.user }}</a> added this issue to locations
          <ng-container *ngFor="let item of events">
            <app-issue-location [projectId]="projectID" [location]="item.location"></app-issue-location>
          </ng-container>
        </ng-template>
      </app-timeline-item>
    `
})
export class TimelineEventAddedToLocationComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: AddedToLocationEvent;
  events: AddedToLocationEvent[];

  ngOnInit(): void {
    if (this.timelineItem.isCoalesced) {
      this.events = this.timelineItem.item as AddedToLocationEvent[];
    } else {
      this.event = this.timelineItem.item as AddedToLocationEvent;
    }
  }
}
