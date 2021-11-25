import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { UserNotifyService } from '@app/user-notify/user-notify.service';
import { CCIMSValidators } from '@app/utils/validators';

/**
 * This component provides a dialog for the project creation
 * The user can set a name and description
 *
 */
@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.scss'],
})
export class CreateProjectDialogComponent {
  @Input() name: string;
  @Input() description: string;
  public loading: boolean;
  public saveFailed: boolean;

  constructor(
    public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
    private ps: ProjectStoreService,
    private fb: FormBuilder,
    private notify: UserNotifyService
  ) {
    this.loading = false;
  }

  nameValidator = new FormControl('', [
    CCIMSValidators.nameFormatValidator,
    Validators.required,
  ]);
  descriptionValidator = new FormControl('', CCIMSValidators.contentValidator);

  onNoClick(): void {
    this.dialogRef.close();
  }

  afterAlertClose(): void {
    this.saveFailed = false;
  }

  // after the user clicked on the create button the project creation mutation is fired
  onOkClick(name: string, description: string): void {
    this.loading = true;
    this.ps.create(name, description).subscribe(
      ({ data }) => {
        this.loading = false;
        this.dialogRef.close({
          createdProjectId: data.createProject.project.id,
        });
      },
      (error) => {
        this.notify.notifyError('Failed to create project!', error);
        this.loading = false;
        this.saveFailed = true;
      }
    );
  }
}
