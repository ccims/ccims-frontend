import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { CreateProjectInput } from 'src/generated/graphql';
@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.scss']
})
export class CreateProjectDialogComponent implements OnInit {
  @Input() name: string;
  public loading: boolean;
  public saveFailed: boolean;
  validateForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<CreateProjectDialogComponent>, private ps: ProjectStoreService, private fb: FormBuilder) { this.loading = false; }
  validation = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]]
    });
  }
  onNoClick(): void {
    // console.log(this.name);
    this.dialogRef.close();
  }
  afterAlertClose(): void {
  this.saveFailed = false;

}
  onOkClick(name: string): void{
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });
    this.loading = true;
    // console.log(this.url)
    /*delete the timeout function for prod use
    setTimeout(() => {
      this.loading = false;
      // need good condition (checking save success??)
      if (this.name == ''|| !this.name) {
        this.saveFailed = true;
      } else {
      }
    }, 2000);
    */
    this.ps.create(name).subscribe(({ data}) => {
      this.loading = false;
      this.dialogRef.close(this.name);
      console.log('got data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
      this.loading = false;
      this.saveFailed = true;
    });
  }
}
