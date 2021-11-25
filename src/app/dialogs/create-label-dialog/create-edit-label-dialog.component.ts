import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserNotifyService } from '@app/user-notify/user-notify.service';
import { CCIMSValidators } from '@app/utils/validators';
import { encodeNodeId, ListId, ListType, NodeId } from '@app/data-dgql/id';
import DataService from '@app/data-dgql';
import { ComponentFilter, Label } from '../../../generated/graphql-dgql';

/** Parameters for the create/edit label dialog component. */
export interface CreateEditLabelDialogData {
  /** The raw project id. */
  projectId: NodeId;
  /** If set, will edit an existing label instead of creating a new one. */
  editExisting?: NodeId;
  /** If set, will select all components of this issue */
  issueId?: NodeId[];
}

/**
 * This dialog creates or edits a label.
 *
 * See {@link CreateEditLabelDialogData} for parameters.
 */
@Component({
  selector: 'app-create-edit-label-dialog-component',
  templateUrl: './create-edit-label-dialog.component.html',
  styleUrls: ['./create-edit-label-dialog.component.scss'],
})
export class CreateEditLabelDialogComponent implements OnInit {
  /** Validator for the label name. */
  validationLabelName = new FormControl('', [
    Validators.required,
    Validators.maxLength(30),
  ]);
  /** Validator for the label description. */
  validationLabelDescription = new FormControl(
    '',
    CCIMSValidators.contentValidator
  );
  /** Color state. */
  color = '#000000';
  /** If true, the label that is to be edited is still loading. */
  loading = false;

  /** Component list to be edited. For new labels, this is a list of node IDs. For existing labels, this is a ListId. */
  componentList: NodeId[] | ListId = [];
  /** Source list of all components. */
  allComponentsList: ListId;

  constructor(
    private dialog: MatDialogRef<CreateEditLabelDialogComponent, Label>,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: CreateEditLabelDialogData,
    private notify: UserNotifyService
  ) {}

  ngOnInit() {
    if (this.data.editExisting) {
      this.componentList = {
        node: this.data.editExisting,
        type: ListType.Components,
      };

      this.loading = true;
      const node = this.dataService.getNode<Label>(this.data.editExisting);
      // reload data from source
      node.invalidate();
      node.load();
      node
        .dataAsPromise()
        .then((data) => {
          this.validationLabelName.setValue(data.name);
          this.color = data.color;
          this.validationLabelDescription.setValue(data.description);
        })
        .catch((error) => {
          this.notify.notifyError('Could not load label data for editing');
          this.dialog.close(null);
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      this.randomizeColor();

      if (this.data.issueId) {
        this.componentList = this.data.issueId;
      }
    }

    this.allComponentsList = {
      node: this.data.projectId,
      type: ListType.Components,
    };
  }

  /** @ignore used for set editor */
  makeComponentFilter(search): ComponentFilter {
    return { name: search };
  }
  /** @ignore used for set editor */
  applyComponentChangeset = async (
    additions: NodeId[],
    deletions: NodeId[]
  ) => {
    if (Array.isArray(this.componentList)) {
      const keySet = new Set(this.componentList.map((id) => encodeNodeId(id)));
      for (const item of additions) {
        if (!keySet.has(encodeNodeId(item))) {
          this.componentList.push(item);
          keySet.add(encodeNodeId(item));
        }
      }
      for (const item of deletions) {
        if (keySet.has(encodeNodeId(item))) {
          this.componentList.splice(this.componentList.indexOf(item), 1);
          keySet.delete(encodeNodeId(item));
        }
      }
    } else {
      for (const item of additions) {
        await this.dataService.mutations.addLabelToComponent(
          Math.random().toString(),
          this.data.editExisting,
          item
        );
      }
      for (const item of deletions) {
        await this.dataService.mutations.removeLabelFromComponent(
          Math.random().toString(),
          this.data.editExisting,
          item
        );
      }
    }
  };

  /** When the user cancels label creation or editing, close and return with null. */
  onLabelCancelClick(): void {
    this.dialog.close(null);
  }

  /** When the user confirms their changes, attempt to mutate and return with the label data. */
  onConfirmClick(name: string, description?: string) {
    this.loading = true;

    if (this.data.editExisting) {
      this.dataService.mutations
        .updateLabel(
          Math.random().toString(),
          this.data.editExisting,
          name,
          this.color,
          description
        )
        .then(() => {
          this.dialog.close({
            id: this.data.editExisting.id,
            name,
            color: this.color,
            description,
          } as Label);
        })
        .catch((error) => {
          this.notify.notifyError('Failed to update label!', error);
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      this.dataService.mutations
        .createLabel(
          Math.random().toString(),
          this.componentList as NodeId[],
          name,
          this.color,
          description
        )
        .then((created) => {
          this.dialog.close(created as Label);
        })
        .catch((error) => {
          this.notify.notifyError('Failed to create label!', error);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  /** Randomizes the label color. */
  randomizeColor(): void {
    const r = ('00' + (Math.random() * 0xff).toString(16)).slice(-2);
    const g = ('00' + (Math.random() * 0xff).toString(16)).slice(-2);
    const b = ('00' + (Math.random() * 0xff).toString(16)).slice(-2);

    this.color = '#' + r + g + b;
  }
}
