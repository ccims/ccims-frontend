import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { encodeNodeId, ListId, NodeId, nodeTypeFromTypename } from '@app/data-dgql/id';
import { DataList } from '@app/data-dgql/query';
import { Subscription } from 'rxjs';
import DataService from '@app/data-dgql';
import { UserNotifyService } from '@app/user-notify/user-notify.service';
import { quickScore } from 'quick-score';

/** This interface is used to source items from multiple sources in the set editor. */
export interface SetMultiSource {
  /** A static list of source lists. */
  staticSources: ListId[];
  /** A list of nodes that will be passed to listFromNode. */
  sourceNodes?: ListId | NodeId[];
  /** Maps nodes from sourceNodes to lists from which items will be sourced. */
  listFromNode?: (n: NodeId) => ListId;
}

/**
 * This is an internal component used to load data from multiple sources and through a layer of indirection (also see SetMultiSource).
 */
class MultiSourceList<T, F> {
  public sourceNodeList?: DataList<{ __typename: string }, unknown>;
  public sourceNodeListSub?: Subscription;
  public staticSourceNodeList?: NodeId[];
  public sources: Map<string, DataList<T, F>> = new Map();
  public sourceSubs: Map<string, Subscription> = new Map();
  public limit = 10;
  public results?: T[];
  public hasMore = false;
  public query = '';

  constructor(public spec: SetMultiSource, public scoreKeys: string[], private dataService: DataService) {
    if (typeof spec.sourceNodes === 'string') {
      this.sourceNodeList = dataService.getList(spec.sourceNodes);
      this.sourceNodeListSub = this.sourceNodeList.subscribe(() => this.update());
    } else if (Array.isArray(spec.sourceNodes)) {
      this.staticSourceNodeList = spec.sourceNodes;
    }
    this.update();
  }

  static fromSingleList<T, F>(list: ListId, scoreKeys: string[], dataService: DataService) {
    return new this<T, F>({ staticSources: [list] }, scoreKeys, dataService);
  }

  update() {
    const newSourceSet = new Set<ListId>();
    for (const [id, node] of this.sourceNodeList?.current?.entries() || []) {
      const nodeId = encodeNodeId({ type: nodeTypeFromTypename(node.__typename), id });
      newSourceSet.add(this.spec.listFromNode(nodeId));
    }
    for (const nodeId of this.staticSourceNodeList || []) {
      newSourceSet.add(this.spec.listFromNode(nodeId));
    }
    for (const source of this.spec.staticSources) {
      newSourceSet.add(source);
    }

    for (const source of newSourceSet) {
      if (!this.sources.has(source)) {
        const list = this.dataService.getList<T, F>(source);
        list.interactive = true;
        this.sources.set(source, list);
        this.sourceSubs.set(source, list.subscribe(() => this.updateResults()));
      }
    }
    for (const source of [...this.sources.keys()]) {
      if (!newSourceSet.has(source)) {
        this.sourceSubs.get(source).unsubscribe();
        this.sourceSubs.delete(source);
        this.sources.delete(source);
      }
    }
  }

  setFilter(query: string, filter: F) {
    this.query = query;
    for (const source of this.sources.values()) {
      source.filter = filter;
    }
  }

  score(item: T) {
    const matchStrings = [];
    for (const key of this.scoreKeys) {
      let cursor = item;
      for (const objKey of key.split('.')) {
        cursor = cursor[objKey];
        if (!cursor) {
          break;
        }
      }
      if (cursor) {
        matchStrings.push(cursor);
      }
    }

    return quickScore(matchStrings.join(' '), this.query);
  }

  updateResults() {
    const seenItems = new Set();
    const items = [];
    this.hasMore = false;
    for (const source of this.sources.values()) {
      if (!source.hasData) {
        continue;
      }
      for (const [id, item] of source.current.entries()) {
        if (!seenItems.has(id)) {
          seenItems.add(id);
          items.push(item);
        }
      }
      this.hasMore = this.hasMore || (source.current.size < source.totalCount);
    }

    items.sort((a, b) => this.score(a) - this.score(b));
    items.splice(this.limit);

    this.results = items;
  }

  isLoading() {
    if (this.sourceNodeList?.loading) {
      return true;
    }
    for (const source of this.sources.values()) {
      if (source.loading) {
        return true;
      }
    }

    return false;
  }

