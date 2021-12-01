import {Inject} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Output, EventEmitter, Input} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {AuthenticationService} from '@app/auth/authentication.service';
import {MatDialog} from '@angular/material/dialog';
import {ProfileSettingsDialogComponent} from '../profile-settings-dialog/profile-settings-dialog.component';
import {AccessTokenDialogComponent} from '../access-token-dialog/access-token-dialog.component';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {
  mode = 'Dark Mode';
  modeIcon = 'dark_mode';

  constructor(public dialogRef: MatDialogRef<SettingsDialogComponent, boolean>, private dialog: MatDialog) {}

  ngOnInit(): void {}

  //open the dialog with profile settings
  public openProfileSettings() {
    this.dialogRef.close();
    this.dialog.open(ProfileSettingsDialogComponent);
  }

  //open the dialog with access token settings
  public openAccessTokenSettings() {
    this.dialogRef.close();
    this.dialog.open(AccessTokenDialogComponent);
  }

  //switch to dark mode / light mode (TODO)
  public switchTheme() {
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
