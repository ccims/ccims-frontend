import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-component-dialog',
  templateUrl: './create-component-dialog.component.html',
  styleUrls: ['./create-component-dialog.component.scss']
})
export class CreateComponentDialogComponent implements OnInit {
  @Input() name: string;
  @Input () url: string;
  public loading: boolean;
  public saveFailed: boolean;
  validateForm!: FormGroup;
  constructor(public dialogRef: MatDialogRef<CreateComponentDialogComponent>, private fb: FormBuilder) { this.loading = false; }

  validationName = new FormControl('', [Validators.required]);
  validationUrl = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      url:  [null, [Validators.required]]
    });
  }

  onNoClick(): void {
    // console.log(this.name);
    this.dialogRef.close();
  }

  onOkClick(name: string, url: string): void{
    // check for valid form
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });
    this.loading = true;
    let component: ComponentInformation;
    component = {
      name: this.name,
      url: this.url
    }

    // save component

    // tbd.
    this.loading = false;
    if (!this.saveFailed){
      this.dialogRef.close(component);
    }
  }
  afterAlertClose(): void {
    this.saveFailed = false;
  }
}
export interface ComponentInformation {
  name: string;
  url: string;


}
