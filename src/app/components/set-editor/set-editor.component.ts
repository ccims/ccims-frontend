import {
  Component,
  ContentChild,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ListId, NodeId } from '@app/data-dgql/id';
import { DataList, HydrateList } from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import { Subscription } from 'rxjs';
import { ItemDirective } from '@app/components/item.directive';
import { MatDialog } from '@angular/material/dialog';
import { SetEditorDialogComponent, SetEditorDialogData, SetMultiSource } from './set-editor-dialog.component';

type ItemOps = 'none' | 'edit' | 'create-edit' | 'create-edit-delete';

/**
 * The set editor displays and edits a list like in the issue detail sidebar.
 */
@Component({
  selector: 'app-set-editor',
  templateUrl: './set-editor.component.html',
  styleUrls: ['./set-editor.component.scss']
})
export class SetEditorComponent<T extends { id: string, __typename: string }, F> implements OnInit, OnChanges, OnDestroy {
  /** Pass a HydrateList object to load the listSet with existing data instead of sending a request to the server. */
  @Input() hydrate: Promise<HydrateList<T>>;
  /** The list that contains all nodes that are part of the set. string[] is treated as local state. */
  @Input() listSet: ListId | NodeId[];
  /** The list of all possible items. Should be a superset of listSet, as otherwise the user may not be able to deselect items. */
  @Input() listAll: ListId | SetMultiSource;
  /** Callback for applying a changeset to the listSet. */
  @Input() applyChangeset: (additions: NodeId[], deletions: NodeId[]) => Promise<void>;
  /** Callback for making a filter for the given search query. */
  @Input() makeFilter: (searchQuery: string) => F;
  /** Object keys used for scoring a search result. (e.g. 'title') Should correspond to fields searched in makeFilter. */
  @Input() scoreKeys: string[];
  /** Set editable to false to just display items in the set, without being able to edit them. */
  @Input() editable = true;
  /** Set to override the “no results” text in the dialog. Appears only when there is no search query. */
  @Input() emptySuggestionsLabel = 'No suggestions';
  /** Set to override the “no results” text in the dialog. Appears when there is a search query. */
  @Input() emptyResultsLabel = 'No results';
  /** Additional operations available from the set editor. */
  @Input() itemOps: ItemOps = 'none';

  @Input() createItem: () => Promise<NodeId | null | undefined>;
  @Output() editItem = new EventEmitter<{ id: NodeId, preview: T }>();
  @Output() deleteItem = new EventEmitter<{ id: NodeId, preview: T }>();

  @ViewChild('titleText') titleText: ElementRef<HTMLElement>;
  @ContentChild(ItemDirective, { read: TemplateRef }) itemTemplate;

  public listSet$: DataList<T, unknown>;
  public isLocalSet = false;
  private listSetSub: Subscription;

  constructor(
    private dataService: DataService,
    private dialogService: MatDialog
  ) {}

  reloadListSet() {
    if (Array.isArray(this.listSet)) {
      this.isLocalSet = true;
      if (this.listSet$) {
        this.listSetSub.unsubscribe();
        this.listSet$ = null;
      }
    } else {
      this.isLocalSet = false;
      this.listSet$ = this.dataService.getList(this.listSet);
      this.listSetSub = this.listSet$.subscribe();
    }
  }

  ngOnInit() {
    this.reloadListSet();
    if (this.hydrate && this.listSet$) {
      this.listSet$.hydrateInitial(this.hydrate);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.listSet) {
      const newValue = changes.listSet.currentValue;
      if (this.isLocalSet !== (typeof newValue !== 'string')) {
        this.reloadListSet();
      }
    }
  }

  ngOnDestroy() {
    this.listSetSub?.unsubscribe();
  }

  /** This method is needed to satisfy static type checking bounds */
  getListSetLength(): number {
    if (this.isLocalSet) {
      return (this.listSet as NodeId[]).length;
    }
    throw new Error('bad state');
  }

  private onDialogApplyChangeset = (additions: NodeId[], deletions: NodeId[]): Promise<void> => {
    return this.applyChangeset(additions, deletions);
  }

  private onDialogCreateItem = () => this.createItem();
  private onDialogEditItem = (item) => this.editItem.emit(item);
  private onDialogDeleteItem = (item) => this.deleteItem.emit(item);

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
        scoreKeys: this.scoreKeys,
        emptySuggestionsLabel: this.emptySuggestionsLabel,
        emptyResultsLabel: this.emptyResultsLabel,
        createItem: this.itemOps.includes('create') ? this.onDialogCreateItem : null,
        editItem: this.itemOps.includes('edit') ? this.onDialogEditItem : null,
        deleteItem: this.itemOps.includes('delete') ? this.onDialogDeleteItem : null
      } as SetEditorDialogData<T, F>
    });
  }
}
