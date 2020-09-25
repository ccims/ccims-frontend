import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.scss']
})
export class CreateProjectDialogComponent implements OnInit {
public name: string;
public loading: boolean;
public saveFailed: boolean;

  constructor(public dialogRef: MatDialogRef<CreateProjectDialogComponent>) { this.loading = false; }
  email = new FormControl('', [Validators.required]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.saveFailed ? 'Save failed' : '';
  }
  ngOnInit(): void {
  }
  onNoClick(): void {
    // console.log(this.name);
    this.dialogRef.close();

  }
  onOkClick(): void{
    this.loading = true;
    // console.log(this.url)
    // delete the timeout function for prod use
    setTimeout(() => {
      this.loading = false;
      // need good condition (checking save success??)
      if (this.name == ''|| !this.name) {
        this.saveFailed = true;
      }else this.dialogRef.close(this.name);


    }, 2000);

  }
}
