import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { CreateIssueDialogComponent } from '@app/dialogs/create-issue-dialog/create-issue-dialog.component';
import { RemoveDialogComponent } from '@app/dialogs/remove-dialog/remove-dialog.component';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateLabelInput, GetComponentQuery, UpdateComponentInput, UpdateComponentInterfaceInput } from '../../generated/graphql';
import {IssueListComponent} from '../issue-list/issue-list.component';
import { LabelStoreService } from '@app/data/label/label-store.service';
import { InterfaceStoreService } from '@app/data/interface/interface-store.service';
/**
 * This component provides the interface details
 *
 */
@Component({
  selector: 'app-interface-details',
  templateUrl: './interface-details.component.html',
  styleUrls: ['./interface-details.component.scss']
})
export class InterfaceDetailsComponent implements OnInit {
  public queryParamSelected;
  public interface$: Observable<GetComponentQuery>;
  private interface: GetComponentQuery;
  private interfaceId: string;
  public loading: boolean;
  public saveFailed: boolean;
  public editMode: boolean;
  public currentInterface: any;
  validationName = new FormControl('', [Validators.required]);
  validationDescription = new FormControl('');
  public validationType = new FormControl('');

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
  // check if there are query params set in the url
  // query param selected: if selected = 0 the interface details tab shows up
  // query param selected: if selected = 1 the interface issues list tab shows up
  ngOnInit(): void {
      this.activatedRoute.queryParams.subscribe(
        params => {
                   this.queryParamSelected = params.selected;

      });
    //
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
      { data: { type: 'interface', name: this.interface.node.name, id: this.interfaceId } });
    confirmDeleteDialogRef.afterClosed().subscribe(deleteData => {
        // dialog returns if the deleting was successfull
        if (deleteData){
          this.router.navigate(['projects',this.route.snapshot.paramMap.get('id'),'graph']);
        }
        });

  }
  public onSaveClick(): void {

    this.interface.node.name = this.validationName.value;
    this.interface.node.description = this.validationDescription.value;
    this.updateInterface();
  }

  private resetValues() {
    this.validationName.setValue(this.interface.node.name);
     this.validationDescription.setValue(this.interface.node.description);
  }

  private updateInterface(): void{

    const MutationinputData: UpdateComponentInterfaceInput = {
      componentinterfaceId: this.interfaceId,
      name : this.interface.node.name,
      description : this.interface.node.description
    };
    this.loading = true;
    this.interfaceStoreService.update(MutationinputData).subscribe(({ data }) => {
      this.editMode = !this.editMode;
      this.loading = false;
      console.log(data);
    }, (error) => {
      console.log('there was an error sending the query', error);
      this.loading = false;

    });

  }


}
