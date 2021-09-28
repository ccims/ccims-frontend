import { Component, ContentChild, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ItemDirective } from '@app/components/item.directive';
import DataService from '@app/data-dgql';
import { NodeId } from '@app/data-dgql/id';
import { DataNode } from '@app/data-dgql/query';
import { Subscription } from 'rxjs';

/**
 * Loads data for a node from the cache.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: '[cache-node]',
  template: '<ng-container *ngIf="node$.hasData"><ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: node$.current }"></ng-container></ng-container>'
})
export class CacheNodeComponent implements OnInit, OnDestroy {
  @Input() node: NodeId;
  @ContentChild(ItemDirective, { read: TemplateRef }) itemTemplate;

  node$: DataNode<unknown>;
  nodeSub: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // TODO: make lazy
    this.node$ = this.dataService.getNode(this.node);
    this.nodeSub = this.node$.subscribe();
  }
  ngOnDestroy() {
    this.nodeSub.unsubscribe();
  }
}
