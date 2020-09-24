import { Component, OnInit,inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-create-component',
  templateUrl: './create-component.component.html',
  styleUrls: ['./create-component.component.scss']
})

export class CreateComponentComponent{

data: componentData;
name: string;
url: string;
owner?: string;
  constructor(
    public dialogRef: MatDialogRef<CreateComponentComponent>) {}

  onNoClick(): void {
    // console.log(this.name);
    this.dialogRef.close();

  }
  onOkClick(): void{
    // console.log(this.url)
    this.data={name:this.name,
                url:this.url}
    this.dialogRef.close(this.data);
  }


}
interface componentData{
  name: string;
  owner?: string;
  url: string;
}
