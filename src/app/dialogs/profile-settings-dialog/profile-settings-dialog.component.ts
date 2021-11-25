import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-profile-settings-dialog',
  templateUrl: './profile-settings-dialog.component.html',
  styleUrls: ['./profile-settings-dialog.component.scss']
})
export class ProfileSettingsDialogComponent implements OnInit {
  hide = true;
  updatePasswordFieldsShown = false;
  description = '';

  constructor(public dialogRef: MatDialogRef<boolean>, private dialog: MatDialog) {}

  ngOnInit(): void {}

  //close profile settings dialog
  public closeDialog() {
    this.dialogRef.close();
  }

  //TODO
  public changePassword() {
    this.updatePasswordFieldsShown = true;
  }

  //TODO
  public cancel() {
    this.updatePasswordFieldsShown = false;
  }

  //TODO
  public updatePassword() {
    this.updatePasswordFieldsShown = false;
  }

  projectNameEdited(saved: boolean): void {
    if (!saved) {
      return;
    }

    alert('TODO: Save');
  }
}
