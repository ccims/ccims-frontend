import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-access-token-dialog',
  templateUrl: './access-token-dialog.component.html',
  styleUrls: ['./access-token-dialog.component.scss']
})
export class AccessTokenDialogComponent {
  selected = 'option2';

  constructor(public dialogRef: MatDialogRef<boolean>, private dialog: MatDialog) {}

  //close access token settings dialog
  public closeDialog(): void {
    this.dialogRef.close();
  }

  public generateToken(): void {
    //TODO
  }
}
