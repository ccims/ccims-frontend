import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ConnectedPosition, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {
  GetComponentQuery,
  GetInterfaceQuery,
  UpdateComponentInput,
  UpdateComponentInterfaceInput
} from '../../../generated/graphql';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ComponentStoreService} from '@app/data/component/component-store.service';
import {MatDialog} from '@angular/material/dialog';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {encodeListId, ListType, NodeType} from '@app/data-dgql/id';
import {InterfaceStoreService} from '@app/data/interface/interface-store.service';
import {IssueGraphComponent} from '@app/graphs/issue-graph/issue-graph.component';
import {RemoveDialogComponent} from '@app/dialogs/remove-dialog/remove-dialog.component';
import {QueryComponent} from '@app/utils/query-component/query.component';

export enum ComponentContextMenuType {
  Component,
  Interface
}

export interface ComponentContextMenuData {
  overlayRef: OverlayRef;
  position: ConnectedPosition;
  nodeId: string;
  type: ComponentContextMenuType;
  graph: IssueGraphComponent;
}

export const COMPONENT_CONTEXT_MENU_DATA = new InjectionToken<ComponentContextMenuData>('COMPONENT_CONTEXT_MENU_DATA');

@Injectable({providedIn: 'root'})
export class ComponentContextMenuService {
  constructor(private overlay: Overlay, private injector: Injector) {
  }

