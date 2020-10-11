import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IssueStoreService } from '@app/data/issue/issue-store.service';
import { CreateIssueInput, CreateIssuePayload, Issue, IssueCategory } from '../../../generated/graphql';
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
  constructor(public dialogRef: MatDialogRef<CreateIssueDialogComponent>, private issueStoreService: IssueStoreService,
              private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: DialogData) { this.loading = false; }
  validationTitle = new FormControl('', [Validators.required]);
  validationBody = new FormControl('', [Validators.required]);
  validationCategory = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      body: [null, [Validators.required]]
    });

  }
  onNoClick(): void {
    // console.log(this.name);
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
      category
  };
  console.log(issueInput);

  this.loading = false;

  this.issueStoreService.create(issueInput).subscribe(({ data}) => {
    this.loading = false;
    this.dialogRef.close();
    console.log('got data', data);
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
}
