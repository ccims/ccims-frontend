import {Component, Input, OnInit} from '@angular/core';
import {
  GetAllTimelineItemsQuery
} from '../../../generated/graphql';
import {Observable, Subscription} from 'rxjs';
import {IssueStoreService} from '@app/data/issue/issue-store.service';
import {TimeFormatter} from "@app/issue-detail/TimeFormatter";
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  // Provides time format functions
  public timeFormatter = new TimeFormatter();
  timelineItems = [];
  public timelineItems$: Observable<GetAllTimelineItemsQuery>;
  public timelineItemsSub: Subscription;
  @Input() issueId: string;

  constructor(private issueStoreService: IssueStoreService) { }

  ngOnInit(): void {
    this.requestTimelineItems();
  }

  requestTimelineItems(): void {
    // Get observeable with all timelineitems for current issue
    this.timelineItems$ = this.issueStoreService.getAllTimelineItems(this.issueId);

    this.timelineItemsSub = this.timelineItems$.subscribe(timeline => {

      console.log('komplette timeline:');
      console.log(JSON.stringify(timeline));

      this.timelineItems = [];

      // Add every event from the timeline to timelineItems array
      timeline.node.timeline.nodes.forEach(event => {
        this.timelineItems.push(event);
        console.log(JSON.stringify(event));
        if (event.__typename === 'IssueComment'){
        }
      });
    });

  }

  /**
   * Checks if user self assigned this issue for text representation
   * @param timelineItem
   */
  selfAssigned(assignedEvent): boolean{
    if (assignedEvent.createdBy.id === assignedEvent.removedAssignee?.id){
      /*console.log(timelineItem.__typename);
      console.log("Creator: " + timelineItem.createdBy.id );
      console.log("Assignee: " + timelineItem.assignee.id);
      console.log("Self assigned");*/
      return true;
    }
    else if (assignedEvent.createdBy.id === assignedEvent.assignee?.id){
      /*console.log(timelineItem.__typename);
      console.log("Creator: " + timelineItem.createdBy.id );
      console.log("Assignee: " + timelineItem.assignee.id);
      console.log("Self assigned");*/
      return true;
    }
    return false;
  }

  /**
   * Checks for null
   * @param eventElement
   */
  notNull(eventElement): boolean{
    if (!eventElement){
      return false;
    }
    return true;
  }

  externOrIntern(eventElement: string){
    let intern;
    switch (eventElement){
      case 'AddedToComponentEvent':
        intern = true;
        break;
      case 'RemovedFromComponentEvent':
        intern = true;
        break;
      case 'AddedToLocationEvent':
        intern = true;
        break;
      case 'RemovedFromLocationEvent':
        intern = true;
        break;
      case 'ClosedEvent':
        intern = true;
        break;
      case 'ReopenedEvent':
        intern = true;
        break;
      case 'AssignedEvent':
        intern = true;
        break;
      case 'UnassignedEvent':
        intern = true;
        break;
      case 'CategoryChangedEvent':
        intern = true;
        break;
      case 'DueDateChangedEvent':
        intern = true;
        break;
      case 'EstimatedTimeChangedEvent':
        intern = true;
        break;
      case 'LabelledEvent':
        intern = true;
        break;
      case 'UnlabelledEvent':
        intern = true;
        break;
      case 'IssueComment':
        intern = true;
        break;
      case 'DeletedIssueComment':
        intern = true;
        break;
      case 'MarkedAsDuplicateEvent':
        intern = true;
        break;
      case 'UnmarkedAsDuplicateEvent':
        intern = true;
        break;
      case 'LinkEvent':
        intern = true;
        break;
      case 'UnlinkEvent':
        intern = true;
        break;
      case 'PinnedEvent':
        intern = true;
        break;
      case 'UnpinnedEvent':
        intern = true;
        break;
      case 'ReferencedByIssueEvent':
        intern = false;
        break;
      case 'ReferencedByOtherEvent':
        intern = false;
        break;
      case 'StartDateChangedEvent':
        intern = true;
        break;
      case 'PriorityChangedEvent':
        intern = true;
        break;
      case 'RenamedTitleEvent':
        intern = true;
        break;
      case 'WasLinkedEvent':
        intern = false;
        break;
      case 'WasUnlinkedEvent':
        intern = false;
        break;
      case 'AddedArtifactEvent':
        intern = true;
        break;
      case 'RemovedArtifactEvent':
        intern = true;
        break;
      case 'AddedNonFunctionalConstraintEvent':
        intern = true;
        break;
      case 'RemovedNonFunctionalConstraintEvent':
        intern = true;
        break;
    }

    return {'timeline-inverted': intern};
  }
}