  open(parent: Element, x: number, y: number, componentId: string, componentType: ComponentContextMenuType, issueGraph: IssueGraphComponent): ComponentContextMenuComponent {
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
export class ComponentContextMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  private static MIN_WIDTH = 700;
  private static MIN_HEIGHT = 400;
  private static LAST_WIDTH = ComponentContextMenuComponent.MIN_WIDTH;
  private static LAST_HEIGHT = ComponentContextMenuComponent.MIN_HEIGHT;

  Type = ComponentContextMenuType;
  saveFailed: boolean;
  editMode: boolean;
  placeholder = 'placeholder';
  validationProvider = new FormControl('', [Validators.required]);
  width = ComponentContextMenuComponent.LAST_WIDTH;
  height = ComponentContextMenuComponent.LAST_HEIGHT;
  projectId: string;
  issueListId: string;
  component: GetComponentQuery;
  interface: GetInterfaceQuery;
  validationName = new FormControl('', [Validators.required]);
  validationUrl = new FormControl('', [Validators.required]);
  validationIMS = new FormControl('', [Validators.required]);
  validationType = new FormControl('');
  validationDescription = new FormControl('');
  private resize = false;

  @ViewChild('frame') frame: ElementRef;
  @ViewChild('resizeCorner') set resizeCorner(content: ElementRef) {
    if (content) {
      content.nativeElement.addEventListener('mousedown', () => this.resize = true);
    }
  }
  @ViewChild(QueryComponent) queryComponent: QueryComponent;

  constructor(@Inject(COMPONENT_CONTEXT_MENU_DATA) public data: ComponentContextMenuData,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private componentStoreService: ComponentStoreService,
              private interfaceStoreService: InterfaceStoreService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private notify: UserNotifyService) {
  }

  updatePosition(x: number, y: number): void {
    this.data.position.offsetX = x;
    this.data.position.offsetY = y;
    this.data.overlayRef.getConfig().positionStrategy.apply();
  }

  close(): void {
    this.data.overlayRef.dispose();
  }

  ngOnInit(): void {
    this.editMode = false;
    this.projectId = this.route.snapshot.paramMap.get('id');

    let listType = NodeType.Component;
    if (this.data.type === ComponentContextMenuType.Interface) {
      listType = NodeType.Interface;
    }

    this.issueListId = encodeListId({node: {type: listType, id: this.data.nodeId}, type: ListType.Issues});
    this.validationIMS.setValue('?');
    this.validationUrl.setValue('?');
    console.log(this.data.nodeId);
  }

  ngAfterViewInit() {
    this.frame.nativeElement.style.minWidth = ComponentContextMenuComponent.MIN_WIDTH + 'px';
    this.frame.nativeElement.style.minHeight = ComponentContextMenuComponent.MIN_HEIGHT + 'px';

    if (this.data.type === ComponentContextMenuType.Component) {
      this.queryComponent.listenTo(this.componentStoreService.getBasicComponent(this.data.nodeId)).subscribe(
        component => {
          this.component = component;
          this.validationIMS.setValue('This is a placeholder');
          this.validationUrl.setValue(component.node.repositoryURL);
        }, error => {
          this.notify.notifyError('Failed to get component information!', error);
        });
    } else if (this.data.type === ComponentContextMenuType.Interface) {
      this.queryComponent.listenTo(this.interfaceStoreService.getInterface(this.data.nodeId)).subscribe(
        int => {
          this.interface = int;
        },
        error => {
          this.notify.notifyError('Failed to get interface information!', error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    ComponentContextMenuComponent.LAST_WIDTH = this.width;
    ComponentContextMenuComponent.LAST_HEIGHT = this.height;
  }

  public getNodeTypeString(): string {
    return (this.data.type === ComponentContextMenuType.Interface ? 'Interface' : 'Component');
  }

  public node(): GetComponentQuery | GetInterfaceQuery {
    if (this.data.type === ComponentContextMenuType.Component) {
      return this.component;
    } else if (this.data.type === ComponentContextMenuType.Interface) {
      return this.interface;
    }
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

  public onCancelClick() {
    this.resetValues();
    this.editMode = false;
  }

  public onEditClick() {
    this.editMode = true;
  }

  public onDeleteClick(): void {
    // TODO: Error handling/loading messages etc.
    const affected: string[] = [];
    if (this.data.type === ComponentContextMenuType.Component) {
      this.componentStoreService.getComponentInterfaces(this.data.nodeId).subscribe(interfaces => {
        for (const i of interfaces.node.interfaces.nodes) {
          let affectedInterface = 'Interface "' + i.name + '" will be deleted';
          if (i.consumedBy.nodes.length > 0) {
            affectedInterface += ', which will affect the following component(s):';
          }

          affected.push(affectedInterface);
          for (const component of i.consumedBy.nodes) {
            affected.push(' ' + component.name);
          }
        }

        this.showDeleteDialog(affected);
      });
    } else if (this.data.type === ComponentContextMenuType.Interface) {
      this.interfaceStoreService.getConsumingComponents(this.data.nodeId).subscribe(components => {
        affected.push('Deleting this interface will affect the following component(s):');
        affected.push(' ' + components.node.component.name);
        for (const c of components.node.consumedBy.nodes) {
          affected.push(' ' + c.name);
        }

        this.showDeleteDialog(affected);
      });
    }
  }

  private showDeleteDialog(affected: string[]): void {
    if (this.data.type === ComponentContextMenuType.Component) {
      const confirmDeleteDialogRef = this.dialog.open(RemoveDialogComponent,
        {
          data: {
            title: 'Really delete component \"' + this.component.node.name + '\"?',
            messages: ['Are you sure you want to delete the component \"' + this.component.node.name + '\"?',
              'This action cannot be undone!'].concat(affected),
            verificationName: this.component.node.name
          }
        });
      confirmDeleteDialogRef.afterClosed().subscribe(deleteData => {
        if (deleteData) {
          this.componentStoreService.deleteComponent(this.data.nodeId).subscribe(
            () => {
              this.notify.notifyInfo('Successfully deleted component \"' + this.component.node.name + '\""');
              this.data.graph.reload();
              this.close();
            },
            error => this.notify.notifyError('Failed to delete component!', error)
          );
        }
      });
    } else if (this.data.type === ComponentContextMenuType.Interface) {
      const confirmDeleteDialogRef = this.dialog.open(RemoveDialogComponent,
        {
          data: {
            title: 'Really delete interface \"' + this.interface.node.name + '\"?',
            messages: ['Are you sure you want to delete the interface \"' + this.interface.node.name + '\"?',
              'This action cannot be undone!'].concat(affected),
            verificationName: this.interface.node.name
          }
        });
      confirmDeleteDialogRef.afterClosed().subscribe(deleteData => {
        // dialog returns if the deleting was successfull
        if (deleteData) {
          this.interfaceStoreService.delete(this.data.nodeId).subscribe(() => {
            this.notify.notifyInfo('Successfully deleted interface \"' + this.interface.node.name + '\"');
            this.data.graph.reload();
            this.close();
          }, error => this.notify.notifyError('Failed to delete interface!', error));
        }
      });
    }
  }

  public onSaveClick(): void {
    if (this.data.type === ComponentContextMenuType.Component) {
      this.component.node.name = this.validationName.value;
      // FIXME
      // this.component.node.ims.imsType = this.validationProvider.value;
      this.component.node.description = this.validationDescription.value;
      this.updateComponent();
    } else if (this.data.type === ComponentContextMenuType.Interface) {
      this.interface.node.name = this.validationName.value;
      this.interface.node.description = this.validationDescription.value;
      this.updateInterface();
    }
  }

  private resetValues() {
    if (this.data.type === ComponentContextMenuType.Component) {
      this.validationName.setValue(this.component.node.name);
      this.validationIMS.setValue('http://example.ims.com');
      // FIXME
      // this.validationProvider.setValue(this.component.node.ims.imsType);
      this.validationUrl.setValue('http://example.repo.com');
      this.validationDescription.setValue(this.component.node.description);
    } else if (this.data.type === ComponentContextMenuType.Interface) {
      this.validationName.setValue(this.interface.node.name);
      this.validationDescription.setValue(this.interface.node.description);
    }
  }

  private updateComponent(): void {
    const input: UpdateComponentInput = {
      component: this.component.node.id,
      name: this.component.node.name,
      description: this.component.node.description
    };

    this.componentStoreService.updateComponent(input).subscribe(({data}) => {
      this.editMode = false;
      this.data.graph.reload();
    }, (error) => {
      this.notify.notifyError('Failed to update the component!', error);
    });
  }

  private updateInterface(): void {
    const MutationinputData: UpdateComponentInterfaceInput = {
      componentInterface: this.interface.node.id,
      name: this.interface.node.name,
      description: this.interface.node.description
    };

    this.interfaceStoreService.update(MutationinputData).subscribe(({data}) => {
      this.editMode = false;
      this.data.graph.reload();
    }, (error) => {
      this.notify.notifyError('Failed to update interface!', error);
    });
  }
}
