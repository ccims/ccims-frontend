import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, ValidatorFn} from '@angular/forms';

/**
 * This component is a confirmation dialog for anything that involves deleting
 *
 * #### Example
 * ```ts
 * // ...
 *
 * constructor(private dialog: MatDialog, ...)
 *
 * // ...
 *
 * const dialogRef = this.dialog.open(RemoveDialogComponent,
 * {
 *   data: {
 *     title: 'This is the title of the dialog',
 *     messages: ['Every entry is a new line',
 *                'This is the next line',
 *                ' Lines beginning with a space will be indented'],
 *     verificationName: 'In order for the user to be able to click the confirm button, this text has to be typed',
 *     confirmButtonText: 'This is the text of the confirm button'
 *   }
 * });
 *
 * dialogRef.afterClosed().subscribe(confirm => {
 *   if (confirm) {
 *     console.log('Deleted!');
 *   } else {
 *     console.log('Not deleted!');
 *   }
 * });
 * ```
 */
@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.scss']
})
export class RemoveDialogComponent implements OnInit {
  matchValidator: ValidatorFn = (control) => {
    return control.value === this.data.verificationName ? null : {"Names don't match": true};
  };

  verificationNameInput = new FormControl('', this.matchValidator);

  constructor(public dialogRef: MatDialogRef<RemoveDialogComponent, boolean>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

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
  /** The list of lines shown in the dialog. If a line starts with a space, the line will be indented */
  messages: Array<string>;
  /** If set, shows a text box that forces the user to type the specified text before being able to click the confirm button */
  verificationName?: string;
  /** If set, shows this text as the text in the confirm button. If not set, button shows 'Delete' */
  confirmButtonText?: string;
}
