import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { GetComponentQuery, GetFullProjectGQL, GetFullProjectQuery, GetInterfaceQuery, Issue } from 'src/generated/graphql';
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
import { ProjectStoreService } from '@app/data/project/project-store.service';
/**
 * This component displays a sortable and filterable list of issues in a table view
 *
 */
@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})
export class IssueListComponent implements OnInit {
  @Input() parentCaller: string;
  @Input() componentId: string;
  public queryParamFilter = '';
  public component$?: Observable<GetComponentQuery>;
  private component?: GetComponentQuery;
  private interface?: GetInterfaceQuery;
  public interface$?: Observable<GetInterfaceQuery>;
  public project$?: Observable<GetFullProjectQuery>;
  public project?: GetFullProjectQuery;
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ['title', 'author', 'assignees', 'labels', 'category'];
  searchIssuesDataArray: any;
  validationFilter = new FormControl('');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private labelStoreService: LabelStoreService, private activatedRoute: ActivatedRoute, private dialog: MatDialog, private route: ActivatedRoute,
              private componentStoreService: ComponentStoreService,
              private router: Router, private interfaceStoreService: InterfaceStoreService,
              private projectStoreService: ProjectStoreService) {

  }

  ngOnInit(): void {
    // if the IssueListComponent is called from a component, only the issues they belong to the component
    // are displayed
    if (this.parentCaller.match('component')){
      if (!this.componentId) {
        this.componentId = this.route.snapshot.paramMap.get('componentId');
      }

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
    // if the IssueListComponent is called from the issues page of the Project
    // all issues blonging to the project are displayed
    }else if (this.parentCaller.match('project')){
      this.project$ = this.projectStoreService.getFullProject(this.route.snapshot.paramMap.get('id'));
      this.project$.subscribe(project => {
        this.project = project;
        this.prepareIssueArray();
        this.dataSource = new MatTableDataSource<any>(this.addIssuesPerComponent());
        this.sort.sort(({ id: 'category', start: 'asc'}) as MatSortable);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filter = this.getQueryParamFilter();
        this.validationFilter.setValue(this.getQueryParamFilter());

      });
    }
    // if the IssueListComponent is called from a interface, only the issues that are provided by the interface
    // are displayed
    else{
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
  // if the query param filter is set, the list shows only issues, that belong to the given keyword
  // if no filter is set, all issues are displayed
  private getQueryParamFilter(): string{
    let returnedFilter = '';
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
    // the url depends on the view, in which the issue list is embedded
    // parentCaller defindes the embedding view
    if (this.parentCaller.match('component')){
      this.router.navigate(['issue', row.id], {relativeTo: this.route});
    }else if(this.parentCaller.match('interface')){
      this.router.navigate(['component', this.interface.node.component.id, 'issue', row.id], {relativeTo: this.route }); }

    else{this.router.navigate(['component', row.parentComponent, 'issue', row.id], {relativeTo: this.route});}

    console.log(row);

  }

  /**
   * Prepares the issue array for the filter function
   * for each issue a search string is defined
   * the search string contains assignees, labels, and the author
   * the filter funcion can search inside the string for keywords matching the given search string
   */
  private prepareIssueArray(){
    if (this.parentCaller.match('component')){
      this.searchIssuesDataArray = Object.assign([], this.component.node.issues.nodes);
    }else if (this.parentCaller.match('project')){
      this.searchIssuesDataArray = Object.assign([], this.addIssuesPerComponent());
      }
    else{
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

  // opens a create issue dialog
  onAddClick() {
    const createIssueDialogRef = this.dialog.open(CreateIssueDialogComponent,
      { data: { user: 'Component', name: this.component.node.name, id: this.componentId,
      component: this.component , projectId: this.getProjectId()} });
    createIssueDialogRef.afterClosed().subscribe(issueData => {
        if (issueData){
          // after dialog is closed and a new issue is created, the table needs to be updated to show the new issue
          this.updateTable();
        }
        });
  }

  // updates the issue table after a new issue was created
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

  /**
   * determines the needed text color for a label
   * @param color background color of the label
   * @returns black or white depending on the param color
   */
  public lightOrDark(color){
    return this.labelStoreService.lightOrDark(color);
  }
  // add the corresponding component for each issue to the data just for this view
  private addIssuesPerComponent(){
    const returnedList = [];
    this.project.node.components.edges.forEach(component => {
      component.node.issues.nodes.forEach(issue => {
        const currentIssue: any = Object.assign({}, issue);
        currentIssue.parentComponent = component.node.id;
        returnedList.push(Object.assign({}, currentIssue));
      });

    });

    return returnedList;
  }



}

