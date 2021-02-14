import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IssueGraphComponent } from '@app/graphs/issue-graph/issue-graph.component';
import { Point } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { CreateComponentGQL, CreateComponentInput, ImsType } from 'src/generated/graphql';
import { AuthenticationService } from '@app/auth/authentication.service';
import { IssueGraphStateService } from '@app/data/issue-graph/issue-graph-state.service';
@Component({
  selector: 'app-create-component-dialog',
  templateUrl: './create-component-dialog.component.html',
  styleUrls: ['./create-component-dialog.component.scss']
})
export class CreateComponentDialogComponent implements OnInit {

  @Input()
  projectId: string;

  public loading: boolean;
  public saveFailed: boolean;
  validateForm!: FormGroup;
  private zeroPosition: Point = {x: 0, y: 0};
  private graph: IssueGraphComponent;
  constructor(public dialogRef: MatDialogRef<CreateComponentDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: CreateComponentData,
              private fb: FormBuilder,
              private gs: IssueGraphStateService, private createComponentMutation: CreateComponentGQL,
              private authService: AuthenticationService) {
                this.loading = false;
              }
  // define validations
  validationName = new FormControl('', [Validators.required]);
  validationUrl = new FormControl('', [Validators.required]);
  validationIMS = new FormControl('', [Validators.required]);
  validationProvider = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      url:  [null, [Validators.required]],
      ims:  [null, [Validators.required]],
      provider:  [null, [Validators.required]]
    });

  }
  // close dialog on cancel
  onNoClick(): void {
    this.dialogRef.close();
  }
  // callback method for component creation
  onOkClick(name: string, url: string, description: string, ims: string, provider: string): void{
    // check for valid form
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });
    this.loading = true;

    // define the input for the database mutation - required fields are specified by the graphQL schema
    const input: CreateComponentInput = {
      name,
      owner: this.authService.currentUserValue.id,
      imsType: this.checkImsType(provider),
      projects: [this.data.projectId],
      description,
      endpoint: ims
    };
    this.createComponentMutation.mutate({input}).subscribe(({data}) => {
      console.log(data.createComponent.component);
      this.loading = false;
      // error handling
    }, (error) => {
      console.log('there was an error sending the query', error);
      this.loading = false;
      this.saveFailed = true;
    });
    if (!this.saveFailed){
      this.dialogRef.close();
    }
  }
  afterAlertClose(): void {
    this.saveFailed = false;
  }
  checkImsType(returnFromSelect: string): ImsType {

    if (returnFromSelect.localeCompare(ImsType.Github) === 0) {
      return ImsType.Github;
    }
    if (returnFromSelect.localeCompare(ImsType.Gitlab) === 0) {
      return ImsType.Gitlab;
    }
    if (returnFromSelect.localeCompare(ImsType.Jira) === 0) {
      return ImsType.Jira;
    }
    if (returnFromSelect.localeCompare(ImsType.Redmine) === 0) {
      return ImsType.Redmine;
    }
    if (returnFromSelect.localeCompare(ImsType.Ccims) === 0) {
      return ImsType.Ccims;
    }


  }
}
export interface ComponentInformation {
  name: string;
  url: string;
}

interface CreateComponentData {
  projectId: string;
}
