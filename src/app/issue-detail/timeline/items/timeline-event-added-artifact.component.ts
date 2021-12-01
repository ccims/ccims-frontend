import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {AddedArtifactEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-added-artifact',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.artifact">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> added artifact
        <a>{{ event.artifact.id }}</a>
      </ng-template>
      <ng-template appTimelineItemDeleted
        ><a>{{ timelineItem.user }}</a> added deleted artifact</ng-template
      >
    </app-timeline-item>
  `
})
export class TimelineEventAddedArtifactComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: AddedArtifactEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as AddedArtifactEvent;
  }
}
