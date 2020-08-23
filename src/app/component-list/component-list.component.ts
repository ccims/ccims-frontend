import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../services/component.service';

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.scss']
})
export class ComponentListComponent implements OnInit {


  components: Observable<any[]>;
  data: any;
  loading: boolean;

  constructor(private componentService: ComponentService) { }

  // Get all courses
  ngOnInit() {
    //@ts-ignore
    this.components = this.componentService.getAllComponents().subscribe(({ data, loading }) => {
      this.loading = loading;
      this.data = data;
    });
  }

  goToCreateForm() {
    console.log('Not implemented');
  }

}
