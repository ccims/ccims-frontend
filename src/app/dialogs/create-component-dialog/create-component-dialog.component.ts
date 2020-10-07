import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GraphComponent } from '../../model/state';
import { IssueGraphComponent } from '@app/graphs/issue-graph/issue-graph.component';
import { Point } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { COMPONENT_UUID_NAMESPACE } from '@app/model/namespace-constants';
import * as Uuid from 'uuid/v5';
import { CreateComponentGQL, CreateComponentInput, ImsType } from 'src/generated/graphql';
import { AuthenticationService } from '@app/auth/authentication.service';
import { IssueGraphStoreService } from '@app/data/issue-graph/issue-graph-store.service';
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
  // private gs:GraphStoreService;
  constructor(public dialogRef: MatDialogRef<CreateComponentDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: CreateComponentData,
              private fb: FormBuilder,
              private gs: IssueGraphStoreService, private createComponentMutation: CreateComponentGQL,
              private authService: AuthenticationService) {
                this.loading = false;
              }

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

  onNoClick(): void {
    // console.log(this.name);
    this.dialogRef.close();
  }

  onOkClick(name: string, url: string, description: string, ims: string, provider: string): void{
    // check for valid form
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });
    this.loading = true;
    // TODO: Anfrage Backend --> Componente Anlegen
    // TODO: ID entgegennehmen und der Komponente hinzufügen
     // copied state
     /*
    component = {
      id: Uuid(name, COMPONENT_UUID_NAMESPACE),
      name: name,
      description: description,
      imsId: null,
      imsRepository: ims,
      owner: null,
      interfaces: {},
      issueCounts: {
      UNCLASSIFIED: 0,
      BUG: 1,
      FEATURE_REQUEST: 2
    },
    issues: [],
    position: this.zeroPosition,
    componentRelations: []
    }; // copied state
    */
    const input: CreateComponentInput = {
      name,
      owner: this.authService.currentUserValue.id,
      // use the dropdown given field
      imsType: ImsType.Github,
      projects: [this.data.projectId]
    };
    this.createComponentMutation.mutate({input}).subscribe(({data}) => {
      console.log(data.createComponent.component);
      this.loading = false;
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
}
export interface ComponentInformation {
  name: string;
  url: string;
}

interface CreateComponentData {
  projectId: string;
}
