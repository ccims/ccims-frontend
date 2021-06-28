import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-project-member-component',
  templateUrl: './remove-project-member-component.component.html',
  styleUrls: ['./remove-project-member-component.component.scss']
})
export class RemoveProjectMemberComponentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveProjectMemberComponentComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(){

    this.dialogRef.close();

  }

}
