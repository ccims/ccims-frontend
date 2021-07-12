import {Component, Injectable, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ComponentStoreService} from '@app/data/component/component-store.service';
import {RemoveDialogComponent} from '@app/dialogs/remove-dialog/remove-dialog.component';
import {Observable} from 'rxjs';
// import { Component } from 'src/generated/graphql';
import {ActivatedRoute, Router} from '@angular/router';
import {GetComponentQuery, UpdateComponentInput} from '../../generated/graphql';
import {UserNotifyService} from '@app/user-notify/user-notify.service';

@Component({
  selector: 'app-component-details',
  templateUrl: './component-details.component.html',
  styleUrls: ['./component-details.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class ComponentDetailsComponent implements OnInit {
  public queryParamSelected: string;
  public component$: Observable<GetComponentQuery>;
  private component: GetComponentQuery;
  private componentId: string;
  public loading: boolean;
  public saveFailed: boolean;
  public editMode: boolean;
  public currentComponent: any;
  validationName = new FormControl('', [Validators.required]);
  validationUrl = new FormControl('', [Validators.required]);
  validationIMS = new FormControl('', [Validators.required]);
  validationDescription = new FormControl('');
  public validationProvider = new FormControl('', [Validators.required]);

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private componentStoreService: ComponentStoreService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private notify: UserNotifyService) {
    this.editMode = false;
    this.componentId = this.route.snapshot.paramMap.get('componentId');

    this.component$ = this.componentStoreService.getFullComponent(this.componentId);
    this.component$.subscribe(component => {
      this.component = component;
    });
  }

  ngOnInit(): void {
    this.validationIMS.setValue('http://beispiel.ims.test');
    this.validationUrl.setValue('http://beispiel.repo.test');
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.queryParamSelected = params.selected;
      });
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
        this.componentStoreService.deleteComponent(this.componentId).subscribe(
          () => {
            this.notify.notifyInfo('Successfully deleted component \"' + this.component.node.name + '\""');
            this.router.navigate(['../../../../graph'], {relativeTo: this.activatedRoute});
          },
          error => this.notify.notifyError('Failed to delete component!', error)
        );
      }
    });
  }

  public onSaveClick(): void {
    this.component.node.name = this.validationName.value;
    this.component.node.ims.imsType = this.validationProvider.value;
    this.component.node.description = this.validationDescription.value;
    this.updateComponent();
    this.editMode = !this.editMode;
  }

  private resetValues() {
    this.validationName.setValue(this.component.node.name);
    this.validationIMS.setValue('http://example.ims.com');
    this.validationProvider.setValue(this.component.node.ims.imsType);
    this.validationUrl.setValue('http://example.repo.com');
    this.validationDescription.setValue(this.component.node.description);
  }

  private updateComponent(): void {
    const MutationinputData: UpdateComponentInput = {
      componentId: this.component.node.id,
      name: this.component.node.name,
      imsType: this.component.node.ims.imsType,
      description: this.component.node.description
    };
    this.loading = true;
    this.componentStoreService.updateComponent(MutationinputData).subscribe(({data}) => {
      this.loading = false;
    }, (error) => {
      this.notify.notifyError('Failed to update the component!', error);
      this.loading = false;
    });
  }
}
