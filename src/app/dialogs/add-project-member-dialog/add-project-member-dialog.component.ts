import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
/**
 * This component provides a view to add a member to a project
 * The view is just mocked, so no interaction with the backend or database is provided yet
 */
@Component({
  selector: 'app-add-project-member-dialog',
  templateUrl: './add-project-member-dialog.component.html',
  styleUrls: ['./add-project-member-dialog.component.scss']
})
export class AddProjectMemberDialogComponent implements OnInit {
  loading = false;
  selectedUsers = [];
  constructor(public dialogRef: MatDialogRef<AddProjectMemberDialogComponent>,@Inject(MAT_DIALOG_DATA) public data) { }
  validation = new FormControl('', [Validators.required]);
  validationRole = new FormControl('', [Validators.required]);
  ngOnInit(): void {
    this.validationRole.setValue('administrator')
  }
  onNoClick(){

    this.dialogRef.close();

  }
  onOkClick(){
    const data = {usersToAdd: this.selectedUsers};
    this.dialogRef.close(data);
  }
}
