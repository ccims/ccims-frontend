import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.scss']
})
export class CreateProjectDialogComponent implements OnInit {
public name: string;
public loading: boolean;
  constructor(public dialogRef: MatDialogRef<CreateProjectDialogComponent>) { this.loading = false; }

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
      this.dialogRef.close(this.name);
    }, 2000);

  }
}
