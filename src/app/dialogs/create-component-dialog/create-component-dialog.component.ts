import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { CreateComponentInput, ImsType } from 'src/generated/graphql';
import { IssueGraphStateService } from '@app/data/issue-graph/issue-graph-state.service';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { CCIMSValidators } from '@app/utils/validators';
import { QueryComponent } from '@app/utils/query-component/query.component';

@Component({
  selector: 'app-create-component-dialog',
  templateUrl: './create-component-dialog.component.html',
  styleUrls: ['./create-component-dialog.component.scss']
})
export class CreateComponentDialogComponent {
  @Input() projectId: string;
  @ViewChild(QueryComponent) queryComponent: QueryComponent;

  constructor(
    public dialogRef: MatDialogRef<CreateComponentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateComponentData,
    private fb: FormBuilder,
    private gs: IssueGraphStateService,
    private componentStore: ComponentStoreService
  ) {}

  // define validations
  validationName = new FormControl('', [CCIMSValidators.nameFormatValidator, Validators.required]);
  validationUrl = new FormControl('', [CCIMSValidators.urlValidator, Validators.required]);
  validationIMS = new FormControl('', [CCIMSValidators.urlValidator, Validators.required]);
  validationProvider = new FormControl('', Validators.required);
  validationDescription = new FormControl('', CCIMSValidators.contentValidator);

  // close dialog on cancel
  onNoClick(): void {
    this.dialogRef.close();
  }

  // callback method for component creation
  onOkClick(name: string, url: string, description: string, ims: string, provider: string): void {
    // define the input for the database mutation - required fields are specified by the graphQL schema
    // TODO: Add component to IMS?
    const input: CreateComponentInput = {
      name,
      projects: [this.data.projectId],
      description,
      repositoryURL: url
    };

    this.queryComponent.listenTo(this.componentStore.createComponent(input), () => this.dialogRef.close());
  }

  checkImsType(returnFromSelect: string): ImsType {
    if (returnFromSelect.localeCompare(ImsType.Github) === 0) {
      return ImsType.Github;
    }
  }
}

interface CreateComponentData {
  projectId: string;
}
