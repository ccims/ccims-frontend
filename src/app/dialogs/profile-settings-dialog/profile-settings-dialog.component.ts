import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-profile-settings-dialog',
  templateUrl: './profile-settings-dialog.component.html',
  styleUrls: ['./profile-settings-dialog.component.scss']
})
export class ProfileSettingsDialogComponent implements OnInit {

  hide = true;
  updatePasswordFieldsShown = false;
  description = '';

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent, boolean>, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  //go one step back (to the settings menu)
  public goBackToSettings() {
    this.dialogRef.close();
    this.dialog.open(SettingsDialogComponent);
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
