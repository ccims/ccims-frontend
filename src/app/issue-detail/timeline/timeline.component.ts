import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {TimeFormatter} from '@app/issue-detail/time-formatter';
import {Router} from '@angular/router';
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
   * Service for handling API connection is required
   * @param {DataService} dataService handling api connection
   */
  constructor(private dataService: DataService) {
  }

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

    //FIXME: decide on the count
    this.timelineItems$.count = 99999;

    this.query.listenTo(this.timelineItems$, value => {
      this.prepareTimelineItems(value);
    });
  }

  /**
   * Prepares the timeline items (aka. the timeline events).
   * @param  {Map<string, IssueTimelineItem>} items - Timeline items to prepare.
   */
  prepareTimelineItems(items: Map<string, IssueTimelineItem>): void {

    let coalescingType = null;
    let coalesceList = new Array<IssueTimelineItem>();
    let coalesced: Array<CoalescedTimelineItem> = [];

    /**
     * Adds items from the coalesce list {@link coalesceList}
     * to a list containing all coalesced timeline items {@link coalesced}
     * in case the coalesce list is not empty.
     */
    const finishCoalescing = () => {

      // case: the coalesce list is empty
      if (coalesceList.length === 0) {
        return;
      }

      // case: the coalesce list is not empty
      else {
        coalesced = this.addCoalesceItems(coalesceList, coalesced);
        coalesceList = [];
      }
    };

    for (const timelineItem of items.values()) {
      const itemType = (timelineItem as any).__typename;
      const filter = TimelineComponent.COALESCABLE_EVENTS.get(itemType);
      let stopCoalescing = false;

      // decides whether to stop coalescing
      stopCoalescing = this.stopCoalescing(coalescingType, coalesceList, stopCoalescing, timelineItem);

      // case: the coalescing type equals the current item type
      // or coalescing should stop
      if (coalescingType !== itemType || stopCoalescing) {

        // adds remaining items
        finishCoalescing();

        if (filter && filter(timelineItem)) {
          coalescingType = itemType;
          coalesceList.push(timelineItem);
        } else {
          coalescingType = null;
          coalesced = this.addSingleCoalesceItem(timelineItem, filter, coalesced);
        }

        continue;
      }

      // case: the coalescing type is null
      else if (coalescingType == null) {
        coalesced = this.addSingleCoalesceItem(timelineItem, filter, coalesced);
        continue;
      }

      if (filter(timelineItem)) {
        coalesceList.push(timelineItem);
      }
    }

    // adds remaining items
    finishCoalescing();
    this.timelineItems = coalesced;
  }

  /**
   * Returns the name of the user
   * that created a given timeline item (aka. timeline event)
   * or just "Deleted User" in case the user no longer exists.
   * @param  {IssueTimelineItem} item - The given timeline item.
   * @returns - Name of the timeline item creator.
   */
  private userName(item: IssueTimelineItem) {

    // case: the timeline item's creator's name can be retrieved
    if (item.createdBy) {
      return item.createdBy.displayName;
    }

    return 'Deleted User';
  }

  /**
   * Adds items from a given coalesce list
   * to a given list containing all coalesced timeline items.
   * @param  {IssueTimelineItem[]} coalesceList  The given coalesce list.
   * @param  {CoalescedTimelineItem[]} coalesced  The given list containing all coalesced timeline items.
   * @returns The given list containing all coalesced timeline items.
   */
   private addCoalesceItems(coalesceList: IssueTimelineItem[], coalesced: CoalescedTimelineItem[]): CoalescedTimelineItem[] {

    const firstItem: any = coalesceList[0];
    const itemType = firstItem.__typename;
    const createdBy = this.userName(firstItem);

    // case: the coalesce list has more than one item
    if (coalesceList.length > 1) {
      coalesced.push({
        type: itemType,
        isCoalesced: true,
        item: coalesceList,
        user: createdBy,
        time: coalesceList[0].createdAt
      });
    }

    // case: the coalesce list has only one item
    else if (coalesceList.length === 1) {
      coalesced.push({
        type: itemType,
        isCoalesced: false,
        item: coalesceList[0],
        user: createdBy,
        time: coalesceList[0].createdAt
      });
    }

    // returns the list containing all coalesced timeline items
    return coalesced;
  }

  /**
   * Adds a single item to a list containing all coalesced timeline items.
   * @param  {IssueTimelineItem} timelineItem - The given item.
   * @param  {ItemFilterFunction|undefined} filter - Filter used on the given item.
   * @returns The given list containing all coalesced timeline items.
   */
   private addSingleCoalesceItem(
    timelineItem: IssueTimelineItem,
    filter: ItemFilterFunction | undefined,
    coalesced: CoalescedTimelineItem[]): CoalescedTimelineItem[] {

      if (!filter || filter(timelineItem)) {
        coalesced.push({
          type: (timelineItem as any).__typename,
          isCoalesced: false,
          item: timelineItem,
          user: this.userName(timelineItem),
          time: timelineItem.createdAt
        });
      }

      // returns the list containing all coalesced timeline items
      return coalesced;
  }

  /**
   * Stops the coalescing process in case
   * a) the user differs or
   * b) the current item was already added
   * 60 seconds after the first one added.
   * @param  {any} coalescingType - Coalescing type handled.
   * @param  {IssueTimelineItem[]} coalesceList - Coalesce list handled.
   * @param  {boolean} stopCoalescing - Value that determines whether the coalescing should stop.
   * @param  {IssueTimelineItem} timelineItem - Timeline item handled.
   * @returns The value that determines whether the coalescing should stop.
   */
   private stopCoalescing(coalescingType: any, coalesceList: IssueTimelineItem[], stopCoalescing: boolean, timelineItem: IssueTimelineItem) {

    if (coalescingType) {
      const firstItem = coalesceList[0];
      stopCoalescing = firstItem.createdBy.id !== timelineItem.createdBy.id ||
        Math.abs(Date.parse(timelineItem.createdAt) - Date.parse(firstItem.createdAt)) > 60000;
    }

    return stopCoalescing;
  }

  /**
   * Checks if the user self-assigned this issue for text representation.
   * @param assignedEvent - Assigned event handled.
   */
  selfAssigned(assignedEvent): boolean {

    if (assignedEvent.createdBy.id === assignedEvent.removedAssignee?.id) {
      return true;
    }

    return false;
  }

  /**
   * Handles the id for a given node...
   */
  makeCommentId(node): NodeId {
    return {type: NodeType.IssueComment, id: node.id};
  }
}
