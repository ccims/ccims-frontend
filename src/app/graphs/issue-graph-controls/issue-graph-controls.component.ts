import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StateService } from '@app/state.service';
import { ActivatedRoute } from '@angular/router';
import { IssueGraphComponent } from '../issue-graph/issue-graph.component';
import { IssueCategory } from 'src/generated/graphql';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { SelectedCategories } from '../shared';
import { IssueGraphStateService } from '../../data/issue-graph/issue-graph-state.service';
import { LabelSearchComponent } from '../label-search/label-search.component';
import { map } from 'rxjs/operators';
import { FilterState } from '@app/graphs/shared';

@Component({
  selector: 'app-issue-graph-controls',
  templateUrl: './issue-graph-controls.component.html',
  styleUrls: ['./issue-graph-controls.component.scss']
})
export class IssueGraphControlsComponent implements AfterViewInit {

  @ViewChild(IssueGraphComponent) issueGraph: IssueGraphComponent;
  @ViewChild(LabelSearchComponent) labelSearch: LabelSearchComponent;
  projectId: string;
  featureRequests = true;
  bugReports = true;
  undecided = true;

  public selectedCategories$ = new BehaviorSubject<SelectedCategories>(
    this.getSelectedCategories()
  );

  filter$: BehaviorSubject<FilterState> = new BehaviorSubject(null);

  private getSelectedCategories(): SelectedCategories {
    return {
      [IssueCategory.Bug]: this.bugReports,
      [IssueCategory.FeatureRequest]: this.featureRequests,
      [IssueCategory.Unclassified]: this.undecided,
    };
  }
  constructor(public dialog: MatDialog, private ss: StateService, private gs: IssueGraphStateService,
              private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.paramMap.get('id');
  }


  ngAfterViewInit(): void {
    combineLatest([this.selectedCategories$, this.labelSearch.selectedLabels$]).pipe(
      map(([selectedCategories, selectedLabels]) => ({ selectedCategories, selectedLabels}))
    ).subscribe(filterState => this.filter$.next(filterState));
    this.gs.graphDataForFilter(this.filter$, this.issueGraph.reload$).subscribe(
      graphData => {
        this.issueGraph.graphData = graphData;
        this.issueGraph.drawGraph();
      }
    );
  }





  public updateBlacklistFilter() {
    this.selectedCategories$.next(
      this.getSelectedCategories());
  }

}
