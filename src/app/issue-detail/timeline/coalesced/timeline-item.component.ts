import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';
import { CoalescedTimelineItem } from '@app/issue-detail/timeline/timeline.component';
import { TimeFormatter } from '@app/issue-detail/time-formatter';

/**
 * This directive is used in conjunction with an `ng-template`.
 * The content of the `ng-template` specifies the content of a timeline item, if it was *not* coalesced
 */
@Directive({
  selector: '[appSingleTimelineItem]',
})
export class TimelineSingleItemDirective {
  constructor(public template: TemplateRef<unknown>) {}
}

/**
 * This directive is used in conjunction with an `ng-template`.
 * The content of the `ng-template` specifies the content of a timeline item, if it was coalesced
 */
@Directive({
  selector: '[appCoalescedTimelineItems]',
})
export class TimelineCoalescedItemsDirective {
  constructor(public template: TemplateRef<unknown>) {}
}

/**
 * This directive is used in conjunction with an `ng-template`.
 * The content of the `ng-template` specifies the content of a timeline item, if the attribute `showDeleted` of the
 * {@link TimelineItemComponent} is set to `true`.
 */
@Directive({
  selector: '[appTimelineItemDeleted]',
})
export class TimelineItemDeletedDirective {
  constructor(public template: TemplateRef<unknown>) {}
}

/**
 * This component provides an easy method to switch between the different possible content types of a timeline item,
 * such as single, coalesced or deleted.
 * Additionally, the formatted time is shown.
 */
@Component({
  selector: 'app-timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrls: ['../timeline.component.scss'],
})
export class TimelineItemComponent implements AfterViewInit {
  /** The timeline item to show */
  @Input() timelineItem: CoalescedTimelineItem;
  /** If this option is set to true, the template with the `appTimelineItemDeleted` directive is shown */
  @Input() showDeleted = false;

  /** The content to be shown if the timeline item was not coalesced */
  @ContentChild(TimelineSingleItemDirective)
  timelineItemContent: TimelineSingleItemDirective;
  /** The content to be shown if the timeline item was coalesced */
  @ContentChild(TimelineCoalescedItemsDirective)
  timelineItemsContent: TimelineCoalescedItemsDirective;
  /** The content to be shown if the timeline item contains deleted data */
  @ContentChild(TimelineItemDeletedDirective)
  timelineItemDeletedContent: TimelineItemDeletedDirective;

  timeFormatter: TimeFormatter = new TimeFormatter();
  activeItemContent: TemplateRef<unknown> = null;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    if (this.showDeleted) {
      this.activeItemContent = this.timelineItemDeletedContent.template;
    } else if (this.timelineItem.isCoalesced && this.timelineItemsContent) {
      this.activeItemContent = this.timelineItemsContent.template;
    } else if (!this.timelineItem.isCoalesced) {
      this.activeItemContent = this.timelineItemContent.template;
    }

    this.changeDetector.detectChanges();
  }
}
