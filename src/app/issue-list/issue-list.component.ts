import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { GetComponentQuery, GetFullProjectQuery, GetInterfaceQuery } from 'src/generated/graphql';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { CreateIssueDialogComponent } from '@app/dialogs/create-issue-dialog/create-issue-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InterfaceStoreService } from '@app/data/interface/interface-store.service';
import { FormControl } from '@angular/forms';
import { LabelStoreService } from '@app/data/label/label-store.service';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import DataService from '@app/data-dgql';
import { decodeListId, NodeType } from '@app/data-dgql/id';
import { DataList } from '@app/data-dgql/query';
import { Issue } from '../../generated/graphql-dgql';

/**
 * This component displays a sortable and filterable list of issues in a table view
 *
 */
@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})
export class IssueListComponent implements OnInit, OnDestroy {
  @Input() listId: string;
  @Input() projectId?: string;
  public queryParamFilter = '';
  public list$?: DataList<Issue, unknown>;
  private listSub?: Subscription;
  public component$?: Observable<GetComponentQuery>;
  private component?: GetComponentQuery;
  private componentId?: string;
  public canCreateNewIssue = false; // TODO remove this; use proper logic
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ['title', 'author', 'assignees', 'labels', 'category'];
  searchIssuesDataArray: any;
  validationFilter = new FormControl('');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private labelStoreService: LabelStoreService, private activatedRoute: ActivatedRoute,
              private dialog: MatDialog, private route: ActivatedRoute,
              private componentStoreService: ComponentStoreService,
              private router: Router, private interfaceStoreService: InterfaceStoreService,
              private projectStoreService: ProjectStoreService,
              private dataService: DataService) {

  }

  ngOnInit(): void {
    // if the IssueListComponent is called from a component, only the issues they belong to the component
    // are displayed
    // FIXME temporary bindings - make better API
    if (decodeListId(this.listId).node.type === NodeType.Component) {
      this.componentId = decodeListId(this.listId).node.id;
      this.canCreateNewIssue = true;

      // FIXME remove this / needed for + button
      this.component$ = this.componentStoreService.getFullComponent(this.componentId);
      this.component$.subscribe(component => {
        this.component = component;
      });
    } else if (decodeListId(this.listId).node.type === NodeType.Interface) {
      this.componentId = decodeListId(this.listId).node.id;
    }

    this.list$ = this.dataService.getList(this.listId);
    this.list$.count = 99999; // FIXME api is incompatible with index-based pagination, what do we do?
    this.listSub = this.list$.subscribe(data => {
      this.dataSource = new MatTableDataSource<any>(data ? [...data.values()] : []);
      this.sort.sort(({ id: 'category', start: 'asc' }) as MatSortable);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filter = this.getQueryParamFilter();
      this.validationFilter.setValue(this.getQueryParamFilter());
      this.prepareIssueArray();
    });
  }

  ngOnDestroy() {
    this.listSub.unsubscribe();
  }

  // if the query param filter is set, the list shows only issues, that belong to the given keyword
  // if no filter is set, all issues are displayed
  private getQueryParamFilter(): string {
    let returnedFilter = '';
    this.activatedRoute.queryParams.subscribe(
      params => {
        if (params.filter) {
          this.queryParamFilter = params.filter;
          returnedFilter = params.filter;
        } else {
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
    // FIXME: this routing make no sense because issues may have multiple parents
    if (decodeListId(this.listId).node.type === NodeType.Component) {
      this.router.navigate(['issue', row.id], { relativeTo: this.route });
    } else if (decodeListId(this.listId).node.type === NodeType.Interface) {
      this.router.navigate(['component', this.componentId, 'issue', row.id], { relativeTo: this.route });
    } else {
      this.router.navigate(['component', row.parentComponent, 'issue', row.id], { relativeTo: this.route });
    }

    console.log(row);

  }

  /**
   * Prepares the issue array for the filter function
   * for each issue a search string is defined
   * the search string contains assignees, labels, and the author
   * the filter funcion can search inside the string for keywords matching the given search string
   */
  private prepareIssueArray() {
    // TODO use api search
    if (!this.list$.hasData) {
      return;
    }
    this.searchIssuesDataArray = [...this.list$.current.values()];
    for (const issue of this.searchIssuesDataArray) {
      let additionalSearchString = '';
      issue.assigneesString = '';
      issue.labelsString = '';
      // add all assignees
      for (const assignee of issue.assignees.nodes) {
        additionalSearchString += ' ' + assignee.displayName;
        issue.assigneesString += ' ' + assignee.displayName;
      }
      // add all labels
      for (const label of issue.labels.nodes) {
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
    // TODO don't do this here. we want this component to be reusable as a list
    const createIssueDialogRef = this.dialog.open(CreateIssueDialogComponent,
      {
        data: {
          user: 'Component', name: this.component.node.name, id: this.componentId,
          component: this.component, projectId: this.projectId
        }
      });
    createIssueDialogRef.afterClosed().subscribe(issueData => {
      if (issueData) {
        // after dialog is closed and a new issue is created, the table needs to be updated to show the new issue
        this.updateTable();
      }
    });
  }

  // updates the issue table after a new issue was created
  private updateTable(): void {
    this.list$.invalidate();
    this.list$.loadDebounced();
  }

  /**
   * determines the needed text color for a label
   * @param color background color of the label
   * @returns black or white depending on the param color
   */
  public lightOrDark(color) {
    return this.labelStoreService.lightOrDark(color);
  }

}

