import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CreateLabelInput, CreateLabelMutation} from '../../../generated/graphql';
import {LabelStoreService} from '@app/data/label/label-store.service';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {CCIMSValidators} from '@app/utils/validators';

export interface CreateLabelDialogData {
  componentId: string;
}

@Component({
  selector: 'app-create-label-dialog-component',
  templateUrl: './create-label-dialog.component.html',
  styleUrls: ['./create-label-dialog.component.scss']
})
export class CreateLabelDialogComponent implements OnInit {
  validationLabelName = new FormControl('', [Validators.required, Validators.maxLength(30)]);
  validationLabelDescription = new FormControl('', CCIMSValidators.contentValidator);
  color = '#d31111'; // The default color for the label color picker
  loading = false;

  constructor(private dialog: MatDialogRef<CreateLabelDialogComponent, CreateLabelMutation>,
              private labelStore: LabelStoreService,
              @Inject(MAT_DIALOG_DATA) private data: CreateLabelDialogData,
              private notify: UserNotifyService) {
  }

  ngOnInit() {
    this.randomizeColor();
  }

  onLabelCancelClick(): void {
    this.dialog.close(null);
  }

  onConfirmCreateLabelClick(name: string, description?: string) {
    const input: CreateLabelInput = {
      name,
      color: this.color,
      components: [this.data.componentId],
      description
    };

    this.loading = true;
    this.labelStore.createLabel(input).subscribe(({data}) => {
      this.loading = false;
      this.dialog.close(data);
    }, (error) => {
      this.notify.notifyError('Failed to create label!', error);
      this.loading = false;
      this.dialog.close(null);
    });
  }

  randomizeColor(): void {
    const r = ('00' + (Math.random() * 0xFF).toString(16)).slice(-2);
    const g = ('00' + (Math.random() * 0xFF).toString(16)).slice(-2);
    const b = ('00' + (Math.random() * 0xFF).toString(16)).slice(-2);

    this.color = '#' + r + g + b;
  }
}
