import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {WasUnlinkedEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-was-unlinked',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.unlinkedBy">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> unlinked this issue in issue
        <app-issue-item [issue]="event.unlinkedBy" [interactive]="true" [projectId]="projectID"> </app-issue-item>
      </ng-template>
      <ng-template appTimelineItemDeleted>
        <a>{{ timelineItem.user }}</a> unlinked this issue in deleted issue
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventWasUnlinkedComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: WasUnlinkedEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as WasUnlinkedEvent;
  }
}
