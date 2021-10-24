import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {TimeFormatter} from '@app/issue-detail/TimeFormatter';
import {Router} from '@angular/router';
import {IssueTimelineItem} from '../../../generated/graphql-dgql';
import {DataList} from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import { ListType, NodeId, NodeType } from '@app/data-dgql/id';

export interface CoalescedTimelineItem {
  user: string;
  type: string;
  isCoalesced: boolean;
  item: Array<IssueTimelineItem> | IssueTimelineItem;
  time: string;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {
  static readonly COALESCABLE_EVENTS = new Set(['LabelledEvent', 'UnlabelledEvent']);

  // Provides time format functions
  public timeFormatter = new TimeFormatter();
  timelineItems: Array<CoalescedTimelineItem> = [];
  public timelineItems$: DataList<IssueTimelineItem, unknown>;
  public timelineItemsSub: Subscription;
  @Input() issueId: string;
  @Input() projectID: string;

  constructor(private dataService: DataService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.requestTimelineItems();
  }

  requestTimelineItems(): void {
    // Get observable with all timeline items for current issue
    this.timelineItems$ = this.dataService.getList({
      node: {type: NodeType.Issue, id: this.issueId},
      type: ListType.TimelineItems
    });
    this.timelineItems$.count = 99999; // FIXME?

    this.timelineItemsSub = this.timelineItems$.subscribe(value => {
      this.prepareTimelineItems(value);
    });
  }

  prepareTimelineItems(items: Map<string, IssueTimelineItem>): void {
    let coalescingType = null;
    let coalesceList = new Array<IssueTimelineItem>();
    const coalesced: Array<CoalescedTimelineItem> = [];

    // This function adds items from the coalesce list into a coalesced timeline item
    const finishCoalescing = () => {
      if (coalesceList.length === 0) {
        return;
      }

      const firstItem: any = coalesceList[0];
      const itemType = firstItem.__typename;
      const createdBy = firstItem.createdBy.displayName;
      if (coalesceList.length > 1) {
        coalesced.push({
          type: itemType,
          isCoalesced: true,
          item: coalesceList,
          user: createdBy,
          time: coalesceList[0].createdAt
        });
        coalesceList = [];
      } else if (coalesceList.length === 1) {
        coalesced.push({
          type: itemType,
          isCoalesced: false,
          item: coalesceList[0],
          user: createdBy,
          time: coalesceList[0].createdAt
        });
        coalesceList = [];
      }
    };

    for (const timelineItem of items.values()) {
      const itemType = (timelineItem as any).__typename;
      const createdBy = timelineItem.createdBy.displayName;
      let stopCoalescing = false;

      if (coalescingType) {
        // Stop coalescing if user differs or the current item was added 60 seconds after the first one
        const firstItem = coalesceList[0];
        stopCoalescing = firstItem.createdBy.id !== timelineItem.createdBy.id ||
          Math.abs(Date.parse(timelineItem.createdAt) - Date.parse(firstItem.createdAt)) > 60000;
      }

      if (coalescingType !== itemType || stopCoalescing) {
        finishCoalescing();

        if (TimelineComponent.COALESCABLE_EVENTS.has(itemType)) {
          coalescingType = itemType;
          coalesceList.push(timelineItem);
        } else {
          coalescingType = null;
          coalesced.push({
            type: itemType,
            isCoalesced: false,
            item: timelineItem,
            user: createdBy,
            time: timelineItem.createdAt
          });
        }

        continue;
      } else if (coalescingType == null) {
        coalesced.push({
          type: itemType,
          isCoalesced: false,
          item: timelineItem,
          user: createdBy,
          time: timelineItem.createdAt
        });

        continue;
      }

      coalesceList.push(timelineItem);
    }

    // Add remaining items
    finishCoalescing();
    this.timelineItems = coalesced;
  }

  ngOnDestroy() {
    this.timelineItemsSub?.unsubscribe();
  }

  /**
   * Checks if user self assigned this issue for text representation
   * @param assignedEvent
   */
  selfAssigned(assignedEvent): boolean {
    if (assignedEvent.createdBy.id === assignedEvent.removedAssignee?.id) {
      return true;
    } else if (assignedEvent.createdBy.id === assignedEvent.assignee?.id) {
      return true;
    }
    return false;
  }

  makeCommentId(node): NodeId {
    return {type: NodeType.IssueComment, id: node.id};
  }

  goToComponentDetails(component) {
    this.router.navigate(['projects', this.projectID, 'component', component.id]);
  }

  goToLocationDetails(location) {
    if (location.__typename === 'Component') {
      this.router.navigate(['projects', this.projectID, 'component', location.id]);
    } else {
      this.router.navigate(['projects', this.projectID, 'interface', location.id]);
    }
  }
}
