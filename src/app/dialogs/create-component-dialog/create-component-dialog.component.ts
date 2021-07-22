import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IssueGraphComponent} from '@app/graphs/issue-graph/issue-graph.component';
import {Point} from '@ustutt/grapheditor-webcomponent/lib/edge';
import {CreateComponentInput, ImsType} from 'src/generated/graphql';
import {AuthenticationService} from '@app/auth/authentication.service';
import {IssueGraphStateService} from '@app/data/issue-graph/issue-graph-state.service';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {ComponentStoreService} from '@app/data/component/component-store.service';

@Component({
  selector: 'app-create-component-dialog',
  templateUrl: './create-component-dialog.component.html',
  styleUrls: ['./create-component-dialog.component.scss']
})
export class CreateComponentDialogComponent implements OnInit {
  @Input() projectId: string;
  public loading: boolean;
  public saveFailed: boolean;
  validateForm!: FormGroup;
  private zeroPosition: Point = {x: 0, y: 0};
  private graph: IssueGraphComponent;

  constructor(public dialogRef: MatDialogRef<CreateComponentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CreateComponentData,
              private fb: FormBuilder,
              private gs: IssueGraphStateService,
              private componentStore: ComponentStoreService,
              private authService: AuthenticationService,
              private notify: UserNotifyService) {
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
      url: [null, [Validators.required]],
      ims: [null, [Validators.required]],
      provider: [null, [Validators.required]]
    });
  }

  // close dialog on cancel
  onNoClick(): void {
    this.dialogRef.close();
  }

  // callback method for component creation
  onOkClick(name: string, url: string, description: string, ims: string, provider: string): void {
    // check for valid form
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });
    this.loading = true;

    // define the input for the database mutation - required fields are specified by the graphQL schema
    // TODO: Add component to IMS?
    const input: CreateComponentInput = {
      name,
      projects: [this.data.projectId],
      description,
      repositoryURL: url
    };

    this.componentStore.createComponent(input).subscribe(({data}) => {
      this.loading = false;
    }, (error) => {
      this.notify.notifyError('Failed to create component!', error);
      this.loading = false;
      this.saveFailed = true;
    });

    if (!this.saveFailed) {
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
  }
}

export interface ComponentInformation {
  name: string;
  url: string;
}

interface CreateComponentData {
  projectId: string;
}