  unsubscribe() {
    this.sourceNodeListSub?.unsubscribe();
    this.sourceSubs.forEach(sub => sub.unsubscribe());
  }
}

export type ItemOps = 'none' | 'edit' | 'create-edit' | 'create-edit-delete';

export interface SetEditorDialogData<T, F> {
  title: string;
  listSet: ListId | string[];
  listAll: ListId | SetMultiSource;
  applyChangeset: (add: NodeId[], del: NodeId[]) => Promise<void>;
  itemTemplate: TemplateRef<unknown>;
  makeFilter: (query: string) => F;
  scoreKeys: string[];
  emptySuggestionsLabel: string;
  emptyResultsLabel: string;
  createItem?: () => Promise<NodeId | null | undefined>;
  editItem?: ({ id: NodeId, preview: T }) => void;
  deleteItem?: ({ id: NodeId, preview: T }) => void;
}

@Component({
  selector: 'app-set-editor-dialog',
  templateUrl: './set-editor-dialog.component.html',
  styleUrls: ['./set-editor-dialog.component.scss']
})
export class SetEditorDialogComponent<T extends { id: string, __typename: string }, F> implements OnInit, OnDestroy {
  public isLocalSet = false;
  public localSet = [];
  public listSet$: DataList<T, F>;
  public listAll: MultiSourceList<T, F>;
  private listSetSub: Subscription;
  private additions: Set<NodeId> = new Set();
  private deletions: Set<NodeId> = new Set();
  public searchQuery = '';

  constructor(
    private dataService: DataService,
    private notifyService: UserNotifyService,
    private dialogRef: MatDialogRef<SetEditorDialogComponent<T, F>>,
    @Inject(MAT_DIALOG_DATA) public data: SetEditorDialogData<T, F>
  ) {}

  ngOnInit() {
    if (Array.isArray(this.data.listSet)) {
      this.isLocalSet = true;
      this.localSet = [...this.data.listSet];
    } else {
      this.listSet$ = this.dataService.getList(this.data.listSet);
    }
    this.listAll = typeof this.data.listAll === 'string'
      ? MultiSourceList.fromSingleList<T, F>(this.data.listAll, this.data.scoreKeys, this.dataService)
      : new MultiSourceList<T, F>(this.data.listAll, this.data.scoreKeys, this.dataService);

    if (this.listSet$) {
      this.listSetSub = this.listSet$?.subscribe();
      // TODO: is this a reasonable heuristic for the listSet count? we need to cover >= results from listAll
      this.listSet$.count = 10;
      this.listSet$.interactive = true;
    }
  }

  searchQueryDidChange() {
    if (this.listSet$) {
      this.listSet$.filter = this.data.makeFilter(this.searchQuery);
    }
    this.listAll.setFilter(this.searchQuery, this.data.makeFilter(this.searchQuery));
  }

  getNodeId(item) {
    const type = nodeTypeFromTypename(item.__typename);
    return encodeNodeId({ type, id: item.id });
  }

  isInSet(item): boolean {
    const id = this.getNodeId(item);
    if (this.additions.has(id)) {
      return true;
    }
    if (this.deletions.has(id)) {
      return false;
    }
    if (this.isLocalSet) {
      return this.localSet.includes(id);
    }
    return this.listSet$.current?.has(item.id) || false;
  }

  toggleInSet(item): void {
    const id = this.getNodeId(item);
    if (this.isInSet(item)) {
      this.additions.delete(id);
      this.deletions.add(id);
    } else {
      this.deletions.delete(id);
      this.additions.add(id);
    }
  }

  apply() {
    if (this.additions.size + this.deletions.size === 0) {
      this.dialogRef.close(null);
      return;
    }

    this.data.applyChangeset([...this.additions], [...this.deletions]).then(() => {
      this.dialogRef.close(null);
    }).catch(error => {
      this.notifyService.notifyError('Failed to apply changes', error);
    });
  }

  createItem() {
    this.data.createItem().then(node => {
      if (node) {
        this.additions.add(node);
      }
    });
  }

  ngOnDestroy() {
    this.listSetSub?.unsubscribe();
    this.listAll.unsubscribe();
  }
}
