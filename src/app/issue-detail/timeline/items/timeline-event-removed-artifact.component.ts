import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {RemovedArtifactEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-removed-artifact',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.removedArtifact">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> removed artifact
        <a>{{ event.removedArtifact.id }}</a>
      </ng-template>
      <ng-template appTimelineItemDeleted
        ><a>{{ timelineItem.user }}</a> removed deleted artifact</ng-template
      >
    </app-timeline-item>
  `
})
export class TimelineEventRemovedArtifactComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: RemovedArtifactEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as RemovedArtifactEvent;
  }
}
