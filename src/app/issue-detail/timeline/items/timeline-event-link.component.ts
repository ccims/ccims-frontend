import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {LinkEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-link',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem">
        <ng-template appSingleTimelineItem>
          <a>{{ timelineItem.user }}</a> linked this issue to issue
          <app-issue-item [issue]="event.linkedIssue" [interactive]="true" [projectId]="projectID"></app-issue-item>
        </ng-template>
        <ng-template appCoalescedTimelineItems>
          <a>{{ timelineItem.user }}</a> linked this issue to issues
          <ng-container *ngFor="let item of events">
            <app-issue-item [issue]="item.linkedIssue" [interactive]="true" [projectId]="projectID"></app-issue-item>
          </ng-container>
        </ng-template>
      </app-timeline-item>
    `
})
export class TimelineEventLinkComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: LinkEvent;
  events: LinkEvent[];

  ngOnInit(): void {
    if (this.timelineItem.isCoalesced) {
      this.events = this.timelineItem.item as LinkEvent[];
    } else {
      this.event = this.timelineItem.item as LinkEvent;
    }
  }
}
