import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { storeKeyNameFromField } from '@apollo/client/utilities';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { CreateIssueDialogComponent } from '@app/dialogs/create-issue-dialog/create-issue-dialog.component';
import { RemoveDialogComponent } from '@app/dialogs/remove-dialog/remove-dialog.component';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { Component } from 'src/generated/graphql';
import { ActivatedRoute, Router } from '@angular/router';
import { GetComponentQuery } from '../../generated/graphql';


@Component({
  selector: 'app-component-details',
  templateUrl: './component-details.component.html',
  styleUrls: ['./component-details.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class ComponentDetailsComponent implements OnInit {
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
  public validationProvider = new FormControl('', [Validators.required]);

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private componentStoreService: ComponentStoreService, private dialog: MatDialog, private route: ActivatedRoute) {
    this.editMode = false;
    this.componentId = this.route.snapshot.paramMap.get('componentId');

    this.component$ = this.componentStoreService.getFullComponent(this.componentId);
    this.component$.subscribe(component => {
      this.component = component;
    });
  }

  ngOnInit(): void {
    console.log(this.activatedRoute.url);

  }

  onCancelClick() {
    this.editMode = !this.editMode;


  }
  onDeleteClick() {
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
    const createIssueDialogRef = this.dialog.open(CreateIssueDialogComponent,
      { data: { user: 'Component', name: this.component.node.name, id: this.componentId } });
  }

}
