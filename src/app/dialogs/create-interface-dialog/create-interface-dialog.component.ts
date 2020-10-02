import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '@app/auth/authentication.service';
import { IssueGraphStoreService } from '@app/data/issue-graph/issue-graph-store.service';
import { Point } from '@ustutt/grapheditor-webcomponent/lib/edge';

@Component({
  selector: 'app-create-interface-dialog',
  templateUrl: './create-interface-dialog.component.html',
  styleUrls: ['./create-interface-dialog.component.scss']
})
export class CreateInterfaceDialogComponent implements OnInit {
  @Input()
  projectId: string;

  public loading: boolean;
  public saveFailed: boolean;
  validateForm!: FormGroup;
  private zeroPosition: Point = {x: 0, y: 0};
  // private graph: IssueGraphComponent;

  constructor(public dialogRef: MatDialogRef<CreateInterfaceDialogComponent>,  @Inject(MAT_DIALOG_DATA) public data: CreateInterfaceData,
              private fb: FormBuilder,
              private gs: IssueGraphStoreService,
              // Wenn mutation erstellt wierder eikomentieren
              // private createComponentMutation: CreateInterfaceGQL,
              private authService: AuthenticationService) {
    this.loading = false;
  }

 validationName = new FormControl('', [Validators.required]);


  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(name: string, description: string, type: string): void{
    // check for valid form
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });
    this.loading = true;
    /*
    const input: CreateInterfaceInput = {
      name,
      owner: this.authService.currentUserValue.id,
      componentId: this.data.component,
      projects: [this.data.projectId]
    };
    this.createInterfaceMutation.mutate({input}).subscribe(({data}) => {
      console.log(data.createComponent.component);
      this.loading = false;
    }, (error) => {
      console.log('there was an error sending the query', error);
      this.loading = false;
      this.saveFailed = true;
    });
    */
    if (!this.saveFailed){
      this.dialogRef.close();
    }
  }
  afterAlertClose(): void {
    this.saveFailed = false;
  }
}
interface CreateInterfaceData {
  projectId: string;
  component: string;
}
