import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { GetComponentQuery, Issue } from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {AfterViewInit} from '@angular/core';
@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})
export class IssueListComponent implements OnInit {
  public component$: Observable<GetComponentQuery>;
  private component: GetComponentQuery;
  private componentId: string;
  dataSource;
  //columnsToDisplay = ['id', 'Title'];
   columnsToDisplay = ['title', 'author', 'assignees', 'labels', 'category'];
   example = [
     {title:"blatitle",createdBy:{displayName:"einautor"},assignees:{nodes:["eine","nocheiner"]},labels:{nodes:["bla","blaaasdasd"]},category:"BUG"},
     {title:"anderer Titel",createdBy:{displayName:"einautor"},assignees:{nodes:["eine","nocheiner"]},labels:{nodes:["bla","blaaasdasd"]},category:"BUG"},
     {title:"Nochwas anderes",createdBy:{displayName:"einautor"},assignees:{nodes:["eine","nocheiner"]},labels:{nodes:["bla","blaaasdasd"]},category:"BUG"}
   ]

   @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private componentStoreService: ComponentStoreService) {
    this.componentId = this.route.snapshot.paramMap.get('componentId');

    this.component$ = this.componentStoreService.getFullComponent(this.componentId);
    this.component$.subscribe(component => {
      this.component = component;
      this.dataSource = new MatTableDataSource<any>(this.component.node.issues.nodes);
      this.dataSource.paginator = this.paginator;
    });
   }

  ngOnInit(): void {

  }



  clickedOnRow(row: any) {
    console.log(row);


  }

}
