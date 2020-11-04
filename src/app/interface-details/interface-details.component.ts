import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { CreateIssueDialogComponent } from '@app/dialogs/create-issue-dialog/create-issue-dialog.component';
import { RemoveDialogComponent } from '@app/dialogs/remove-dialog/remove-dialog.component';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { Component } from 'src/generated/graphql';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateLabelInput, GetComponentQuery, UpdateComponentInput } from '../../generated/graphql';
import {IssueListComponent} from '../issue-list/issue-list.component';
import { LabelStoreService } from '@app/data/label/label-store.service';
import { InterfaceStoreService } from '@app/data/interface/interface-store.service';

@Component({
  selector: 'app-interface-details',
  templateUrl: './interface-details.component.html',
  styleUrls: ['./interface-details.component.scss']
})
export class InterfaceDetailsComponent implements OnInit {
  public interface$: Observable<GetComponentQuery>;
  private interface: GetComponentQuery;
  private interfaceId: string;
  public loading: boolean;
  public saveFailed: boolean;
  public editMode: boolean;
  public currentInterface: any;
  validationName = new FormControl('', [Validators.required]);
  validationDescription = new FormControl('');
  public validationType = new FormControl('', [Validators.required]);

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private interfaceStoreService: InterfaceStoreService, private dialog: MatDialog,
              private route: ActivatedRoute, private labelStore: LabelStoreService) {
    this.editMode = false;

    this.interfaceId = this.route.snapshot.paramMap.get('interfaceId');

    this.interface$ = this.interfaceStoreService.getInterface(this.interfaceId);
    this.interface$.subscribe(componentInterface => {
      this.interface = componentInterface;
    });

  }

  ngOnInit(): void {

  }

  public onCancelClick() {
    this.resetValues();
    this.editMode = !this.editMode;


  }
  public onEditClick() {

    this.editMode = !this.editMode;


  }

  public onDeleteClick() {
    /*
    // Confirm Dialog anzeigen
    // Onconfirm
    const confirmDeleteDialogRef = this.dialog.open(RemoveDialogComponent,
      { data: { type: 'Component', name: this.component.node.name, id: this.componentId } });
    confirmDeleteDialogRef.afterClosed().subscribe(deleteData => {
        if (deleteData){
          this.router.navigate(['../../graph/'], {relativeTo: this.activatedRoute});
        }
        });
    // Delete Mutation auslösen
    */
  }
  public onSaveClick(): void {
    /*
    this.component.node.name = this.validationName.value;
    this.component.node.ims.imsType = this.validationProvider.value;
    this.component.node.description = this.validationDescription.value;
    // this.component.node.ims. = this.validationIMS.value; //endpoint muss noch angepasst werden
    // this.component.node.Url = this.validationUrl.value;  // url muss noch angepasst werden
    this.updateComponent();
    this.editMode = !this.editMode;
    // Confirm Dialog ??
    // mutation for save component
    /*
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });
    */
  }

  private resetValues() {
    this.validationName.setValue(this.interface.node.name);

    // this.validationType.setValue(this.interface.node.ims.imsType);
    // this.validationDescription.setValue(this.component.node.description);
  }

  private updateInterface(): void{
    /*
    const MutationinputData: UpdateComponentInput = {
      componentId : this.component.node.id,
      name : this.component.node.name,
      imsType : this.component.node.ims.imsType,
      description : this.component.node.description
    };
    this.loading = true;
    this.componentStoreService.updateComponent(MutationinputData).subscribe(({ data }) => {
      this.loading = false;

    }, (error) => {
      console.log('there was an error sending the query', error);
      this.loading = false;

    });
    */
  }


}
