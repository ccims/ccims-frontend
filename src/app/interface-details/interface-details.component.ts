import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {RemoveDialogComponent} from '@app/dialogs/remove-dialog/remove-dialog.component';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {GetComponentQuery, UpdateComponentInterfaceInput} from '../../generated/graphql';
import {InterfaceStoreService} from '@app/data/interface/interface-store.service';
import {UserNotifyService} from '@app/user-notify/user-notify.service';

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
  validationName = new FormControl('', [Validators.required]);
  validationDescription = new FormControl('');
  public validationType = new FormControl('');

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private interfaceStoreService: InterfaceStoreService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private notify: UserNotifyService) {
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
      {
        data: {
          title: 'Really delete interface \"' + this.interface.node.name + '\"?',
          messages: ['Are you sure you want to delete the project \"' + this.interface.node.name + '\"?', 'This action cannot be undone!']
        }
      });
    confirmDeleteDialogRef.afterClosed().subscribe(deleteData => {
      // dialog returns if the deleting was successfull
      if (deleteData) {
        this.interfaceStoreService.delete(this.interfaceId).subscribe(() => {
          this.notify.notifyInfo('Successfully deleted interface \"' + this.interface.node.name + '\"');
          this.router.navigate(['projects', this.route.snapshot.paramMap.get('id'), 'graph']);
        }, error => this.notify.notifyError('Failed to delete interface!', error));
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

  private updateInterface(): void {
    const MutationinputData: UpdateComponentInterfaceInput = {
      componentinterfaceId: this.interfaceId,
      name: this.interface.node.name,
      description: this.interface.node.description
    };

    this.loading = true;
    this.interfaceStoreService.update(MutationinputData).subscribe(({data}) => {
      this.editMode = !this.editMode;
      this.loading = false;
      console.log(data);
    }, (error) => {
      this.notify.notifyError('Failed to update interface!', error);
      this.loading = false;
    });
  }
}
