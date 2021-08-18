import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LabelStoreService} from '@app/data/label/label-store.service';
import {CreateLabelMutation, GetComponentQuery} from '../../generated/graphql';
import {ComponentStoreService} from '@app/data/component/component-store.service';
import {NgSelectComponent} from '@ng-select/ng-select';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {CreateLabelDialogComponent} from '@app/dialogs/create-label-dialog/create-label-dialog.component';
import {MatDialog, MatDialogRef, MatDialogState} from '@angular/material/dialog';
import {QueryComponent} from '@app/utils/query-component/query.component';

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
  componentLabels = [];
  dialogRef: MatDialogRef<CreateLabelDialogComponent, CreateLabelMutation>;

  constructor(public labelStore: LabelStoreService,
              private componentStoreService: ComponentStoreService,
              private notify: UserNotifyService,
              private dialog: MatDialog) {
  }

  ngAfterViewInit() {
    this.query.listenTo(this.componentStoreService.getComponentLabels(this.componentId)).subscribe(labels => {
      this.componentLabels = labels.node.labels.nodes;
    }, error => this.notify.notifyError('Failed to get component labels!', error));
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
    this.dialogRef = this.dialog.open(CreateLabelDialogComponent, {data: {componentId: this.componentId}});
    this.dialogRef.afterClosed().subscribe((created) => {
        if (created) {
          this.componentLabels.push(created.createLabel.label);
          this.labelSelector.select({value: created.createLabel.label.id});
        }
      }
    );
  }
}
