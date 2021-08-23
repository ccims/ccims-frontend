import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListId, NodeId } from '@app/data-dgql/id';
import { DataList } from '@app/data-dgql/query';
import { Subscription } from 'rxjs';
import DataService from '@app/data-dgql';

export interface SetEditorDialogData {
  listSet: ListId;
  listAll: ListId;
  add: (ids: NodeId[]) => Promise<void>;
  remove: (ids: NodeId[]) => Promise<void>;
  itemTemplate: TemplateRef<unknown>;
}

@Component({
  selector: 'app-set-editor-dialog',
  templateUrl: './set-editor-dialog.component.html'
})
export class SetEditorDialogComponent<T> implements OnInit, OnDestroy {
  public listSet$: DataList<T, unknown>;
  public listAll$: DataList<T, unknown>;
  private listSetSub: Subscription;
  private listAllSub: Subscription;

  constructor(
    private dataService: DataService,
    private dialogRef: MatDialogRef<SetEditorDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: SetEditorDialogData
  ) {
  }

  ngOnInit() {
    this.listSet$ = this.dataService.getList(this.data.listSet);
    this.listAll$ = this.dataService.getList(this.data.listAll);
    this.listSetSub = this.listSet$.subscribe();
    this.listAllSub = this.listAll$.subscribe();
  }

  ngOnDestroy() {
    this.listSetSub?.unsubscribe();
    this.listAllSub?.unsubscribe();
  }
}
