import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {RemovedFromComponentEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-removed-from-component',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> removed this issue from component
        <app-issue-location [projectId]="projectID" [location]="event.removedComponent"> </app-issue-location>
      </ng-template>
      <ng-template appCoalescedTimelineItems>
        <a>{{ timelineItem.user }}</a> removed this issue from components
        <ng-container *ngFor="let item of events">
          <app-issue-location [projectId]="projectID" [location]="item.removedComponent"> </app-issue-location>
        </ng-container>
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventRemovedFromComponentComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: RemovedFromComponentEvent;
  events: RemovedFromComponentEvent[];

  ngOnInit(): void {
    if (this.timelineItem.isCoalesced) {
      this.events = this.timelineItem.item as RemovedFromComponentEvent[];
    } else {
      this.event = this.timelineItem.item as RemovedFromComponentEvent;
    }
  }
}
