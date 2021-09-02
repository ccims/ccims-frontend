import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IssueStoreService} from '@app/data/issue/issue-store.service';
import {CreateIssueInput, GetComponentQuery, IssueCategory, LinkIssueInput} from '../../../generated/graphql';
import {ProjectStoreService} from '@app/data/project/project-store.service';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {CCIMSValidators} from '@app/utils/validators';

@Component({
  selector: 'app-create-issue-dialog',
  templateUrl: './create-issue-dialog.component.html',
  styleUrls: ['./create-issue-dialog.component.scss']
})
/**
 * This component opens a dialog for the issue creation
 *
 */
export class CreateIssueDialogComponent implements OnInit {
  @Input() title: string;
  @Input() body: string;

  public loading: boolean;
  public saveFailed: boolean;

  constructor(public dialogRef: MatDialogRef<CreateIssueDialogComponent>,
              private issueStoreService: IssueStoreService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private projectStore: ProjectStoreService,
              private notify: UserNotifyService) {
    this.loading = false;
    this.prepareLinkableIssues();
  }

  // create form controls for the form fields
  validationTitle = new FormControl('', [CCIMSValidators.nameValidator, Validators.required]);
  // validationBody = new FormControl('', [CCIMSValidators.contentValidator, Validators.required]);
  validationCategory = new FormControl('', [Validators.required]);
  issuesLoaded = false;
  selectedIssues: any = [];
  linkableProjectIssues: any = [];

  selectableComponentInterfaces = []; // this.data.component.node.interfaces.nodes;
  selectedInterfaces = [];
  selectedAssignees = [];
  assignees = [{id: '0', name: 'user'}, {id: '2', name: 'zweiter User'}, {id: '3', name: 'dritter User'}];

  ngOnInit(): void {
    this.validationCategory.setValue('UNCLASSIFIED');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  afterAlertClose(): void {
    this.saveFailed = false;
  }

  onOkClick(title: string, body: string, category: IssueCategory, selectedLabels: string[]): void {
    this.loading = true;
    // set properties for create issue mutation
    const issueInput: CreateIssueInput = {
      title,
      components: [this.data.id],
      body,
      category,
      assignees: ['0'],
      labels: selectedLabels,
      locations: this.selectedInterfaces.concat(this.data.component.node.id)
    };

    this.loading = true;

    // create issue mutation
    this.issueStoreService.create(issueInput).subscribe(({data}) => {
      // link the created issue to all selected issues
      this.selectedIssues.forEach(issueId => {
        const issueInput: LinkIssueInput = {
          issue: data.createIssue.issue.id,
          issueToLink: issueId
        };

        this.issueStoreService.link(issueInput).subscribe(({data}) => {
        }, (error) => {
          this.notify.notifyError('Failed to link issue!', error);
          this.loading = false;
          this.saveFailed = true;
        });
      });
      this.loading = false;
      this.dialogRef.close(data);
    }, (error) => {
      this.notify.notifyError('Failed to create issue!', error);
      this.loading = false;
      this.saveFailed = true;
    });
  }

  /**
   * this method changes the format of the issues and interfaces
   * the component name is added to the issue and interface information so that the linkable issues and interfaces
   * can be displayed in a list, ordered by the corresponding component name
   */
  private prepareLinkableIssues() {
    this.projectStore.getFullProject(this.data.projectId).subscribe(project => {
      const projectComponents = project.node.components.edges;
      projectComponents.forEach(component => {
        const currentComponentName = component.node.name;
        const currentComponentIssueArray = component.node.issues.nodes;
        currentComponentIssueArray.forEach(issue => {
          const tempIssue = {
            id: issue.id,
            title: issue.title,
            component: currentComponentName
          };
          this.linkableProjectIssues.push(tempIssue);
        });
      });
      // All Interfaces
      const projectInterfaces = project.node.interfaces.nodes;
      projectInterfaces.forEach(projectInterface => {
        const currentInterfaceName = projectInterface.name;
        const currentComponentIssueArray = projectInterface.issuesOnLocation.nodes;
        currentComponentIssueArray.forEach(issue => {
          const tempIssue = {
            id: issue.id,
            title: issue.title,
            component: 'Interface: ' + currentInterfaceName
          };
          this.linkableProjectIssues.push(tempIssue);
        });
      });

      this.issuesLoaded = true;
    });
  }
}

// interface that defines what data is injected to the dialog
export interface DialogData {
  user: string;
  name: string;
  id: string;
  category: string;
  component: GetComponentQuery;
  projectId: string;
}
