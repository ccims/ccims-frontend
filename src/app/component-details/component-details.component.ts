import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { storeKeyNameFromField } from '@apollo/client/utilities';
import { ComponentStoreService } from '@app/data/component/component-store.service';
// import { Component } from 'src/generated/graphql';


@Component({
  selector: 'app-component-details',
  templateUrl: './component-details.component.html',
  styleUrls: ['./component-details.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class ComponentDetailsComponent implements OnInit {
  @Input()clickedNode: any;
 @Input()displayComponent: any;
  public loading: boolean;
  public saveFailed: boolean;
  public editMode: boolean;
  public currentComponent: any;
  validationName = new FormControl('', [Validators.required]);
  validationUrl = new FormControl('', [Validators.required]);
  validationIMS = new FormControl('', [Validators.required]);
  public validationProvider = new FormControl('', [Validators.required]);

  constructor( private componentStoreService: ComponentStoreService) { this.editMode = false;

     }

  ngOnInit(): void {
  }

  onCancelClick(){
    this.editMode = !this.editMode;
  }
  public onSaveClick(): void{
    this.editMode = !this.editMode;
      // mutation for save component
    /*
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });*/
  }

}
