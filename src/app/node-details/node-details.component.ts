import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {
  GetBasicComponentQuery,
  GetComponentQuery,
  GetInterfaceQuery,
  UpdateComponentInput,
  UpdateComponentInterfaceInput
} from '../../generated/graphql';
import {FormControl, Validators} from '@angular/forms';
import { ListId, ListType, NodeType } from '@app/data-dgql/id';
import {Router} from '@angular/router';
import {ComponentStoreService} from '@app/data/component/component-store.service';
import {InterfaceStoreService} from '@app/data/interface/interface-store.service';
import {MatDialog} from '@angular/material/dialog';
import {UserNotifyService} from '@app/user-notify/user-notify.service';
import {QueryComponent} from '@app/utils/query-component/query.component';
import {RemoveDialogComponent} from '@app/dialogs/remove-dialog/remove-dialog.component';

export enum NodeDetailsType {
  Component,
  Interface
}

export declare type NodeUpdatedCallbackFn = (nodeDeleted: boolean) => void;

@Component({
  selector: 'app-node-details',
  templateUrl: './node-details.component.html',
  styleUrls: ['./node-details.component.scss']
})
export class NodeDetailsComponent implements OnInit, AfterViewInit {
  @Input() projectId: string;
  @Input() nodeId: string;
  @Input() nodeType: NodeDetailsType;
  @Input() callback?: NodeUpdatedCallbackFn;
  @ViewChild('nodeQuery') nodeQuery: QueryComponent;
  @ViewChild('deleteQuery') deleteQuery: QueryComponent;
  @ViewChild('updateQuery') updateQuery: QueryComponent;

  Type = NodeDetailsType;
  issueListId: ListId;
  component: GetBasicComponentQuery;
  interface: GetInterfaceQuery;
  saveFailed: boolean;
  editMode: boolean;
  showName = false;
  placeholder = 'placeholder';

  // TODO: Validators
  validationProvider = new FormControl('', [Validators.required]);
  validationName = new FormControl('', [Validators.required]);
  validationUrl = new FormControl('', [Validators.required]);
  validationIMS = new FormControl('', [Validators.required]);
  validationType = new FormControl('');
  validationDescription = new FormControl('');

  constructor(private router: Router,
              private componentStoreService: ComponentStoreService,
              private interfaceStoreService: InterfaceStoreService,
              private dialog: MatDialog,
              private notify: UserNotifyService) {
  }

  ngOnInit(): void {
    this.editMode = false;

    if (this.nodeType === NodeDetailsType.Component) {
      this.issueListId = {node: {type: NodeType.Component, id: this.nodeId}, type: ListType.Issues};
    } else {
      this.issueListId = {
        node: {type: NodeType.ComponentInterface, id: this.nodeId},
        type: ListType.IssuesOnLocation
      };
    }


    this.validationIMS.setValue('?');
    this.validationUrl.setValue('?');
  }

  ngAfterViewInit() {
    if (this.nodeType === NodeDetailsType.Component) {
      this.nodeQuery.listenTo(this.componentStoreService.getBasicComponent(this.nodeId), component => {
        if (component.node) {
          this.component = component;
          this.validationIMS.setValue('This is a placeholder');
          this.validationUrl.setValue(component.node.repositoryURL);
        } else {
          this.nodeQuery.setError();
        }
      });
    } else if (this.nodeType === NodeDetailsType.Interface) {
      this.nodeQuery.listenTo(this.interfaceStoreService.getInterface(this.nodeId), int => {
        if (int.node) {
          this.interface = int;
        } else {
          this.nodeQuery.setError();
        }
      });
    }
  }

  public getNodeName(): string {
    if (!this.nodeQuery) {
      return '';
    }

    if (this.nodeQuery.ready()) {
      return this.node().node.name;
    }

    return '';
  }

  public getNodeTypeString(): string {
    return (this.nodeType === NodeDetailsType.Interface ? 'Interface' : 'Component');
  }

  public node(): GetComponentQuery | GetInterfaceQuery {
    if (this.nodeType === NodeDetailsType.Component) {
      return this.component;
    } else if (this.nodeType === NodeDetailsType.Interface) {
      return this.interface;
    }
  }

  public onCancelClick() {
    this.resetValues();
    this.editMode = false;
  }

  public onEditClick() {
    this.editMode = true;
  }

  public onDeleteClick(): void {
    const affected: string[] = [];
    if (this.nodeType === NodeDetailsType.Component) {
      this.deleteQuery.listenTo(this.componentStoreService.getComponentInterfaces(this.nodeId), interfaces => {
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
    } else if (this.nodeType === NodeDetailsType.Interface) {
      this.deleteQuery.listenTo(this.interfaceStoreService.getConsumingComponents(this.nodeId), components => {
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
    if (this.nodeType === NodeDetailsType.Component) {
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
          this.deleteQuery.listenTo(this.componentStoreService.deleteComponent(this.nodeId), () => {
              this.notify.notifyInfo('Successfully deleted component \"' + this.component.node.name + '\""');
              if (this.callback) {
                this.callback(true);
              }
            }
          );
        }
      });
    } else if (this.nodeType === NodeDetailsType.Interface) {
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
        // dialog returns if the deleting was successful
        if (deleteData) {
          this.deleteQuery.listenTo(this.interfaceStoreService.delete(this.nodeId), () => {
            this.notify.notifyInfo('Successfully deleted interface \"' + this.interface.node.name + '\"');
            if (this.callback) {
              this.callback(true);
            }
          });
        }
      });
    }
  }

  public onSaveClick(): void {
    if (this.nodeType === NodeDetailsType.Component) {
      this.component.node.name = this.validationName.value;
      // FIXME
      // this.component.node.ims.imsType = this.validationProvider.value;
      this.component.node.description = this.validationDescription.value;
      this.updateComponent();
    } else if (this.nodeType === NodeDetailsType.Interface) {
      this.interface.node.name = this.validationName.value;
      this.interface.node.description = this.validationDescription.value;
      this.updateInterface();
    }
  }

  private resetValues() {
    if (this.nodeType === NodeDetailsType.Component) {
      this.validationName.setValue(this.component.node.name);
      this.validationIMS.setValue('http://example.ims.com');
      // FIXME
      // this.validationProvider.setValue(this.component.node.ims.imsType);
      this.validationUrl.setValue('http://example.repo.com');
      this.validationDescription.setValue(this.component.node.description);
    } else if (this.nodeType === NodeDetailsType.Interface) {
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


    this.updateQuery.listenTo(this.componentStoreService.updateComponent(input), () => {
      this.editMode = false;
      if (this.callback) {
        this.callback(false);
      }
    });
  }

  private updateInterface(): void {
    const MutationinputData: UpdateComponentInterfaceInput = {
      componentInterface: this.interface.node.id,
      name: this.interface.node.name,
      description: this.interface.node.description
    };

    this.updateQuery.listenTo(this.interfaceStoreService.update(MutationinputData), () => {
      this.editMode = false;
      if (this.callback) {
        this.callback(false);
      }
    });
  }
}
