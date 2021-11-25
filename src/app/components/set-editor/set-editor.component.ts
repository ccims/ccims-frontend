import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
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
 * The set editor displays and edits a list of items (used in the issue detail sidebar).
 *
 * - The list of selected items {@link listSet} may be either a local array of IDs or a {@link ListId}.
 * - When editing, items may be selected from a list of all available items {@link #listAll}.
 * - The list of items may be searched using a search box ({@link #makeFilter} and {@link #scoreKeys}).
 * - Upon closing the edit dialog, a changeset of additions and deletions is passed to a callback ({@link #applyChangeset}).
 */
@Component({
  selector: 'app-set-editor',
  templateUrl: './set-editor.component.html',
  styleUrls: ['./set-editor.component.scss']
})
export class SetEditorComponent<T extends { id: string; __typename: string }, F> implements OnInit, OnChanges, OnDestroy {
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
  /** Pass a HydrateList object to load the listSet with existing data instead of sending a request to the server. */
  @Input() hydrate: Promise<HydrateList<T>>;
  /** Additional operations available from the set editor. */
  @Input() itemOps: ItemOps = 'none';

  /** Callback to create a new item (enabled using itemOps). If the promise returns a node ID, it will be added to the set. */
  @Input() createItem: () => Promise<NodeId | null | undefined>;
  /** Callback to edit an item. */
  @Output() editItem = new EventEmitter<{ id: NodeId; preview: T }>();
  /** Callback to delete an item. */
  @Output() deleteItem = new EventEmitter<{ id: NodeId; preview: T }>();

  /**
   * @ignore
   * Pointer to the title text element. Used to read the title, because we can't read angular components directly.
   */
  @ViewChild('titleText') titleText: ElementRef<HTMLElement>;
  /**
   * @ignore
   * Pointer to the *appItem directive. Used to instantiate list items.
   */
  @ContentChild(ItemDirective, { read: TemplateRef }) itemTemplate;

  /**
   * @ignore
   * List that fetches the first few items of the list of items in the set.
   */
  public listSet$: DataList<T, unknown>;
  /**
   * @ignore
   * The subscription to listSet$.
   */
  private listSetSub: Subscription;

  /**
   * @ignore
   * If true, the listSet$ variable is null and listSet contains an array of node IDs.
   */
  public isLocalSet = false;

  constructor(private dataService: DataService, private dialogService: MatDialog) {}

  /**
   * @ignore
   * Internal: (re-)loads the subscription to whatever the user put in listSet.
   */
  private reloadListSet() {
    if (Array.isArray(this.listSet)) {
      this.isLocalSet = true;
      if (this.listSet$) {
        this.listSetSub.unsubscribe();
        this.listSet$ = null;
      }
    } else {
      this.isLocalSet = false;
      this.listSetSub?.unsubscribe();
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

  /**
   * Returns the number of selected items.
   *
   * May be NaN if it hasn't been loaded yet.
   */
  get totalCount(): number {
    if (this.isLocalSet) {
      return (this.listSet as NodeId[]).length;
    } else {
      if (this.listSet$.loading) {
        return NaN;
      }
      return this.listSet$.totalCount;
    }
  }

  // Callbacks for the set editor dialog.
  // They all forward to the user-provided function.
  // We do not pass the user-provided function directly because they may change while the dialog is open.
  /** @ignore */
  private onDialogApplyChangeset = (additions: NodeId[], deletions: NodeId[]): Promise<void> => {
    return this.applyChangeset(additions, deletions);
  };
  /** @ignore */
  private onDialogCreateItem = () => this.createItem();
  /** @ignore */
  private onDialogEditItem = (item) => this.editItem.emit(item);
  /** @ignore */
  private onDialogDeleteItem = (item) => this.deleteItem.emit(item);

  /**
   * @internal
   * Opens the editor dialog.
   */
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
