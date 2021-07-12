import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LabelStoreService} from '@app/data/label/label-store.service';
import {GetComponentQuery, Label} from '../../generated/graphql';
import {ComponentStoreService} from '@app/data/component/component-store.service';
import {NgSelectComponent} from '@ng-select/ng-select';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {CreateLabelDialogComponent} from '@app/dialogs/create-label-dialog/create-label-dialog.component';
import {MatDialog, MatDialogRef, MatDialogState} from '@angular/material/dialog';

@Component({
  selector: 'app-label-selector-component',
  templateUrl: './label-selector.component.html',
  styleUrls: ['./label-selector.component.scss']
})
export class LabelSelectorComponent implements OnInit {
  @Input() componentId: string;
  @Input() selectedLabels: Array<string> = [];
  @ViewChild('labelName') nameInput: ElementRef;
  @ViewChild('labelDescription') descriptionInput: ElementRef;
  @ViewChild('labelSelector') labelSelector: NgSelectComponent;

  component: GetComponentQuery;
  componentLabels = [];
  dialogRef: MatDialogRef<CreateLabelDialogComponent, Label>;
  loading = true;
  error = false;

  constructor(public labelStore: LabelStoreService,
              private componentStoreService: ComponentStoreService,
              private notify: UserNotifyService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.componentStoreService.getFullComponent(this.componentId).subscribe(component => {
      this.component = component;
      this.componentLabels = component.node.labels.nodes;
      this.loading = false;
    }, error => {
      this.notify.notifyError('Failed to get component labels!', error);
      this.loading = false;
      this.error = true;
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
    this.dialogRef = this.dialog.open(CreateLabelDialogComponent, {data: {componentId: this.componentId}});
    this.dialogRef.afterClosed().subscribe((created: Label) => {
        if (created) {
          this.componentLabels.push(created);
          this.labelSelector.select({value: created.id});
        }
      }
    );
  }
}
