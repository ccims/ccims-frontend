import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {UnassignedEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-unassigned',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.removedAssignee">
        <ng-template appSingleTimelineItem>
          <span *ngIf="selfAssigned; else notSelfAssigned">
            <a>{{ timelineItem.user }}</a> self-unassigned
          </span>
          <ng-template #notSelfAssigned>
            <a>{{ timelineItem.user }}</a> unassigned
            <a>{{ event.removedAssignee.displayName }}</a>
          </ng-template>
        </ng-template>
        <ng-template appTimelineItemDeleted><a>{{ timelineItem.user }}</a> unassigned deleted user</ng-template>
      </app-timeline-item>
    `
})
export class TimelineEventUnassignedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: UnassignedEvent;
  selfAssigned = false;

  ngOnInit(): void {
    this.event = this.timelineItem.item as UnassignedEvent;
    this.selfAssigned = this.event.createdBy.id === this.event.removedAssignee?.id;
  }
}
