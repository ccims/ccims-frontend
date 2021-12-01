import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-profile-settings-dialog',
  templateUrl: './profile-settings-dialog.component.html',
  styleUrls: ['./profile-settings-dialog.component.scss']
})
export class ProfileSettingsDialogComponent {
  hide = true;
  updatePasswordFieldsShown = false;
  description = '';

  constructor(public dialogRef: MatDialogRef<boolean>, private dialog: MatDialog) {}

  //close profile settings dialog
  public closeDialog(): void {
    this.dialogRef.close();
  }

  //TODO
  public changePassword(): void {
    this.updatePasswordFieldsShown = true;
  }

  //TODO
  public cancel(): void {
    this.updatePasswordFieldsShown = false;
  }

  //TODO
  public updatePassword(): void {
    this.updatePasswordFieldsShown = false;
  }

  projectNameEdited(saved: boolean): void {
    if (!saved) {
      return;
    }

    alert('TODO: Save');
  }
}
