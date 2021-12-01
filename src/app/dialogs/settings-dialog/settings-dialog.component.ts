import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {MatDialog} from '@angular/material/dialog';
import {ProfileSettingsDialogComponent} from '../profile-settings-dialog/profile-settings-dialog.component';
import {AccessTokenDialogComponent} from '../access-token-dialog/access-token-dialog.component';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  mode = 'Dark Mode';
  modeIcon = 'dark_mode';

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent, boolean>, private dialog: MatDialog) {}

  //open the dialog with profile settings
  public openProfileSettings(): void {
    this.dialogRef.close();
    this.dialog.open(ProfileSettingsDialogComponent);
  }

  //open the dialog with access token settings
  public openAccessTokenSettings(): void {
    this.dialogRef.close();
    this.dialog.open(AccessTokenDialogComponent);
  }

  //switch to dark mode / light mode (TODO)
  public switchTheme(): void {
    if (this.mode === 'Light Mode') {
      this.mode = 'Dark Mode';
    } else {
      this.mode = 'Light Mode';
    }

    if (this.modeIcon === 'light_mode') {
      this.modeIcon = 'dark_mode';
    } else {
      this.modeIcon = 'light_mode';
    }
  }
}
