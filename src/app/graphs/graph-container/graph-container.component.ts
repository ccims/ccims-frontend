import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ComponentDetailsComponent } from '@app/component-details/component-details.component';
import { ComponentStoreService } from '@app/data/component/component-store.service';

@Component({
  selector: 'app-graph-container',
  templateUrl: './graph-container.component.html',
  styleUrls: ['./graph-container.component.scss']
})
export class GraphContainerComponent implements OnInit {
  drawerNode: any;
  displayComponent: any;
   @ViewChild(MatDrawer) drawer!: MatDrawer;
   @ViewChild(ComponentDetailsComponent) componentDetailView: ComponentDetailsComponent;
  constructor( private componentService: ComponentStoreService) { }

  ngOnInit(): void {
  }
  recieveComponentNode(node: any){
    this.drawerNode = node;
    this.componentService.getFullComponent(node.id).subscribe(componentData => {this.displayComponent = componentData;
    });
    this.drawer.toggle();


  }
}
