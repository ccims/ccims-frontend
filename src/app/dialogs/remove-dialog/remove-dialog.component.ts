import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ComponentDetailsComponent } from '@app/component-details/component-details.component';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { Project } from 'src/generated/graphql';
@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.scss']
})
export class RemoveDialogComponent implements OnInit {
  public loading: boolean;
  constructor(private componentStore: ComponentStoreService, private ps: ProjectStoreService,public dialogRef: MatDialogRef<RemoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {this.loading = false; }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDeleteClick(): void {
    if(this.data.type == "Component") {
    this.loading = true;
    console.log("gelöscht")
    /*
    this.componentStoreService.deleteComponent(this.displayComponent.id).subscribe(({ data }) => {
      this.loading = false;
      this.dialogRef.close(this.data);
    }, (error) => {
      console.log('there was an error sending the query', error);
      this.loading = false;
    }); */
  }
    if(this.data.type == "Project") {
      /*
          this.loading = true;
          this.ps.delete(this.data.id).subscribe(({ data }) => {
            console.log('got data', data);
            this.loading = false;
            // this.reloadProjects();
          }, (error) => {
            console.log('there was an error sending the query', error);
            this.loading = false;
          });*/
    }

    this.dialogRef.close(this.data.name);


  }
}
export interface DialogData {
  type: string;
  name: string;
  id: string;
}
