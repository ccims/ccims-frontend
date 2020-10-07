import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-component-details',
  templateUrl: './component-details.component.html',
  styleUrls: ['./component-details.component.scss']
})
export class ComponentDetailsComponent implements OnInit {
  @Input()clickedNode: any;

  validateForm!: FormGroup;
  public loading: boolean;
  public saveFailed: boolean;
  public editMode: boolean =false;

  constructor(private fb: FormBuilder) { }

  validationName = new FormControl('', [Validators.required]);
  validationUrl = new FormControl('', [Validators.required]);
  validationIMS = new FormControl('', [Validators.required]);
  validationProvider = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    console.log(this.clickedNode);
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      url:  [null, [Validators.required]],
      ims:  [null, [Validators.required]],
      provider:  [null, [Validators.required]]
    });
    this.setDefaultValues();
    // clicked node id -->mutation db
    // prefill all fields


  }
  setDefaultValues(): void {
    this.getComponentData();
    // Parse object from db
    this.validationName.setValue(this.clickedNode.title);
    // Todo others
  }

  getComponentData() {
    // TODO Mutation to DB

  }
  onCancelClick(){
    this.editMode =!this.editMode;
  }
  onSaveClick(): void{
    this.editMode =!this.editMode;


    /*
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });*/
  }
  // mutation getComponent
  // design fields / fill fields
    // which fields are there
      //  which are editable
  // make view editable
  // mutation for save component


}
