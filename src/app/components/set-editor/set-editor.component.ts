import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ListId, NodeId, NodeType } from '@app/data-dgql/id';
import { DataList, HydrateList } from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import { Subscription } from 'rxjs';
import { ItemDirective } from '@app/components/item.directive';
import { MatDialog } from '@angular/material/dialog';
import { SetEditorDialogComponent, SetEditorDialogData } from './set-editor-dialog.component';

@Component({
  selector: 'app-set-editor',
  templateUrl: './set-editor.component.html',
  styleUrls: ['./set-editor.component.scss']
})
export class SetEditorComponent<T extends { id: string }> implements OnInit, OnDestroy {
  @Input() hydrate: Promise<HydrateList<T>>;
  @Input() nodeType: NodeType;
  @Input() listSet: ListId;
  @Input() listAll: ListId;
  @Input() add: (ids: NodeId[]) => Promise<void>;
  @Input() remove: (ids: NodeId[]) => Promise<void>;
  @Input() editable = true;

  @ContentChild(ItemDirective, { read: TemplateRef }) itemTemplate;

  public listSet$: DataList<T, unknown>;
  private listSetSub: Subscription;

  constructor(
    private dataService: DataService,
    private dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.listSet$ = this.dataService.getList(this.listSet);
    if (this.hydrate) {
      this.listSet$.hydrateInitial(this.nodeType, this.hydrate);
    }
    this.listSetSub = this.listSet$.subscribe();
  }
  ngOnDestroy() {
    this.listSetSub.unsubscribe();
  }

  beginEditing() {
    const dialog = this.dialogService.open<SetEditorDialogComponent<T>>(SetEditorDialogComponent, {
      width: '400px',
      data: {
        listSet: this.listSet,
        listAll: this.listAll,
        add: this.add,
        remove: this.remove,
        itemTemplate: this.itemTemplate
      } as SetEditorDialogData
    });
  }
}
