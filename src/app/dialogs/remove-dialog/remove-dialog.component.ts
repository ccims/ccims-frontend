import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentDetailsComponent } from '@app/component-details/component-details.component';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { InterfaceStoreService } from '@app/data/interface/interface-store.service';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { Project } from 'src/generated/graphql';
@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.scss']
})
export class RemoveDialogComponent implements OnInit {
  public loading: boolean;
  constructor( private componentStore: ComponentStoreService, public dialogRef: MatDialogRef<RemoveDialogComponent>,
    private is: InterfaceStoreService,
               @Inject(MAT_DIALOG_DATA) public data: DialogData) {this.loading = false; }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDeleteClick(): void {
    if (this.data.type == 'Component') {
    this.loading = true;
    console.log('gelöscht');

    this.componentStore.deleteComponent(this.data.id).subscribe(({ data }) => {
      this.loading = false;
      this.dialogRef.close(this.data);
    }, (error) => {
      console.log('there was an error sending the query', error);
      this.loading = false;
    });
  }
    if (this.data.type == 'interface') {

          this.loading = true;
          this.is.delete(this.data.id).subscribe(({ data }) => {
            console.log('got data', data);
            this.loading = false;
            // this.reloadProjects();
          }, (error) => {
            console.log('there was an error sending the query', error);
            this.loading = false;
          });
    }

    this.dialogRef.close(this.data.name);


  }
}
export interface DialogData {
  type: string;
  name: string;
  id: string;
}
