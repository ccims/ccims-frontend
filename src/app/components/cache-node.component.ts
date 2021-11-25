import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ItemDirective } from '@app/components/item.directive';
import DataService from '@app/data-dgql';
import { NodeId } from '@app/data-dgql/id';
import { DataNode } from '@app/data-dgql/query';
import { Subscription } from 'rxjs';

/**
 * Loads data for a node from the cache or from the API.
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[cache-node]',
  template:
    '<ng-container *ngIf="node$.hasData"><ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: node$.current }"></ng-container></ng-container>'
})
export class CacheNodeComponent implements OnInit, OnDestroy {
  /** The node that will be loaded. */
  @Input() node: NodeId;
  /** If true, this component will subscribe to the node lazily (i.e. it will not fetch new data if data is cached already) */
  @Input() lazy = true;
  @ContentChild(ItemDirective, { read: TemplateRef }) itemTemplate;

  node$: DataNode<unknown>;
  nodeSub: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.node$ = this.dataService.getNode(this.node);
    this.nodeSub = this.lazy ? this.node$.subscribeLazy() : this.node$.subscribe();
  }
  ngOnDestroy() {
    this.nodeSub.unsubscribe();
  }
}
