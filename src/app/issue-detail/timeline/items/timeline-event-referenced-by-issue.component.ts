import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {ReferencedByIssueEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-referenced-by-issue',
  styleUrls: ['../timeline.component.scss'],
  template:
    `
      <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.mentionedAt">
        <ng-template appSingleTimelineItem>
          This issue was referenced by issue
          <app-issue-item [issue]="event.mentionedAt" [interactive]="true" [projectId]="projectID">
          </app-issue-item>
          in comment <a>{{ event.mentionedInComment?.id }}</a> by <a>{{ timelineItem.user }}</a>
        </ng-template>
        <ng-template appTimelineItemDeleted>This issue was referenced by a deleted issue</ng-template>
      </app-timeline-item>
    `
})
export class TimelineEventReferencedByIssueComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @Input() projectID: string;
  event: ReferencedByIssueEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as ReferencedByIssueEvent;
  }
}
