import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { IssueCategory } from '../../../generated/graphql';
import { UserNotifyService } from '@app/user-notify/user-notify.service';
import { CCIMSValidators } from '@app/utils/validators';
import { CreateIssueInput } from '../../../generated/graphql-dgql';
import { encodeNodeId, getRawId, NodeType } from '@app/data-dgql/id';
import DataService from '@app/data-dgql';
import { LocalIssueData } from '@app/issue-detail/issue-sidebar.component';

@Component({
  selector: 'app-create-issue-dialog',
  templateUrl: './create-issue-dialog.component.html',
  styleUrls: ['./create-issue-dialog.component.scss']
})
/**
 * This component opens a dialog for the issue creation.
 */
export class CreateIssueDialogComponent implements OnInit {
  @ViewChild('body') body;

  public loading = false;
  public saveFailed = false;

  constructor(public dialogRef: MatDialogRef<CreateIssueDialogComponent>,
              private dataService: DataService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private notify: UserNotifyService
  ) {
  }

  // form controls for the form fields
  title = new FormControl('', [CCIMSValidators.nameValidator, Validators.required]);
  category = new FormControl('', [Validators.required]);

  public issueData: LocalIssueData = {
    components: [],
    locations: [],
    labels: [],
    assignees: [],
    linksToIssues: [],
  };

  ngOnInit(): void {
    // sets up the issue category as Unclassified
    this.category.setValue(IssueCategory.Unclassified);

    // updates items to be selected
    this.updateSelectedItems();
  }

  /**
   * Updates items to be selected in the Create Issue page,
   * including 1) components and 2) locations.
   */
  private updateSelectedItems() {

    // updates components
    for (const componentId of this.data.components) {
      this.issueData.components.push(componentId);
      this.issueData.locations.push(componentId);
    }

    // updates locations
    for (const componentId of this.data.locations) {
      this.issueData.locations.push(componentId);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  afterAlertClose(): void {
    this.saveFailed = false;
  }

  onCreate() {
    const issueData: CreateIssueInput = {
      title: this.title.value,
      body: this.body.code,
      category: this.category.value,
      clientMutationID: Math.random().toString(36),
      components: this.issueData.components.map(getRawId),
      locations: this.issueData.locations.map(getRawId),
      labels: this.issueData.labels.map(getRawId),
      assignees: this.issueData.assignees.map(getRawId),
    };
    this.loading = true;
    this.saveFailed = false;
    this.dataService.mutations.createIssue(issueData).then(async result => {
      const issueId = encodeNodeId({ type: NodeType.Issue, id: result.id });
      const promises = [];
      for (const linked of this.issueData.linksToIssues) {
        promises.push(this.dataService.mutations.linkIssue(Math.random().toString(), issueId, linked).catch(err => {
          this.notify.notifyError('Failed to link issue!', err);
          // aborting on this error would cause weird non-recoverable state so we won't rethrow it
        }));
      }
      await Promise.all(promises);

      this.dialogRef.close(true);
    }).catch(err => {
      this.notify.notifyError('Failed to create issue!', err);
      this.saveFailed = true;
    }).finally(() => {
      this.loading = false;
    });
  }
}

/**
 * Interface that defines what data is injected to the dialog.
 */
export interface DialogData {
  projectId: string;
  // initial state of the issue's component list
  components: string[];
  // initial state of the issue's location list
  locations: string[];
}
