import { Component, ContentChild, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { encodeNodeId, ListId, NodeId, NodeType } from '@app/data-dgql/id';
import { DataList, HydrateList } from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import { Subscription } from 'rxjs';
import { ItemDirective } from '@app/components/item.directive';
import { MatDialog } from '@angular/material/dialog';
import { SetEditorDialogComponent, SetEditorDialogData, SetMultiSource } from './set-editor-dialog.component';

// TODO: concat labels from multiple components
// --> show first n items ("relevance"?) (not available for users!!); search for everything else

// --> have a ui thats like
// 1. COMPONENT
//       LOCATIONS
//       LABELS
// 2. COMPONENT
//       LOCATIONS
//       LABELS
// ???
//
// or instead dynamically source stuff from lists. doesnt matter anyway. were only showing a search box

@Component({
  selector: 'app-set-editor',
  templateUrl: './set-editor.component.html',
  styleUrls: ['./set-editor.component.scss']
})
export class SetEditorComponent<T extends { id: string, __typename: string }, F> implements OnInit, OnDestroy {
  /** Pass a HydrateList object to load the listSet with existing data instead of sending a request to the server. */
  @Input() hydrate: Promise<HydrateList<T>>;
  /** NodeType displayed in this set. */
  @Input() nodeType: keyof NodeType; // FIXME: don't ask for node type
  /** The list that contains all nodes that are part of the set. */
  @Input() listSet: ListId;
  /** The list of all possible items. Should be a superset of listSet, as otherwise the user may not be able to deselect items. */
  @Input() listAll: ListId | SetMultiSource;
  /** Callback for applying a changeset to the listSet. */
  @Input() applyChangeset: (additions: NodeId[], deletions: NodeId[]) => Promise<void>;
  /** Callback for making a filter for the given search query. */
  @Input() makeFilter: (searchQuery: string) => F;
  /** Callback for scoring a search result for relevance. */
  @Input() score: (searchQuery: string, item: T) => number;
  /** Set editable to false to just display items in the set, without being able to edit them. */
  @Input() editable = true;

  @ViewChild('titleText') titleText: ElementRef<HTMLElement>;
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
      this.listSet$.hydrateInitial(this.hydrate);
    }
    this.listSetSub = this.listSet$.subscribe();
  }
  ngOnDestroy() {
    this.listSetSub.unsubscribe();
  }

  private onDialogApplyChangeset = (additions: string[], deletions: string[]) => {
    const add = additions.map(id => encodeNodeId({ type: NodeType[this.nodeType], id }));
    const del = deletions.map(id => encodeNodeId({ type: NodeType[this.nodeType], id }));
    return this.applyChangeset(add, del);
  }

  beginEditing() {
    this.dialogService.open<SetEditorDialogComponent<T, F>>(SetEditorDialogComponent, {
      width: '400px',
      data: {
        title: this.titleText?.nativeElement.textContent || '',
        listSet: this.listSet,
        listAll: this.listAll,
        itemTemplate: this.itemTemplate,
        applyChangeset: this.onDialogApplyChangeset,
        makeFilter: this.makeFilter,
        score: this.score
      } as SetEditorDialogData<T, F>
    });
  }
}
