import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { GetComponentQuery, Issue } from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AfterViewInit } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material/sort';
import { CreateIssueDialogComponent } from '@app/dialogs/create-issue-dialog/create-issue-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})
export class IssueListComponent implements OnInit {
  public component$: Observable<GetComponentQuery>;
  private component: GetComponentQuery;
  private componentId: string;
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ['title', 'author', 'assignees', 'labels', 'category'];
  searchIssuesDataArray: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private dialog: MatDialog, private route: ActivatedRoute, private componentStoreService: ComponentStoreService) {
    this.componentId = this.route.snapshot.paramMap.get('componentId');
    this.component$ = this.componentStoreService.getFullComponent(this.componentId);
    this.component$.subscribe(component => {
      this.component = component;
      this.prepareIssueArray();
      this.dataSource = new MatTableDataSource<any>(component.node.issues.nodes);
      this.sort.sort(({ id: 'category', start: 'asc'}) as MatSortable);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  clickedOnRow(row: any) {
    console.log(row);
    alert(row.body)
    console.log(this.dataSource);

    // route to issue details
  }
  private prepareIssueArray(){
    this.searchIssuesDataArray = Object.assign([], this.component.node.issues.nodes);
    for (const issue of this.searchIssuesDataArray){
      let additionalSearchString = '';
      issue.assigneesString = '';
      // add all assignees
      for (const assignee of issue.assignees.nodes){
        additionalSearchString += ' ' + assignee.displayName;
        issue.assigneesString += ' ' + assignee.displayName;
      }
      // add all labels
      for (const label of issue.labels.nodes){
        additionalSearchString += ' ' + label;
      }
      // add author
      additionalSearchString += ' ' + issue.createdBy.displayName;
      issue.search = additionalSearchString;
    }
  }
  onAddClick() {
    const createIssueDialogRef = this.dialog.open(CreateIssueDialogComponent,
      { data: { user: 'Component', name: this.component.node.name, id: this.componentId } });
    createIssueDialogRef.afterClosed().subscribe(issueData => {
        if (issueData){
          this.updateTable();
        }
        });
  }
  private updateTable(): void {
    this.component$ = this.componentStoreService.getFullComponent(this.componentId);
    this.component$.subscribe(component => {
      this.component = component;
      this.prepareIssueArray();
      this.dataSource = new MatTableDataSource<any>(component.node.issues.nodes);
      this.sort.sort(({ id: 'category', start: 'asc'}) as MatSortable);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }


}
