import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.scss']
})
export class CreateProjectDialogComponent implements OnInit {
private name;
  constructor(public dialogRef: MatDialogRef<CreateProjectDialogComponent>) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    // console.log(this.name);
    this.dialogRef.close();

  }
  onOkClick(): void{
    // console.log(this.url)
    this.dialogRef.close(this.name);
  }
}
