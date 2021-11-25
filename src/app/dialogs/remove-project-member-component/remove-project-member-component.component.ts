import {Inject} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-remove-project-member-component',
  templateUrl: './remove-project-member-component.component.html',
  styleUrls: ['./remove-project-member-component.component.scss']
})
export class RemoveProjectMemberComponentComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<RemoveProjectMemberComponentComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  //users selected in the dialog to be deleted
  selectedUsers = [];

  ngOnInit(): void {}

  onNoClick() {
    this.dialogRef.close();
  }

  onDeleteClick() {
    const data = {usersToDelete: this.selectedUsers};
    this.dialogRef.close(data);
  }
}
