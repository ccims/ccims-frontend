import {Component, ElementRef, HostListener, Inject, Injectable, InjectionToken, Injector, OnInit, ViewChild} from '@angular/core';
import {ConnectedPosition, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {RemoveDialogComponent} from '@app/dialogs/remove-dialog/remove-dialog.component';
import {GetBasicComponentQuery, GetComponentQuery, UpdateComponentInput} from '../../../generated/graphql';
import {Observable} from 'rxjs';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ComponentStoreService} from '@app/data/component/component-store.service';
import {MatDialog} from '@angular/material/dialog';
import {UserNotifyService} from '@app/user-notify/user-notify.service';

export enum ComponentContextMenuType {
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
    map.set(COMPONENT_CONTEXT_MENU_DATA, {overlayRef: ref, position: pos, nodeId: componentId, type: componentType});
    const injector = new PortalInjector(this.injector, map);
    return ref.attach(new ComponentPortal(ComponentContextMenuComponent, null, injector)).instance;
  }
}

@Component({
  styleUrls: ['component-context-menu.component.scss'],
  templateUrl: './component-context-menu.component.html'
})
export class ComponentContextMenuComponent implements OnInit {
  private static MIN_WIDTH = 700;
  private static MIN_HEIGHT = 400;

  Type = ComponentContextMenuType;
  public queryParamSelected: string;
  public component$: Observable<GetBasicComponentQuery>;
  public loading: boolean;
  public saveFailed: boolean;
  public editMode: boolean;
  public placeholder = 'placeholder';
  public validationProvider = new FormControl('', [Validators.required]);
  public width = ComponentContextMenuComponent.MIN_WIDTH;
  public height = ComponentContextMenuComponent.MIN_HEIGHT;
  private resize = false;

  @ViewChild('frame') set frame(content: ElementRef) {
    if (content) {
      content.nativeElement.style.minWidth = ComponentContextMenuComponent.MIN_WIDTH + 'px';
      content.nativeElement.style.minHeight = ComponentContextMenuComponent.MIN_HEIGHT + 'px';
    }
  }

  @ViewChild('resizeCorner') set resizeCorner(content: ElementRef) {
    if (content) {
      content.nativeElement.addEventListener('mousedown', () => this.resize = true);
    }
  }

  validationName = new FormControl('', [Validators.required]);
  validationUrl = new FormControl('', [Validators.required]);
  validationIMS = new FormControl('', [Validators.required]);
  validationDescription = new FormControl('');
  private component: GetComponentQuery;

  constructor(@Inject(COMPONENT_CONTEXT_MENU_DATA) public data: ComponentContextMenuData,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private componentStoreService: ComponentStoreService,
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
    this.validationIMS.setValue('?');
    this.validationUrl.setValue('?');
    console.log(this.data.nodeId);
    this.component$ = this.componentStoreService.getBasicComponent(this.data.nodeId);
    this.component$.subscribe(
      component => {
        this.component = component;
        this.validationIMS.setValue('This is a placeholder');
        this.validationUrl.setValue(component.node.repositoryURL);
      },
      error => this.notify.notifyError('Failed to get component information!', error));

    this.activatedRoute.queryParams.subscribe(params => this.queryParamSelected = params.selected);
  }

  //
  // @HostListener('window:mousedown', ['$event'])
  // private onMouseDown(event: MouseEvent) {
  //   this.resize = event.target === this.resizeCorner.nativeElement;
  //   console.log(this.resize);
  // }

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
    this.editMode = !this.editMode;
  }

  public onEditClick() {
    this.editMode = !this.editMode;
  }

  public onDeleteClick() {
    // show Confirm Dialog
    const confirmDeleteDialogRef = this.dialog.open(RemoveDialogComponent,
      {
        data: {
          title: 'Really delete component \"' + this.component.node.name + '\"?',
          messages: ['Are you sure you want to delete the component \"' + this.component.node.name + '\"?', 'This action cannot be undone!']
        }
      });
    confirmDeleteDialogRef.afterClosed().subscribe(deleteData => {
      if (deleteData) {
        this.componentStoreService.deleteComponent(this.data.nodeId).subscribe(
          () => {
            this.notify.notifyInfo('Successfully deleted component \"' + this.component.node.name + '\""');
          },
          error => this.notify.notifyError('Failed to delete component!', error)
        );
      }
    });
  }

  public onSaveClick(): void {
    this.component.node.name = this.validationName.value;
    // FIXME
    // this.component.node.ims.imsType = this.validationProvider.value;
    this.component.node.description = this.validationDescription.value;
    this.updateComponent();
    this.editMode = !this.editMode;
  }

  private resetValues() {
    this.validationName.setValue(this.component.node.name);
    this.validationIMS.setValue('http://example.ims.com');
    // FIXME
    // this.validationProvider.setValue(this.component.node.ims.imsType);
    this.validationUrl.setValue('http://example.repo.com');
    this.validationDescription.setValue(this.component.node.description);
  }

  private updateComponent(): void {
    const input: UpdateComponentInput = {
      component: this.component.node.id,
      name: this.component.node.name,
      description: this.component.node.description
    };
    this.loading = true;
    this.componentStoreService.updateComponent(input).subscribe(({data}) => {
      this.loading = false;
    }, (error) => {
      this.notify.notifyError('Failed to update the component!', error);
      this.loading = false;
    });
  }
}
