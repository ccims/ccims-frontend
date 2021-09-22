import {Component, Input, OnInit} from '@angular/core';
import {
  GetAllTimelineItemsQuery
} from '../../../generated/graphql';
import {Observable, Subscription} from 'rxjs';
import {IssueStoreService} from '@app/data/issue/issue-store.service';
import {TimeFormatter} from "@app/issue-detail/TimeFormatter";
import {LabelStoreService} from '@app/data/label/label-store.service';
import {Router} from '@angular/router';
import {Location} from 'graphql';
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
  @Input() projectID: string;

  constructor(private issueStoreService: IssueStoreService,
              public labelStore: LabelStoreService,
              private router: Router) { }

  ngOnInit(): void {
    this.requestTimelineItems();
  }

  requestTimelineItems(): void {
    // Get observeable with all timelineitems for current issue
    this.timelineItems$ = this.issueStoreService.getAllTimelineItems(this.issueId);

    this.timelineItemsSub = this.timelineItems$.subscribe(timeline => {

      // console.log('komplette timeline:');
      // console.log(JSON.stringify(timeline));

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
      return true;
    }
    else if (assignedEvent.createdBy.id === assignedEvent.assignee?.id){
      return true;
    }
    return false;
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
