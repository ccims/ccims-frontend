import {Component, Inject, Input} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthenticationService} from '@app/auth/authentication.service';
import {IssueGraphStateService} from '@app/data/issue-graph/issue-graph-state.service';
import {InterfaceStoreService} from '@app/data/interface/interface-store.service';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {CCIMSValidators} from '@app/utils/validators';

@Component({
  selector: 'app-create-interface-dialog',
  templateUrl: './create-interface-dialog.component.html',
  styleUrls: ['./create-interface-dialog.component.scss']
})
export class CreateInterfaceDialogComponent {
  @Input()
  projectId: string;

  public loading: boolean;
  public saveFailed: boolean;
  validationName = new FormControl('', [CCIMSValidators.nameFormatValidator, Validators.required]);
  validationDescription = new FormControl('', CCIMSValidators.contentValidator);

  constructor(
    public dialogRef: MatDialogRef<CreateInterfaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateInterfaceData,
    private fb: FormBuilder,
    private gs: IssueGraphStateService,
    private authService: AuthenticationService,
    private interfaceStore: InterfaceStoreService,
    private notify: UserNotifyService
  ) {
    this.loading = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(name: string, description: string): void {
    this.loading = true;

    // db mutation to create an interface
    this.interfaceStore.create(name, this.data.offeredById, description).subscribe(
      ({data}) => {
        this.loading = false;

        // close dialog and return the interface id of the created dialog
        this.dialogRef.close(data.createComponentInterface.componentInterface.id);
      },
      (error) => {
        this.notify.notifyError('Failed to create interface!', error);
        this.loading = false;
        this.saveFailed = true;
      }
    );
  }

  afterAlertClose(): void {
    this.saveFailed = false;
  }
}

export interface CreateInterfaceData {
  position: {x: number; y: number};
  offeredById: string;
}
