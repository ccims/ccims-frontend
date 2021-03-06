import {Component, Injectable, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ComponentStoreService} from '@app/data/component/component-store.service';
import {CreateIssueDialogComponent} from '@app/dialogs/create-issue-dialog/create-issue-dialog.component';
import {RemoveDialogComponent} from '@app/dialogs/remove-dialog/remove-dialog.component';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
// import { Component } from 'src/generated/graphql';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateLabelInput, GetComponentQuery, UpdateComponentInput} from '../../generated/graphql';
import {IssueListComponent} from '../issue-list/issue-list.component';
import {LabelStoreService} from '@app/data/label/label-store.service';
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
    // Onconfirm
    const confirmDeleteDialogRef = this.dialog.open(RemoveDialogComponent,
      {data: {type: 'Component', name: this.component.node.name, id: this.componentId}});
    confirmDeleteDialogRef.afterClosed().subscribe(deleteData => {
      if (deleteData) {
        this.router.navigate(['../../../../graph'], {relativeTo: this.activatedRoute});
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
