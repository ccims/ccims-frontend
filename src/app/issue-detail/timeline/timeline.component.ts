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
/**
 * This component shows the full timeline 
 * with all its timeline events for a given issue.
 */
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

  // provides time format functionality
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

  /**
   * Retrieves all timeline items (aka. timeline events) for the current issue.
   */
  requestTimelineItems(): void {

    // gets an observable with all timeline items for thecurrent issue
    this.timelineItems$ = this.dataService.getList({
      node: {type: NodeType.Issue, id: this.issueId},
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

    // FIXME: handle the coalesing type
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
   * Adds items from a given coalesce list
   * to a given list containing all coalesced timeline items.
   * @param  {IssueTimelineItem[]} coalesceList - The given coalesce list.
   * @param  {CoalescedTimelineItem[]} coalesced - The given list containing all coalesced timeline items.
   * @returns The given list containing all coalesced timeline items.
   */
   private addCoalesceItems(coalesceList: IssueTimelineItem[], coalesced: CoalescedTimelineItem[]) {

    const firstItem: any = coalesceList[0];
    const itemType = firstItem.__typename;
    const createdBy = firstItem.createdBy.displayName;

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
    coalesced: CoalescedTimelineItem[]) {
    
      if (!filter || filter(timelineItem)) {
        coalesced.push({
          type: (timelineItem as any).__typename,
          isCoalesced: false,
          item: timelineItem,
          user: timelineItem.createdBy.displayName,
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
