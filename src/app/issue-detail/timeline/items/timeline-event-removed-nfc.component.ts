import {Component, Input, OnInit} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {RemovedNonFunctionalConstraintEvent} from '../../../../generated/graphql-dgql';

@Component({
  selector: 'app-timeline-event-removed-nfc',
  styleUrls: ['../timeline.component.scss'],
  template: `
    <app-timeline-item [timelineItem]="timelineItem" [showDeleted]="!event.removedNonFunctionalConstraint">
      <ng-template appSingleTimelineItem>
        <a>{{ timelineItem.user }}</a> removed non functional constraint
        <a>{{ event.removedNonFunctionalConstraint.id }}</a>
      </ng-template>
      <ng-template appTimelineItemDeleted>
        <a>{{ timelineItem.user }}</a> removed deleted non functional constraint
      </ng-template>
    </app-timeline-item>
  `
})
export class TimelineEventRemovedNfcComponent implements OnInit {
  @Input() timelineItem: CoalescedTimelineItem;
  event: RemovedNonFunctionalConstraintEvent;

  ngOnInit(): void {
    this.event = this.timelineItem.item as RemovedNonFunctionalConstraintEvent;
  }
}
