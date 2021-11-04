import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {TimeFormatter} from '@app/issue-detail/TimeFormatter';
import {Router} from '@angular/router';
import {IssueTimelineItem} from '../../../generated/graphql-dgql';
import {DataList} from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import {ListType, NodeId, NodeType} from '@app/data-dgql/id';
import {QueryComponent} from '@app/utils/query-component/query.component';

export interface CoalescedTimelineItem {
  user: string;
  type: string;
  isCoalesced: boolean;
  item: Array<IssueTimelineItem> | IssueTimelineItem;
  time: string;
}

type ItemFilterFunction = (IssueTimelineItem) => boolean;

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements AfterViewInit {
  static readonly COALESCABLE_EVENTS: Map<string, ItemFilterFunction> = new Map([
      ['LabelledEvent', (item) => {
        return !!item.label;
      }],
      ['UnlabelledEvent', (item) => {
        return !!item.removedLabel;
      }],
      ['AddedToComponentEvent', (item) => {
        return !!item.component;
      }],
      ['RemovedFromComponentEvent', (item) => {
        return !!item.removedComponent;
      }],
      ['AddedToLocationEvent', (item) => {
        return !!item.location;
      }],
      ['RemovedFromLocationEvent', (item) => {
        return !!item.removedLocation;
      }],
      ['LinkEvent', (item) => {
        return !!item.linkedIssue;
      }],
      ['UnlinkEvent', (item) => {
        return !!item.removedLinkedIssue;
      }]
    ]
  );

  // Provides time format functions
  public timeFormatter = new TimeFormatter();
  timelineItems: Array<CoalescedTimelineItem> = [];
  public timelineItems$: DataList<IssueTimelineItem, unknown>;
  @Input() issueId: string;
  @Input() projectID: string;
  @ViewChild(QueryComponent) query: QueryComponent;

  constructor(private dataService: DataService,
              private router: Router) {
  }

  ngAfterViewInit(): void {
    this.requestTimelineItems();
  }

  requestTimelineItems(): void {
    // Get observable with all timeline items for current issue
    this.timelineItems$ = this.dataService.getList({
      node: {type: NodeType.Issue, id: this.issueId},
      type: ListType.TimelineItems
    });
    this.timelineItems$.count = 99999; // FIXME?

    this.query.listenTo(this.timelineItems$, value => {
      this.prepareTimelineItems(value);
    });
  }

  prepareTimelineItems(items: Map<string, IssueTimelineItem>): void {
    let coalescingType = null;
    let coalesceList = new Array<IssueTimelineItem>();
    const coalesced: Array<CoalescedTimelineItem> = [];

    const userName = (item: IssueTimelineItem) => {
      if (item.createdBy) {
        return item.createdBy.displayName;
      }

      return 'Deleted User';
    };

    // This function adds items from the coalesce list into a coalesced timeline item
    const finishCoalescing = () => {
      if (coalesceList.length === 0) {
        return;
      }

      const firstItem: any = coalesceList[0];
      const itemType = firstItem.__typename;
      const createdBy = userName(firstItem);
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

    const pushSingleItem = (timelineItem: IssueTimelineItem, filter: ItemFilterFunction | undefined) => {
      if (!filter || filter(timelineItem)) {
        coalesced.push({
          type: (timelineItem as any).__typename,
          isCoalesced: false,
          item: timelineItem,
          user: userName(timelineItem),
          time: timelineItem.createdAt
        });
      }
    };

    for (const timelineItem of items.values()) {
      const itemType = (timelineItem as any).__typename;
      const filter = TimelineComponent.COALESCABLE_EVENTS.get(itemType);
      let stopCoalescing = false;

      if (coalescingType) {
        // Stop coalescing if user differs or the current item was added 60 seconds after the first one
        const firstItem = coalesceList[0];
        stopCoalescing = firstItem.createdBy.id !== timelineItem.createdBy.id ||
          Math.abs(Date.parse(timelineItem.createdAt) - Date.parse(firstItem.createdAt)) > 60000;
      }

      if (coalescingType !== itemType || stopCoalescing) {
        finishCoalescing();
        if (filter && filter(timelineItem)) {
          coalescingType = itemType;
          coalesceList.push(timelineItem);
        } else {
          coalescingType = null;
          pushSingleItem(timelineItem, filter);
        }

        continue;
      } else if (coalescingType == null) {
        pushSingleItem(timelineItem, filter);
        continue;
      }

      if (filter(timelineItem)) {
        coalesceList.push(timelineItem);
      }
    }

    // Add remaining items
    finishCoalescing();
    this.timelineItems = coalesced;
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
}
