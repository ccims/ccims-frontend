import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, ValidatorFn} from '@angular/forms';

@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.scss']
})
export class RemoveDialogComponent implements OnInit {
  matchValidator: ValidatorFn = control => {
    return control.value === this.data.verificationName ? null : {'Names don\'t match': true};
  }

  verificationNameInput = new FormControl('', this.matchValidator);

  constructor(public dialogRef: MatDialogRef<RemoveDialogComponent, boolean>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    this.verificationNameInput.markAsTouched();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onDeleteClick(): void {
    this.dialogRef.close(true);
  }
}

export interface DialogData {
  title: string;
  messages: Array<string>;
  verificationName?: string;
}
