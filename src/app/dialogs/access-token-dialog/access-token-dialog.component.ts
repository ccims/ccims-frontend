import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-access-token-dialog',
  templateUrl: './access-token-dialog.component.html',
  styleUrls: ['./access-token-dialog.component.scss']
})
export class AccessTokenDialogComponent implements OnInit {
  selected = 'option2';

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent, boolean>, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  //go one step back (to the settings menu)
  public goBackToSettings() {
    this.dialogRef.close();
    this.dialog.open(SettingsDialogComponent);
  }

}
