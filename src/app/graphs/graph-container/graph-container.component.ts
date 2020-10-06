import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-graph-container',
  templateUrl: './graph-container.component.html',
  styleUrls: ['./graph-container.component.scss']
})
export class GraphContainerComponent implements OnInit {
  drawerNode: any;
  @Input() drawer: MatDrawer;
  constructor() { }

  ngOnInit(): void {
  }
  recieveNode(node: any){
    this.drawerNode = node;
    console.log(node);
  }
}
