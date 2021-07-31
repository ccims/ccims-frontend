import {Component, Inject, Injectable, InjectionToken, Injector} from '@angular/core';
import {ConnectedPosition, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';

export enum ComponentContextMenuType{
  Component,
  Interface
}

export interface ComponentContextMenuData {
  overlayRef: OverlayRef;
  position: ConnectedPosition;
  nodeId: string;
  type: ComponentContextMenuType;
}

export const COMPONENT_CONTEXT_MENU_DATA = new InjectionToken<ComponentContextMenuData>('COMPONENT_CONTEXT_MENU_DATA');

@Injectable({providedIn: 'root'})
export class ComponentContextMenuService {
  constructor(private overlay: Overlay, private injector: Injector) {
  }

  open(parent: Element, x: number, y: number, componentId: string, componentType: ComponentContextMenuType): ComponentContextMenuComponent {
    const position = this.overlay.position().flexibleConnectedTo(parent);
    const pos: ConnectedPosition = {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: x,
      offsetY: y
    };
    position.withPositions([pos]);

    const ref = this.overlay.create({
      minWidth: 400,
      minHeight: 200,
      positionStrategy: position
    });

    const map = new WeakMap();
    map.set(COMPONENT_CONTEXT_MENU_DATA, {overlayRef: ref, position: pos, id: componentId, type: componentType});
    const injector = new PortalInjector(this.injector, map);
    return ref.attach(new ComponentPortal(ComponentContextMenuComponent, null, injector)).instance;
  }
}

@Component({
  styleUrls: ['component-context-menu.component.scss'],
  templateUrl: './component-context-menu.component.html'
})
export class ComponentContextMenuComponent {
  constructor(@Inject(COMPONENT_CONTEXT_MENU_DATA) private data: ComponentContextMenuData) {
  }

  updatePosition(x: number, y: number): void {
    this.data.position.offsetX = x;
    this.data.position.offsetY = y;
    this.data.overlayRef.getConfig().positionStrategy.apply();
  }

  close(): void {
    this.data.overlayRef.dispose();
  }
}
