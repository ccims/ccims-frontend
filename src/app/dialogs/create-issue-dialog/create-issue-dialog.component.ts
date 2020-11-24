import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IssueStoreService } from '@app/data/issue/issue-store.service';
import { CreateIssueInput, CreateIssuePayload, Issue, IssueCategory, Component as comp,
  GetComponentQuery, CreateLabelInput, LinkIssueInput} from '../../../generated/graphql';
import { LabelStoreService } from '@app/data/label/label-store.service';
import { ProjectStoreService } from '@app/data/project/project-store.service';
@Component({
  selector: 'app-create-issue-dialog',
  templateUrl: './create-issue-dialog.component.html',
  styleUrls: ['./create-issue-dialog.component.scss']
})
export class CreateIssueDialogComponent implements OnInit {
  @Input() title: string;
  @Input() body: string;
  public loading: boolean;
  public saveFailed: boolean;
  validateForm!: FormGroup;
  public newLabelOpen = false;
  constructor(public dialogRef: MatDialogRef<CreateIssueDialogComponent>, private issueStoreService: IssueStoreService,
              private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private labelStore: LabelStoreService, private projectStore: ProjectStoreService) { this.loading = false;
                                                                                                  this.prepareLinkableIssues();
               }
  validationTitle = new FormControl('', [Validators.required]);
  validationBody = new FormControl('', [Validators.required]);
  validationCategory = new FormControl('', [Validators.required]);
  validationLabelName = new FormControl('', [Validators.required]);
  validationLabelColor = new FormControl('', [Validators.required]);
  color = '#ff00ff';
  issuesLoaded = false;
  selectedIssues: any = [];
  linkableProjectIssues: any = [];

  // mock for the labels and assignees
  selectedLabels = [];
  labels = this.data.component.node.labels.nodes;
  selectableComponentInterfaces = this.data.component.node.interfaces.nodes;
  selectedInterfaces = [];
  selectedAssignees = [];
  assignees = [{id: '0', name: 'user'}, {id: '2', name: 'zweiter User'}, {id: '3', name: 'dritter User'}];
  // mock for the labels and assignees

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      body: [null, [Validators.required]]
    });
    this.validationCategory.setValue('UNCLASSIFIED');

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  afterAlertClose(): void {
  this.saveFailed = false;

}
onOkClick(title: string, body: string, category: IssueCategory): void{
  Object.keys(this.validateForm.controls).forEach(controlKey => {
    this.validateForm.controls[controlKey].markAsDirty();
    this.validateForm.controls[controlKey].updateValueAndValidity();
  });
  this.loading = true;

  const issueInput: CreateIssueInput = {
      title,
      componentIDs: [this.data.id],
      body,
      category,
      assignees: ['0'],
      labels: this.selectedLabels,
      locations: this.selectedInterfaces

  };


  this.loading = true;

  this.issueStoreService.create(issueInput).subscribe(({ data}) => {

    this.selectedIssues.forEach(issueId => {
      const issueInput: LinkIssueInput = {
        issue: data.createIssue.issue.id,
        issueToLink: issueId
      };
      this.issueStoreService.link(issueInput).subscribe(({ data}) => {

      }, (error) => {
        console.log('there was an error sending the query', error);
        this.loading = false;
        this.saveFailed = true;
      });
    });
    this.loading = false;
    this.dialogRef.close(data);
  }, (error) => {
    console.log('there was an error sending the query', error);
    this.loading = false;
    this.saveFailed = true;
  });

}

onNewLabelClick(): void {
  if (this.newLabelOpen){
    this.onLabelCancelClick();
  }else {
    this.newLabelOpen = !this.newLabelOpen;
  }

}
onLabelCancelClick(): void {
  this.newLabelOpen = !this.newLabelOpen;
  this.validationLabelName.setValue('');

}
onConfirmCreateLabelCklick(name: string, description?: string) {
// mutation new Label
const input: CreateLabelInput = {
  name,
  color: this.color,
  components: [this.data.component.node.id],
  description
};
this.loading = true;
this.labelStore.createLabel(input).subscribe(({ data}) => {
  this.loading = false;
  // save returned label to labels
  this.labels.push({name: data.createLabel.label.name, id: data.createLabel.label.id});
  this.onLabelCancelClick();
}, (error) => {
  console.log('there was an error sending the query', error);
  this.loading = false;
  this.saveFailed = true;
});


}
private prepareLinkableIssues() {
  this. projectStore.getFullProject(this.data.projectId).subscribe(project => {
    const projectComponents = project.node.components.edges;
    projectComponents.forEach(component => {
      const currentComponentName = component.node.name;
      const currentComponentIssueArray = component.node.issues.nodes;
      currentComponentIssueArray.forEach(issue => {
        const tempIssue = {id: issue.id,
                          title: issue.title,
                          component: currentComponentName};
        this.linkableProjectIssues.push(tempIssue);
      });
    });
    // All Interfaces
    const projectInterfaces = project.node.interfaces.nodes;
    projectInterfaces.forEach(projectInterface => {
      const currentInterfaceName = projectInterface.name;
      const currentComponentIssueArray = projectInterface.issuesOnLocation.nodes;
      currentComponentIssueArray.forEach(issue => {
        const tempIssue = {id: issue.id,
                          title: issue.title,
                          component: 'Interface: ' + currentInterfaceName};
        this.linkableProjectIssues.push(tempIssue);
      });
    });

    this.issuesLoaded = true;
  });
}
}
export interface DialogData {
  user: string;
  name: string;
  id: string;
  category: string;
  component: GetComponentQuery;
  projectId: string;
}
