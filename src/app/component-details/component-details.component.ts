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
  public editMode: boolean;

  constructor(private fb: FormBuilder) { this.editMode = false; }

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
    this.validationProvider.setValue("GITHUB");
    this.validationUrl.setValue("mock-repo-nice-to-see-something.de");
    this.validationIMS.setValue("mock-ims-nice-to-see-something.de");
    // Todo others
  }

  getComponentData() {
    // TODO Mutation to DB

  }
  onCancelClick(){
    this.setDefaultValues();
    this.editMode = !this.editMode;
  }
  onSaveClick(): void{
    this.editMode = !this.editMode;
      // mutation for save component
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



}
