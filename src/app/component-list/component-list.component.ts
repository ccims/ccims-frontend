import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../services/component.service';

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.scss']
})
export class ComponentListComponent implements OnInit {


  components: any;
  data: any;
  loading: boolean;

  constructor(private componentService: ComponentService) { }

  ngOnInit() {
    //@ts-ignore
    this.componentService.getAllComponents().subscribe(({ data, loading }) => {
      this.loading = loading;
      //@ts-ignore
      this.components = data.viewer.repositories.nodes.map(components => components.name);
    });
  }

  goToCreateForm() {
    console.log('Not implemented');
  }

}
