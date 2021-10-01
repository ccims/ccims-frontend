import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimeFormatter } from '@app/issue-detail/TimeFormatter';
import { Router } from '@angular/router';
import { IssueTimelineItem } from '../../../generated/graphql-dgql';
import { DataList } from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import { encodeListId, encodeNodeId, ListType, NodeType } from '@app/data-dgql/id';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

  // Provides time format functions
  public timeFormatter = new TimeFormatter();
  timelineItems = [];
  public timelineItems$: DataList<IssueTimelineItem, unknown>;
  public timelineItemsSub: Subscription;
  @Input() issueId: string;
  @Input() projectID: string;

  constructor(private dataService: DataService,
              private router: Router) { }

  ngOnInit(): void {
    this.requestTimelineItems();
  }

  requestTimelineItems(): void {
    // Get observeable with all timelineitems for current issue
    this.timelineItems$ = this.dataService.getList(encodeListId({
      node: { type: NodeType.Issue, id: this.issueId },
      type: ListType.TimelineItems
    }));
    this.timelineItems$.count = 99999; // FIXME?

    this.timelineItemsSub = this.timelineItems$.subscribe((elements) => {
      console.log(elements.values());
    });
  }

  ngOnDestroy() {
    this.timelineItemsSub?.unsubscribe();
  }

  /**
   * Checks if user self assigned this issue for text representation
   * @param timelineItem
   */
  selfAssigned(assignedEvent): boolean{
    if (assignedEvent.createdBy.id === assignedEvent.removedAssignee?.id){
      return true;
    }
    else if (assignedEvent.createdBy.id === assignedEvent.assignee?.id){
      return true;
    }
    return false;
  }

  makeCommentId(node) {
    return encodeNodeId({ type: NodeType.IssueComment, id: node.id });
  }

  goToComponentDetails(component){
    this.router.navigate(['projects', this.projectID, 'component', component.id]);
  }

  goToLocationDetails(location){
    if (location.__typename === 'Component'){
      this.router.navigate(['projects', this.projectID, 'component', location.id]);
    }
    else {
      this.router.navigate(['projects', this.projectID, 'interface', location.id]);
    }
  }
}
