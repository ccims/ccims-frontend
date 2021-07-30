import {Component, OnInit} from '@angular/core';
import {ConnectedPosition, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

@Component({
  styleUrls: ['component-context-menu.component.scss'],
  templateUrl: './component-context-menu.component.html'
})
export class ComponentContextMenuComponent {
  private ref: OverlayRef;
  private pos: ConnectedPosition;

  constructor() {
  }

  static open(parent: Element, overlay: Overlay, x: number, y: number): ComponentContextMenuComponent {
    const position = overlay.position().flexibleConnectedTo(parent);
    const pos: ConnectedPosition = {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: x,
      offsetY: y
    };
    position.withPositions([pos]);

    const ref = overlay.create({
      minWidth: 400,
      minHeight: 200,
      positionStrategy: position
    });

    const inst = ref.attach(new ComponentPortal(ComponentContextMenuComponent)).instance;
    inst.ref = ref;
    inst.pos = pos;
    return inst;
  }

  updatePosition(x: number, y: number): void {
    this.pos.offsetX = x;
    this.pos.offsetY = y;
    this.ref.getConfig().positionStrategy.apply();
  }

  close(): void {
    this.ref.dispose();
  }
}
