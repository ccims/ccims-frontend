import {
  AfterViewInit,
  ChangeDetectorRef,
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
import {NodeDetailsComponent, NodeDetailsType, NodeUpdatedCallbackFn} from '@app/node-details/node-details.component';

/**
 * Interface specifying the data required for the component context menu.
 * Note that this should not be used directly, instead the ComponentContextMenuService should be used to open a context
 * menu.
 */
interface ComponentContextMenuData {
  /** Reference to the overlay used to display the context menu */
  overlayRef: OverlayRef;
  /** The position of the overlay */
  position: ConnectedPosition;
  /** The project id string */
  projectId: string;
  /** The node id string */
  nodeId: string;
  /** The type of node, either interface or component. Controls the content shown in the context menu */
  type: NodeDetailsType;
  /** A reference to the issue graph */
  graph: IssueGraphComponent;
}

const COMPONENT_CONTEXT_MENU_DATA = new InjectionToken<ComponentContextMenuData>('COMPONENT_CONTEXT_MENU_DATA');

/**
 * Use this service to create a {@link ComponentContextMenuComponent}.
 */
@Injectable({providedIn: 'root'})
export class ComponentContextMenuService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  /**
   * Open a new component context menu
   * @param parent The parent of the context menu
   * @param x The X position relative to the top left corner of the parent
   * @param y The Y position relative to the top left corner of the parent
   * @param projectID The id of the project the node belongs to
   * @param nodeID The id of the node
   * @param nodeType The type of the node
   * @param issueGraph A reference to the issue graph
   * @return A reference to the context menu
   */
  open(
    parent: Element,
    x: number,
    y: number,
    projectID: string,
    nodeID: string,
    nodeType: NodeDetailsType,
    issueGraph: IssueGraphComponent
  ): ComponentContextMenuComponent {
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
      projectId: projectID,
      nodeId: nodeID,
      type: nodeType,
      graph: issueGraph
    });
    const injector = new PortalInjector(this.injector, map);
    return ref.attach(new ComponentPortal(ComponentContextMenuComponent, null, injector)).instance;
  }
}

/**
 * This component manages the component context menu as well as its content
 */
@Component({
  styleUrls: ['component-context-menu.component.scss'],
  templateUrl: './component-context-menu.component.html'
})
export class ComponentContextMenuComponent implements AfterViewInit, OnDestroy {
  /** @ignore */
  private static MIN_WIDTH = 700;
  /** @ignore */
  private static MIN_HEIGHT = 400;
  /** @ignore */
  private static LAST_WIDTH = ComponentContextMenuComponent.MIN_WIDTH;
  /** @ignore */
  private static LAST_HEIGHT = ComponentContextMenuComponent.MIN_HEIGHT;
  /** @ignore */
  private resize = false;

  /** Current width of the dialog */
  width = ComponentContextMenuComponent.LAST_WIDTH;
  /** Current height of the dialog */
  height = ComponentContextMenuComponent.LAST_HEIGHT;
  /** True if the node details component is loaded */
  nodeDetailsReady: boolean;

  /** @ignore */
  @ViewChild('frame') frame: ElementRef;

  /** @ignore */
  @ViewChild('resizeCorner') set resizeCorner(content: ElementRef) {
    if (content) {
      content.nativeElement.addEventListener('mousedown', () => (this.resize = true));
    }
  }

  /** @ignore */
  @ViewChild(NodeDetailsComponent) nodeDetails: NodeDetailsComponent;

  constructor(@Inject(COMPONENT_CONTEXT_MENU_DATA) public data: ComponentContextMenuData, private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.frame.nativeElement.style.minWidth = ComponentContextMenuComponent.MIN_WIDTH + 'px';
    this.frame.nativeElement.style.minHeight = ComponentContextMenuComponent.MIN_HEIGHT + 'px';
    this.nodeDetailsReady = true;
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    // TODO: Save in local storage?
    ComponentContextMenuComponent.LAST_WIDTH = this.width;
    ComponentContextMenuComponent.LAST_HEIGHT = this.height;
  }

  /** @ignore */
  detailsCallback: NodeUpdatedCallbackFn = (nodeDeleted: boolean): void => {
    this.data.graph.reload();
    if (nodeDeleted) {
      this.close();
    }
  };

  /**
   * Update the position of the context menu
   * @param x The X offset of the top left menu corner relative to the top left corner of the parent
   * @param y The Y offset of the top left menu corner relative to the top left corner of the parent
   */
  updatePosition(x: number, y: number): void {
    this.data.position.offsetX = x;
    this.data.position.offsetY = y;
    this.data.overlayRef.getConfig().positionStrategy.apply();
  }

  /**
   * Close the context menu
   */
  close(): void {
    this.data.overlayRef.dispose();
  }

  /** @ignore */
  @HostListener('window:mouseup')
  private onMouseUp() {
    this.resize = false;
  }

  /** @ignore */
  @HostListener('window:mousemove', ['$event'])
  private onMouseMove(event: MouseEvent) {
    if (!this.resize) {
      return;
    }

    this.width = Math.max(this.width + event.movementX, ComponentContextMenuComponent.MIN_WIDTH);
    this.height = Math.max(this.height + event.movementY, ComponentContextMenuComponent.MIN_HEIGHT);
  }
}
