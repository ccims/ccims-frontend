import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { CreateComponentDialogComponent } from '../dialogs/create-component-dialog-demo/create-component-dialog.component';
import { Project, IssueType } from 'src/app/model/state';
// import { ComponentPartial } from '../reducers/components.actions';
// import { ApiService } from '../api/api.service';
import { projA } from 'src/app/model/demo-state';
import { CreateComponentDialogComponent } from '@app/dialogs/create-component-dialog/create-component-dialog.component';
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
import { GroupBehaviour } from '@ustutt/grapheditor-webcomponent/lib/grouping';

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
      [IssueType.BUG]: this.bugReports,
      [IssueType.FEATURE_REQUEST]: this.featureRequests,
      [IssueType.UNCLASSIFIED]: this.undecided,
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
