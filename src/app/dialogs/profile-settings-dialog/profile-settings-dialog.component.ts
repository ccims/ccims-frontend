import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-profile-settings-dialog',
  templateUrl: './profile-settings-dialog.component.html',
  styleUrls: ['./profile-settings-dialog.component.scss']
})
export class ProfileSettingsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent, boolean>, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  //go one step back (to the settings menu)
  public goBackToSettings() {
    this.dialogRef.close();
    this.dialog.open(SettingsDialogComponent);
  }

}
