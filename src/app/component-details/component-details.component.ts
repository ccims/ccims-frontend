import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { storeKeyNameFromField } from '@apollo/client/utilities';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { RemoveDialogComponent } from '@app/dialogs/remove-dialog/remove-dialog.component';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { Component } from 'src/generated/graphql';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-component-details',
  templateUrl: './component-details.component.html',
  styleUrls: ['./component-details.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class ComponentDetailsComponent implements OnInit {
  displayComponent: Observable<any>;
  public loading: boolean;
  public saveFailed: boolean;
  public editMode: boolean;
  public currentComponent: any;
  validationName = new FormControl('', [Validators.required]);
  validationUrl = new FormControl('', [Validators.required]);
  validationIMS = new FormControl('', [Validators.required]);
  public validationProvider = new FormControl('', [Validators.required]);

  constructor(private componentStoreService: ComponentStoreService, private dialog: MatDialog, private route: ActivatedRoute) {
    this.editMode = false;
    const componentId = this.route.snapshot.paramMap.get('componentId');

    this.displayComponent = this.componentStoreService.getFullComponent(componentId).pipe(
      tap(data => console.log("Constructor:", data)));
  }

  ngOnInit(): void {
  }

  onCancelClick() {
    this.editMode = !this.editMode;
  }
  onDeleteClick() {
    // Confirm Dialog anzeigen
    // Onconfirm
    // const confirmDeleteDialogRef = this.dialog.open(RemoveDialogComponent, { data: { type: "Component", name: this.displayComponent.name, id: this.displayComponent.id } });

    // Delete Mutation auslösen

  }
  public onSaveClick(): void {
    this.editMode = !this.editMode;
    // Confirm Dialog ??
    // mutation for save component
    /*
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });*/
  }
  public onAddClick(): void {
    //const createIssueDialogRef = this.dialog.open(RemoveDialogComponent, { data: { user: "Component", name: this.displayComponent.name, id: this.displayComponent.id } });

  }

}
