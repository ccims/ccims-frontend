import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {ConnectedPosition, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {IssueGraphComponent} from '@app/graphs/issue-graph/issue-graph.component';
import {NodeDetailsComponent, NodeDetailsType} from '@app/node-details/node-details.component';

export interface ComponentContextMenuData {
  overlayRef: OverlayRef;
  position: ConnectedPosition;
  nodeId: string;
  type: NodeDetailsType;
  graph: IssueGraphComponent;
}

export const COMPONENT_CONTEXT_MENU_DATA = new InjectionToken<ComponentContextMenuData>('COMPONENT_CONTEXT_MENU_DATA');

@Injectable({providedIn: 'root'})
export class ComponentContextMenuService {
  constructor(private overlay: Overlay, private injector: Injector) {
  }

  open(parent: Element,
       x: number, y: number,
       componentId: string,
       componentType: NodeDetailsType,
       issueGraph: IssueGraphComponent): ComponentContextMenuComponent {
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
    map.set(COMPONENT_CONTEXT_MENU_DATA, {
      overlayRef: ref,
      position: pos,
      nodeId: componentId,
      type: componentType,
      graph: issueGraph
    });
    const injector = new PortalInjector(this.injector, map);
    return ref.attach(new ComponentPortal(ComponentContextMenuComponent, null, injector)).instance;
  }
}

@Component({
  styleUrls: ['component-context-menu.component.scss'],
  templateUrl: './component-context-menu.component.html'
})
export class ComponentContextMenuComponent implements AfterViewInit, OnDestroy {
  private static MIN_WIDTH = 700;
  private static MIN_HEIGHT = 400;
  private static LAST_WIDTH = ComponentContextMenuComponent.MIN_WIDTH;
  private static LAST_HEIGHT = ComponentContextMenuComponent.MIN_HEIGHT;

  width = ComponentContextMenuComponent.LAST_WIDTH;
  height = ComponentContextMenuComponent.LAST_HEIGHT;
  private resize = false;
  nodeDetailsReady: boolean;

  @ViewChild('frame') frame: ElementRef;
  @ViewChild('resizeCorner') set resizeCorner(content: ElementRef) {
    if (content) {
      content.nativeElement.addEventListener('mousedown', () => this.resize = true);
    }
  }
  @ViewChild(NodeDetailsComponent) nodeDetails: NodeDetailsComponent;

  constructor(@Inject(COMPONENT_CONTEXT_MENU_DATA) public data: ComponentContextMenuData,
              private changeDetector: ChangeDetectorRef) {
  }

  updatePosition(x: number, y: number): void {
    this.data.position.offsetX = x;
    this.data.position.offsetY = y;
    this.data.overlayRef.getConfig().positionStrategy.apply();
  }

  close(): void {
    this.data.overlayRef.dispose();
  }

  ngAfterViewInit() {
    this.frame.nativeElement.style.minWidth = ComponentContextMenuComponent.MIN_WIDTH + 'px';
    this.frame.nativeElement.style.minHeight = ComponentContextMenuComponent.MIN_HEIGHT + 'px';
    this.nodeDetailsReady = true;
    this.changeDetector.detectChanges();
  }

  detailsCallback(nodeDeleted: boolean): void {
    this.data.graph.reload();
    if (nodeDeleted) {
      this.close();
    }
  }

  ngOnDestroy(): void {
    ComponentContextMenuComponent.LAST_WIDTH = this.width;
    ComponentContextMenuComponent.LAST_HEIGHT = this.height;
  }

  @HostListener('window:mouseup')
  private onMouseUp() {
    this.resize = false;
  }

  @HostListener('window:mousemove', ['$event'])
  private onMouseMove(event: MouseEvent) {
    if (!this.resize) {
      return;
    }

    this.width = Math.max(this.width + event.movementX, ComponentContextMenuComponent.MIN_WIDTH);
    this.height = Math.max(this.height + event.movementY, ComponentContextMenuComponent.MIN_HEIGHT);
  }
}
