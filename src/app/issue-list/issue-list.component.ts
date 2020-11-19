import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { GetComponentQuery, GetInterfaceQuery, Issue } from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AfterViewInit } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material/sort';
import { CreateIssueDialogComponent } from '@app/dialogs/create-issue-dialog/create-issue-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InterfaceStoreService } from '@app/data/interface/interface-store.service';
import { FormControl } from '@angular/forms';
import { LabelStoreService } from '@app/data/label/label-store.service';
@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})
export class IssueListComponent implements OnInit {
  @Input() parentCaller: string;
  public queryParamFilter = '';
  public component$?: Observable<GetComponentQuery>;
  private component?: GetComponentQuery;
  private componentId?: string;
  private interface?: GetInterfaceQuery;
  public interface$?: Observable<GetInterfaceQuery>;
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ['title', 'author', 'assignees', 'labels', 'category'];
  searchIssuesDataArray: any;
  validationFilter = new FormControl('');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private labelStoreService: LabelStoreService, private activatedRoute: ActivatedRoute, private dialog: MatDialog, private route: ActivatedRoute,
              private componentStoreService: ComponentStoreService,
              private router: Router, private interfaceStoreService: InterfaceStoreService) {

  }

  ngOnInit(): void {
    if (this.parentCaller.match('component')){
      this.componentId = this.route.snapshot.paramMap.get('componentId');
      this.component$ = this.componentStoreService.getFullComponent(this.componentId);
      this.component$.subscribe(component => {
      this.component = component;
      this.prepareIssueArray();
      this.dataSource = new MatTableDataSource<any>(component.node.issues.nodes);
      this.sort.sort(({ id: 'category', start: 'asc'}) as MatSortable);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filter = this.getQueryParamFilter();
      this.validationFilter.setValue(this.getQueryParamFilter());

    });
    }else{
      this.componentId = this.route.snapshot.paramMap.get('interfaceId');

      this.interface$ = this.interfaceStoreService.getInterface(this.componentId);
      this.interface$.subscribe(componentInterface => {
        this.interface = componentInterface;
        this.prepareIssueArray();
        this.dataSource = new MatTableDataSource<any>(componentInterface.node.issuesOnLocation.nodes);
        this.sort.sort(({ id: 'category', start: 'asc'}) as MatSortable);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filter = this.getQueryParamFilter();
        this.validationFilter.setValue(this.getQueryParamFilter());
      });
    }


  }
  private getQueryParamFilter(): string{
    let returnedFilter = ''
    this.activatedRoute.queryParams.subscribe(
      params => {
                 if (params.filter){
                    this.queryParamFilter = params.filter;
                    returnedFilter = params.filter;
                  }else{
                    returnedFilter = '';
                    }
    });
    return returnedFilter;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  clickedOnRow(row: any) {
    // route to issue details

    this.router.navigate(['issue', row.id], {relativeTo: this.route});
  }
  private prepareIssueArray(){
    if (this.parentCaller.match('component')){
      this.searchIssuesDataArray = Object.assign([], this.component.node.issues.nodes);
    }else{
      this.searchIssuesDataArray = Object.assign([], this.interface.node.issuesOnLocation.nodes);
    }
    for (const issue of this.searchIssuesDataArray){
      let additionalSearchString = '';
      issue.assigneesString = '';
      issue.labelsString = '';
      // add all assignees
      for (const assignee of issue.assignees.nodes){
        additionalSearchString += ' ' + assignee.displayName;
        issue.assigneesString += ' ' + assignee.displayName;
      }
      // add all labels
      for (const label of issue.labels.nodes){
        additionalSearchString += ' ' + label.name;
        issue.labelsString += ' ' + label.name;
      }
      // add author
      additionalSearchString += ' ' + issue.createdBy.displayName;
      issue.search = additionalSearchString;
    }
  }
  onAddClick() {
    const createIssueDialogRef = this.dialog.open(CreateIssueDialogComponent,
      { data: { user: 'Component', name: this.component.node.name, id: this.componentId,
      component: this.component , projectId: this.getProjectId()} });
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
  private getProjectId(): string {
    return this.route.snapshot.paramMap.get('id');
  }
  public lightOrDark(color){
    return this.labelStoreService.lightOrDark(color);
  }



}
