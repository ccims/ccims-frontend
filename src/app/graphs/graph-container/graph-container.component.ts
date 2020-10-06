import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-graph-container',
  templateUrl: './graph-container.component.html',
  styleUrls: ['./graph-container.component.scss']
})
export class GraphContainerComponent implements OnInit {
  drawerNode: any;
   @ViewChild(MatDrawer) drawer!: MatDrawer;
  constructor() { }

  ngOnInit(): void {
  }
  recieveNode(node: any){
    this.drawerNode = node;
    console.log(node);
    this.drawer.toggle();
  }
}
