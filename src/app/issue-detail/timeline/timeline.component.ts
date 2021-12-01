import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {TimeFormatter} from '@app/issue-detail/time-formatter';
import {IssueTimelineItem} from '../../../generated/graphql-dgql';
import {DataList} from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import {ListType, NodeId, NodeType} from '@app/data-dgql/id';
import {QueryComponent} from '@app/utils/query-component/query.component';

/**
 * This interface may contain in contrast to a normal timeline item several events in one item.
 * Timeline items are coalesced because they are performed in close succession.
 * @example
 * label 1 and label 2 are added to an issue at the same time.
 * Instead of representing them as to individual items/events, they will be represented as one item in the timeline.
 */
export interface CoalescedTimelineItem {
  user: string;
  type: string;
  isCoalesced: boolean;
  item: Array<IssueTimelineItem> | IssueTimelineItem;
  time: string;
}

type ItemFilterFunction = (IssueTimelineItem) => boolean;

/**
 * This component shows the full timeline
 * with all its timeline events for a given issue.
 */
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements AfterViewInit {
  /**
   * Events which need to be coalesced
   */
  static readonly COALESCABLE_EVENTS: Map<string, ItemFilterFunction> = new Map([
    [
      'LabelledEvent',
      (item) => {
        return !!item.label;
      }
    ],
    [
      'UnlabelledEvent',
      (item) => {
        return !!item.removedLabel;
      }
    ],
    [
      'AddedToComponentEvent',
      (item) => {
        return !!item.component;
      }
    ],
    [
      'RemovedFromComponentEvent',
      (item) => {
        return !!item.removedComponent;
      }
    ],
    [
      'AddedToLocationEvent',
      (item) => {
        return !!item.location;
      }
    ],
    [
      'RemovedFromLocationEvent',
      (item) => {
        return !!item.removedLocation;
      }
    ],
    [
      'LinkEvent',
      (item) => {
        return !!item.linkedIssue;
      }
    ],
    [
      'UnlinkEvent',
      (item) => {
        return !!item.removedLinkedIssue;
      }
    ]
  ]);

  /**
   * provides functionality for time formatting for correct representation
   */
  public timeFormatter = new TimeFormatter();
  /**
   * Already coalesced items for timeline representation
   */
  timelineItems: Array<CoalescedTimelineItem> = [];
  /**
   * Subscription for timelineitems
   */
  public timelineItems$: DataList<IssueTimelineItem, unknown>;
  /**
   * The id of the corresponding issue for which the timeline is shown
   */
  @Input() issueId: NodeId;
  /**
   * The id of the project in which the issue is listed
   */
  @Input() projectID: string;
  /**
   * Component which is handling the query to the server
   */
  @ViewChild(QueryComponent) query: QueryComponent;

  /**
   * Check if a timeline item can be coalesced with another timeline item. This is the case if
   * a) the user is the same and
   * b) both items were created within the span of a minute
   * @param previousItem The previous item
   * @param nextItem The item to be coalesced with the previous item
   * @returns True if both items can be coalesced
   */
  private static shouldStopCoalescing(previousItem: IssueTimelineItem, nextItem: IssueTimelineItem): boolean {
    return (
      previousItem.createdBy.id !== previousItem.createdBy.id ||
      Math.abs(Date.parse(nextItem.createdAt) - Date.parse(nextItem.createdAt)) > 60000
    );
  }

  /**
   * Service for handling API connection is required
   * @param dataService handling api connection
   */
  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.requestTimelineItems();
  }

  /**
   * Retrieves all timeline items (aka. timeline events) for the current issue.
   * Use in ngAfterViewInit() lifecycle hook
   */
  requestTimelineItems(): void {
    // gets an observable with all timeline items for thecurrent issue
    this.timelineItems$ = this.dataService.getList({
      node: this.issueId,
      type: ListType.TimelineItems
    });

    // FIXME: decide on the count
    this.timelineItems$.count = 99999;

    this.query.listenTo(this.timelineItems$, (value) => {
      this.prepareTimelineItems(value);
    });
  }

  /**
   * Prepares the timeline items (aka. the timeline events).
   * @param items Timeline items to prepare.
   */
  prepareTimelineItems(items: Map<string, IssueTimelineItem>): void {
    let coalescingType: string = null;
    let coalesceList = new Array<IssueTimelineItem>();
    const coalesced: Array<CoalescedTimelineItem> = [];

    for (const timelineItem of items.values()) {
      const itemType: string = (timelineItem as any).__typename;
      const filter = TimelineComponent.COALESCABLE_EVENTS.get(itemType);
      let stopCoalescing = false;

      // decides whether to stop coalescing
      if (coalescingType) {
        stopCoalescing = TimelineComponent.shouldStopCoalescing(coalesceList[0], timelineItem);
      }

      // case: the coalescing type equals the current item type
      // or coalescing should stop
      if (coalescingType !== itemType || stopCoalescing) {
        // adds remaining items
        this.finishCoalescing(coalesceList, coalesced);
        coalesceList = [];

        if (filter && filter(timelineItem)) {
          coalescingType = itemType;
          coalesceList.push(timelineItem);
        } else {
          coalescingType = null;
          this.addSingleCoalesceItem(timelineItem, filter, coalesced);
        }

        continue;
      } else if (coalescingType === null) {
        this.addSingleCoalesceItem(timelineItem, filter, coalesced);
        continue;
      }

      if (filter(timelineItem)) {
        coalesceList.push(timelineItem);
      }
    }

    // adds remaining items
    this.finishCoalescing(coalesceList, coalesced);
    this.timelineItems = coalesced;
  }

  /**
   * Returns the name of the user
   * that created a given timeline item (aka. timeline event)
   * or just "Deleted User" in case the user no longer exists.
   * @param item The given timeline item.
   * @returns Name of the timeline item creator.
   */
  private userName(item: IssueTimelineItem) {
    // case: the timeline item's creator's name can be retrieved
    if (item.createdBy) {
      return item.createdBy.displayName;
    }

    return 'Deleted User';
  }

  /**
   * Turns a list of timeline items into a coalesced timeline item, and adds them to a list of coalesced timeline items.
   *
   * @param coalesceList The list of timeline items
   * @param coalesced The list of all coalesced timeline items
   */
  private finishCoalescing(coalesceList: IssueTimelineItem[], coalesced: CoalescedTimelineItem[]): void {
    if (coalesceList.length === 0) {
      return;
    }

    const firstItem: any = coalesceList[0];
    const itemType = firstItem.__typename;
    const createdBy = this.userName(firstItem);

    if (coalesceList.length > 1) {
      // Combine multiple timeline items into one
      coalesced.push({
        type: itemType,
        isCoalesced: true,
        item: coalesceList,
        user: createdBy,
        time: coalesceList[0].createdAt
      });
    } else if (coalesceList.length === 1) {
      // Wrap a single timeline item into a coalesced timeline item
      coalesced.push({
        type: itemType,
        isCoalesced: false,
        item: coalesceList[0],
        user: createdBy,
        time: coalesceList[0].createdAt
      });
    }
  }

  /**
   * Adds a single item to a list containing all coalesced timeline items.
   * @param timelineItem The given item.
   * @param filter Filter used on the given item.
   * @param coalesced The list of coalesced timeline items
   */
  private addSingleCoalesceItem(
    timelineItem: IssueTimelineItem,
    filter: ItemFilterFunction | undefined,
    coalesced: CoalescedTimelineItem[]
  ): void {
    if (!filter || filter(timelineItem)) {
      coalesced.push({
        type: (timelineItem as any).__typename,
        isCoalesced: false,
        item: timelineItem,
        user: this.userName(timelineItem),
        time: timelineItem.createdAt
      });
    }
  }

  /**
   * Handles the id for a given node...
   */
  makeCommentId(node): NodeId {
    return {type: NodeType.IssueComment, id: node.id};
  }
}
