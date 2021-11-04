import {AfterViewInit, ChangeDetectorRef, Component, ContentChild, Directive, Input, TemplateRef} from '@angular/core';
import {CoalescedTimelineItem} from '@app/issue-detail/timeline/timeline.component';
import {TimeFormatter} from '@app/issue-detail/TimeFormatter';

@Directive({
  selector: '[appSingleTimelineItem]'
})
export class TimelineSingleItemDirective {
  constructor(public template: TemplateRef<unknown>) {
  }
}

@Directive({
  selector: '[appCoalescedTimelineItems]'
})
export class TimelineCoalescedItemsDirective {
  constructor(public template: TemplateRef<unknown>) {
  }
}

@Component({
  selector: 'app-timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrls: ['../timeline.component.scss']
})
export class TimelineItemComponent implements AfterViewInit {
  @Input() timelineItem: CoalescedTimelineItem;
  @ContentChild(TimelineSingleItemDirective) timelineItemContent: TimelineSingleItemDirective;
  @ContentChild(TimelineCoalescedItemsDirective) timelineItemsContent: TimelineCoalescedItemsDirective;

  timeFormatter: TimeFormatter = new TimeFormatter();
  activeItemContent: TemplateRef<unknown> = null;

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    if (this.timelineItem.isCoalesced && this.timelineItemsContent) {
      this.activeItemContent = this.timelineItemsContent.template;
    } else if (!this.timelineItem.isCoalesced) {
      this.activeItemContent = this.timelineItemContent.template;
    }
    this.changeDetector.detectChanges();
  }
}
