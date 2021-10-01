import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {CreateLabelMutation, GetComponentQuery} from '../../generated/graphql';
import {NgSelectComponent} from '@ng-select/ng-select';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {CreateEditLabelDialogComponent} from '@app/dialogs/create-label-dialog/create-edit-label-dialog.component';
import {MatDialog, MatDialogRef, MatDialogState} from '@angular/material/dialog';
import {QueryComponent} from '@app/utils/query-component/query.component';
import DataService from '@app/data-dgql';
import {encodeListId, ListType, NodeType} from '@app/data-dgql/id';
import {Label} from '../../generated/graphql-dgql';

@Component({
  selector: 'app-label-selector-component',
  templateUrl: './label-selector.component.html',
  styleUrls: ['./label-selector.component.scss']
})
export class LabelSelectorComponent implements AfterViewInit {
  @Input() componentId: string;
  @Input() selectedLabels: Array<string> = [];
  @ViewChild(QueryComponent) query: QueryComponent;
  @ViewChild('labelName') nameInput: ElementRef;
  @ViewChild('labelDescription') descriptionInput: ElementRef;
  @ViewChild('labelSelector') labelSelector: NgSelectComponent;

  component: GetComponentQuery;
  componentLabels: Array<Label> = [];
  dialogRef: MatDialogRef<CreateEditLabelDialogComponent, CreateLabelMutation>;

  constructor(private dataService: DataService,
              private notify: UserNotifyService,
              private dialog: MatDialog) {
  }

  ngAfterViewInit() {
    const dataList = this.dataService.getList(encodeListId({
      type: ListType.Labels,
      node: {type: NodeType.Component, id: this.componentId}
    }));
    this.query.listenTo(dataList).subscribe(labels => {
      for (const label of labels.values()) {
        this.componentLabels.push(label as Label);
      }
    });
  }

  closeDialog(): void {
    if (this.isDialogOpen()) {
      this.dialogRef.close(null);
    }
  }

  isDialogOpen(): boolean {
    if (this.dialogRef) {
      return this.dialogRef.getState() === MatDialogState.OPEN;
    } else {
      return false;
    }
  }

  onNewLabelClick(): void {
    this.dialogRef = this.dialog.open(CreateEditLabelDialogComponent, {data: {componentId: this.componentId}});
    this.dialogRef.afterClosed().subscribe((created) => {
        if (created) {
          this.componentLabels.push(created.createLabel.label as Label);
          this.labelSelector.select({value: created.createLabel.label.id});
        }
      }
    );
  }
}
