import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { CreateIssueDialogComponent } from '@app/dialogs/create-issue-dialog/create-issue-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { LabelStoreService } from '@app/data/label/label-store.service';
import DataService from '@app/data-dgql';
import { decodeListId, encodeNodeId, NodeType } from '@app/data-dgql/id';
import { DataList, DataNode } from '@app/data-dgql/query';
import { Component as IComponent, Issue } from '../../generated/graphql-dgql';

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
  @Input() projectId: string;
  public queryParamFilter = '';
  public list$?: DataList<Issue, unknown>;
  private listSub?: Subscription;
  public component$?: DataNode<IComponent>;
  private componentSub?: Subscription;
  public canCreateNewIssue = false; // TODO remove this; use proper logic
  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ['title', 'author', 'assignees', 'labels', 'category'];
  searchIssuesDataArray: any;
  validationFilter = new FormControl('');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private labelStoreService: LabelStoreService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    if (decodeListId(this.listId).node.type === NodeType.Component) {
      // FIXME remove this / needed for + button
      this.canCreateNewIssue = true;
      this.component$ = this.dataService.getNode(encodeNodeId(decodeListId(this.listId).node));
      this.componentSub = this.component$.subscribe();
    }

    this.list$ = this.dataService.getList(this.listId);
    this.list$.count = 25;
    this.listSub = this.list$.subscribe(data => {
      this.dataSource = new MatTableDataSource<any>(data ? [...data.values()] : []);
      this.sort.sort(({ id: 'category', start: 'asc' }) as MatSortable);
      this.dataSource.sort = this.sort;
      // TODO use bespoke pagination/sorting/filtering
      // this.dataSource.paginator = this.paginator;
      this.dataSource.filter = this.getQueryParamFilter();
      this.validationFilter.setValue(this.getQueryParamFilter());
      this.prepareIssueArray();
    });
  }

  ngOnDestroy() {
    this.listSub.unsubscribe();
    this.componentSub.unsubscribe();
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
    this.router.navigate(['/projects', this.projectId, 'issues', row.id]);
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
          user: 'Component', name: this.component$.current.name, id: this.component$.current.id,
          component: this.component$.current, projectId: this.projectId
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

