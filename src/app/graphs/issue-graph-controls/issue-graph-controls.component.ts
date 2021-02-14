import { Component, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { IssueGraphComponent } from '../issue-graph/issue-graph.component';
import { IssueCategory } from 'src/generated/graphql';
import { BehaviorSubject, Observable, combineLatest, ReplaySubject } from 'rxjs';
import { SelectedCategories } from '../shared';
import { IssueGraphStateService } from '../../data/issue-graph/issue-graph-state.service';
import { LabelSearchComponent } from '../label-search/label-search.component';
import { map, takeUntil } from 'rxjs/operators';
import { FilterState } from '@app/graphs/shared';

/**
 * This component contains the graph toggles, the search bar and the button
 * for creating new components. Additionally it contains the actual graph component and feeds
 * data to it. This component collects the state of the search bar and graph toggles, combines it and emits it via this.filter$.
 * Another observable retrieved from the IssueGraphStateService maps these values into the graph
 * data matching the filters. Whenever new graph data arrives it is feed to the actual graph component. (see ngAfterViewInit)
 */
@Component({
  selector: 'app-issue-graph-controls',
  templateUrl: './issue-graph-controls.component.html',
  styleUrls: ['./issue-graph-controls.component.scss']
})
export class IssueGraphControlsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(IssueGraphComponent) issueGraph: IssueGraphComponent;
  @ViewChild(LabelSearchComponent) labelSearch: LabelSearchComponent;

  projectId: string;

  // these 3 booleans are bound to the issue category toggles via ngModel
  featureRequests = true;
  bug = true;
  unclassified = true;

  showRelations = true;
  // emits state of toggles and search bar combined
  filter$: BehaviorSubject<FilterState>;
  private destroy$ = new ReplaySubject<void>(1);

  constructor(public dialog: MatDialog, private gs: IssueGraphStateService, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.filter$ = new BehaviorSubject({
      selectedCategories: this.getSelectedCategories(), selectedFilter: {
        labels: [], texts: []
      }
    });
  }

  public selectedCategories$ = new BehaviorSubject<SelectedCategories>(
    this.getSelectedCategories()
  );

  /**
   * Emit newly selected categories via this.selectedCategories$
   */
  public updateSelectedCategories() {
    this.selectedCategories$.next(
      this.getSelectedCategories());
  }

  /**
   * Gathers booleans indicating whether the toggle switches
   * coressponding to values in IssueCategory are turned on or off
   */
  private getSelectedCategories(): SelectedCategories {
    return {
      [IssueCategory.Bug]: this.bug,
      [IssueCategory.FeatureRequest]: this.featureRequests,
      [IssueCategory.Unclassified]: this.unclassified,
    };
  }

  /**
   * Setup this.filter$ and create subscription for observable returned from graphDataForFilter
   */
  ngAfterViewInit(): void {
    // sets up emission of values representing the state of the graph toggles and the search bar via this.filter$
    combineLatest([this.selectedCategories$, this.labelSearch.filterSelection$]).pipe(
      takeUntil(this.destroy$),
      map(([selectedCategories, filterSelection]) => ({ selectedCategories, selectedFilter: filterSelection }))
    ).subscribe(filterState => this.filter$.next(filterState));

    // gets an obervable from GraphStateService that emits the matching graph state
    // after this component emits values on this.filter$ or the IssueGraphComponent
    // signals the need for a reload via this.issueGraph.reload$. Whenever new graph state
    // arrives we pass it to the graph and issue a redraw on it.
    this.gs.graphDataForFilter(this.filter$, this.issueGraph.reload$, this.destroy$).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      graphData => {
        this.issueGraph.graphData = graphData;
        this.issueGraph.drawGraph();
      }
    );
  }

  /**
   * Tell the graph component whether to show issue relations or not.
   *
   */
  setRelationVisibility(): void {
    this.issueGraph.setRelationVisibility(this.showRelations);
  }

  /**
   * Cancel subscriptions by emitting a value on this.destroy$
   */
  ngOnDestroy() {
    this.destroy$.next();
  }

}
