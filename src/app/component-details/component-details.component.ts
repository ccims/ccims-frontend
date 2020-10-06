import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-details',
  templateUrl: './component-details.component.html',
  styleUrls: ['./component-details.component.scss']
})
export class ComponentDetailsComponent implements OnInit {
  @Input()clickedNode: any;
  constructor() { }

  ngOnInit(): void {
    console.log(this.clickedNode);
  }
  // mutation getComponent
  // design fields / fill fields
    // which fields are there
      //  which are editable
  // make view editable
  // mutation for save component


}
