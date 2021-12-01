import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {AddedNonFunctionalConstraintEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-added-nfc',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.nonFunctionalConstraint">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> added non functional constraint
        <a>{{ event.nonFunctionalConstraint.id }}</a>
      </ng-template>
      <ng-template appTimelineItemDeleted>
        <a>{{ timelineItem.user }}</a> added deleted non functional constraint
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventAddedNfcComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: AddedNonFunctionalConstraintEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as AddedNonFunctionalConstraintEvent;
  }
}
