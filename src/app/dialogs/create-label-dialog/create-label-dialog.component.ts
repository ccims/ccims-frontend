import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {CCIMSValidators} from '@app/utils/validators';
import { decodeNodeId, encodeListId, ListId, ListType, NodeId } from '@app/data-dgql/id';
import DataService from '@app/data-dgql';
import { ComponentFilter, Label } from '../../../generated/graphql-dgql';

export interface CreateLabelDialogData {
  projectId: NodeId;
}

@Component({
  selector: 'app-create-label-dialog-component',
  templateUrl: './create-label-dialog.component.html',
  styleUrls: ['./create-label-dialog.component.scss']
})
export class CreateLabelDialogComponent implements OnInit {
  validationLabelName = new FormControl('', [Validators.required, Validators.maxLength(30)]);
  validationLabelDescription = new FormControl('', CCIMSValidators.contentValidator);
  color = '#000000';
  loading = false;

  componentIds = [];
  allComponentsList: ListId;

  constructor(private dialog: MatDialogRef<CreateLabelDialogComponent, Label>,
              private dataService: DataService,
              @Inject(MAT_DIALOG_DATA) private data: CreateLabelDialogData,
              private notify: UserNotifyService) {
  }

  ngOnInit() {
    this.randomizeColor();

    this.allComponentsList = encodeListId({
      node: decodeNodeId(this.data.projectId),
      type: ListType.Components
    });
  }

  makeComponentFilter(search): ComponentFilter {
    return { name: search };
  }
  applyComponentChangeset = async (additions: NodeId[], deletions: NodeId[]) => {
    for (const item of additions) {
      if (!this.componentIds.includes(item)) {
        this.componentIds.push(item);
      }
    }
    for (const item of deletions) {
      if (this.componentIds.includes(item)) {
        this.componentIds.splice(this.componentIds.indexOf(item), 1);
      }
    }
  }

  onLabelCancelClick(): void {
    this.dialog.close(null);
  }

  onConfirmCreateLabelClick(name: string, description?: string) {
    this.loading = true;
    this.dataService.mutations.createLabel(
      Math.random().toString(),
      this.componentIds,
      name,
      this.color,
      description
    ).then(created => {
      this.dialog.close(created as Label);
    }).catch((error) => {
      this.notify.notifyError('Failed to create label!', error);
    }).finally(() => {
      this.loading = false;
    });
  }

  randomizeColor(): void {
    const r = ('00' + (Math.random() * 0xFF).toString(16)).slice(-2);
    const g = ('00' + (Math.random() * 0xFF).toString(16)).slice(-2);
    const b = ('00' + (Math.random() * 0xFF).toString(16)).slice(-2);

    this.color = '#' + r + g + b;
  }
}
