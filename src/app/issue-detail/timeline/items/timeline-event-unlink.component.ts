import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {UnlinkEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-unlink',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem">
        <ng-template appSingleTimelineItem>
          <a>{{ timelineItem.user }}</a> removed link to issue
          <app-issue-item [issue]="event.removedLinkedIssue" [interactive]="true" [projectId]="projectID">
          </app-issue-item>
        </ng-template>
        <ng-template appCoalescedTimelineItems>
          <a>{{ timelineItem.user }}</a> removed links to issues
          <ng-container *ngFor="let item of events">
            <app-issue-item [issue]="item.removedLinkedIssue" [interactive]="true" [projectId]="projectID">
            </app-issue-item>
          </ng-container>
        </ng-template>
      </app-timeline-item>
    `
})
export class TimelineEventUnlinkComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: UnlinkEvent;
  events: UnlinkEvent[];

  ngOnInit(): void {
    if (this.timelineItem.isCoalesced) {
      this.events = this.timelineItem.item as UnlinkEvent[];
    } else {
      this.event = this.timelineItem.item as UnlinkEvent;
    }
  }
}
