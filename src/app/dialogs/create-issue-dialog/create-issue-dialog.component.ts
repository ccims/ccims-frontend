import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IssueStoreService } from '@app/data/issue/issue-store.service';
import { CreateIssueInput, CreateIssuePayload, Issue, IssueCategory, Component as comp, GetComponentQuery, CreateLabelInput} from '../../../generated/graphql';
import { LabelStoreService } from '@app/data/label/label-store.service';
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
              private labelStore: LabelStoreService) { this.loading = false;}
  validationTitle = new FormControl('', [Validators.required]);
  validationBody = new FormControl('', [Validators.required]);
  validationCategory = new FormControl('', [Validators.required]);
  validationLabelName = new FormControl('', [Validators.required]);
  validationLabelColor = new FormControl('', [Validators.required]);
  color = '#ff00ff';

  // mock for the labels and assignees
  selectedLabels = [];
  // labels = [{id: '1', name: 'rotes Label'}, {id: '2', name: 'gelbes Label'}, {id: '3', name: 'pinkes Label'}];
  labels = this.data.component.node.labels.nodes;
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
      labels: this.selectedLabels

  };


  this.loading = false;

  this.issueStoreService.create(issueInput).subscribe(({ data}) => {
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
}
export interface DialogData {
  user: string;
  name: string;
  id: string;
  category: string;
  component: GetComponentQuery;
}
