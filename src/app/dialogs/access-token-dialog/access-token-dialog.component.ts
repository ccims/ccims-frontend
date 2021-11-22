import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-access-token-dialog',
  templateUrl: './access-token-dialog.component.html',
  styleUrls: ['./access-token-dialog.component.scss']
})
export class AccessTokenDialogComponent implements OnInit {
  selected = 'option2';

  constructor(public dialogRef: MatDialogRef<boolean>, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  //close access token settings dialog
  public closeDialog() {
    this.dialogRef.close();
  }

  public generateToken() {
    //TODO
  }

}
