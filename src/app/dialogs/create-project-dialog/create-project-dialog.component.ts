import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProjectStoreService} from '@app/data/project/project-store.service';
import {UserNotifyService} from '@app/user-notify/user-notify.service';

/**
 * This component provides a dialog for the project creation
 * The user can set a name and description
 *
 */
@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.scss']
})
export class CreateProjectDialogComponent implements OnInit {
  @Input() name: string;
  @Input() description: string;
  public loading: boolean;
  public saveFailed: boolean;
  validateForm!: FormGroup;

  constructor(public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
              private ps: ProjectStoreService,
              private fb: FormBuilder,
              private notify: UserNotifyService) {
    this.loading = false;
  }

  validation = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  afterAlertClose(): void {
    this.saveFailed = false;
  }

  // after the user clicked on the create button the project creation mutation is fired
  onOkClick(name: string, description: string): void {
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });
    this.loading = true;
    this.ps.create(name, description).subscribe(({data}) => {
      this.loading = false;
      this.dialogRef.close({createdProjectId: data.createProject.project.id});
    }, (error) => {
      this.notify.notifyError('Failed to create project!', error);
      this.loading = false;
      this.saveFailed = true;
    });
  }
}
