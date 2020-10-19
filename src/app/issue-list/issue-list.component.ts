import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { GetComponentQuery, Issue } from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})
export class IssueListComponent implements OnInit {
  public component$: Observable<GetComponentQuery>;
  private component: GetComponentQuery;
  private componentId: string;
  loading = true;
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ['title', 'author', 'assignees', 'labels', 'category'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private route: ActivatedRoute, private componentStoreService: ComponentStoreService) {
    this.componentId = this.route.snapshot.paramMap.get('componentId');
    this.component$ = this.componentStoreService.getFullComponent(this.componentId);
    this.component$.subscribe(component => {
      this.component = component;
      this.dataSource = new MatTableDataSource<any>(component.node.issues.nodes);
      this.dataSource.paginator = this.paginator;
      console.log(this.paginator);
      this.loading = false;
    });
  }

  ngOnInit(): void {
  }

  clickedOnRow(row: any) {
    console.log(row);

  }

}
