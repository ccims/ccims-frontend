import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {AssignedEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-assigned',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.assignee">
      <ng-template appSingleTimelineItem>
        <span *ngIf="selfAssigned; else notSelfAssigned">
          <a>{{ timelineItem.user }}</a> self-assigned this issue
        </span>
        <ng-template #notSelfAssigned>
          <a>{{ timelineItem.user }}</a> assigned this issue to user
          <a>{{ event.assignee.displayName }}</a>
        </ng-template>
      </ng-template>
      <ng-template appTimelineItemDeleted>
        <a>{{ timelineItem.user }}</a> assigned this issue to a deleted user
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventAssignedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: AssignedEvent;
  selfAssigned = false;

  ngOnInit(): void {
    this.event = this.timelineItem.item as AssignedEvent;
    this.selfAssigned = this.event.createdBy.id === this.event.assignee?.id;
  }
}
