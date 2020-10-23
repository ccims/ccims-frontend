import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
import { Subject } from 'rxjs';
import { FilterState } from '../shared';

@Component({
  selector: 'app-issue-graph-controls',
  templateUrl: './issue-graph-controls.component.html',
  styleUrls: ['./issue-graph-controls.component.scss']
})
export class IssueGraphControlsComponent {

  @ViewChild(IssueGraphComponent) issueGraph: IssueGraphComponent;
  projectId: string;
  featureRequests = true;
  bugReports = true;
  undecided = true;

  constructor(public dialog: MatDialog, private ss: StateService, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.paramMap.get('id');
  }

  public openCreateComponentDialog(): void {
    /*
      const createComponentDialog = this.dialog.open(CreateComponentDialogComponent);

      createComponentDialog.afterClosed().subscribe((componentInformation: {ownerUsername: string, component: ComponentPartial}) => {
          // TODO add component to project, update graph and backend
          if (componentInformation) {
              console.log(componentInformation)
              //this.api.addComponent(this.project.id, componentInformation.ownerUsername, componentInformation.component);
              //console.log(`Dialog result: ${componentInformation.generalInformation.componentName}`);
          }
      });
      */
    const createComponentDialogRef = this.dialog.open(CreateComponentDialogComponent, {
      data: { projectId: this.projectId }
    });
    createComponentDialogRef.afterClosed().subscribe(componentInformation => {
      // console.log(componentInformation);
      // do something
      this.issueGraph.reload();
    });
  }

  public updateBlacklistFilter() {
    this.issueGraph.filter$.next(
      {
        [IssueType.BUG]: this.bugReports,
        [IssueType.FEATURE_REQUEST]: this.featureRequests,
        [IssueType.UNCLASSIFIED]: this.undecided,
      });
  }

}
