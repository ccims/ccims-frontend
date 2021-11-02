import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { CreateIssueDialogComponent } from '@app/dialogs/create-issue-dialog/create-issue-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import DataService from '@app/data-dgql';
import { ListId, ListType, NodeId, NodeType } from '@app/data-dgql/id';
import { DataList, DataNode } from '@app/data-dgql/query';
import { Component as IComponent, ComponentInterface, Issue, IssueCategory, IssueFilter } from '../../generated/graphql-dgql';

/**
 * This component shows all issues for a given component / interface.
 * It lets the user 1) filter through all the issues,
 * 2) create new issues and also 3) sort all issues in a separate table view.
 */
@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})
export class IssueListComponent implements OnInit, OnDestroy {
  @Input() listId: ListId;
  @Input() projectId: string;
  public queryParamFilter = '';
  public list$?: DataList<Issue, IssueFilter>;
  private listSub?: Subscription;

  // component that is observed
  public component$?: DataNode<IComponent>;
  private componentSub?: Subscription;

  // interface that is observed
  public componentInterface$?: DataNode<ComponentInterface>;
  private componentInterfaceSub?: Subscription;

  // provider of the interface that is observed
  public componentInterfaceProvider: NodeId;

  // determines whether one can create new issues from a given component / interface page
  // FIXME remove and use proper logic instead
  public canCreateNewIssue = false;

  public allLabelsList: ListId;

  dataSource: MatTableDataSource<any>;
  columnsToDisplay = ['title', 'author', 'assignees', 'labels', 'category'];
  searchIssuesDataArray: any;
  validationFilter = new FormControl('');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private dataService: DataService
  ) {
  }

  /**
   * Determines issue icon depending on the given category.
   * @param issue - The given issue.
   * @returns Issue icon id.
   */
  formatCategoryIcon(issue: Issue): string {
    switch (issue.category) {
      case IssueCategory.Bug:
        return issue.isOpen ? 'issue-bug' : 'issue-bug-closed';
      case IssueCategory.FeatureRequest:
        return issue.isOpen ? 'issue-feature' : 'issue-feature-closed';
      case IssueCategory.Unclassified:
        return issue.isOpen ? 'issue-uncategorized' : 'issue-uncategorized-closed';
    }
  }

  /**
   * Determines issue description depending on the given categiry.
   * @param category - The given issue category.
   * @returns Issue description.
   */
  formatCategoryDescription(category: IssueCategory): string {
    switch (category) {
      case IssueCategory.Bug:
        return 'Bug';
      case IssueCategory.FeatureRequest:
        return 'Feature request';
      case IssueCategory.Unclassified:
        return 'Unclassified';
    }
  }

  ngOnInit(): void {

    this.allLabelsList = {
      node: this.listId.node,
      type: ListType.Labels
    };

    if (this.listId.node.type === NodeType.Component) {
      this.canCreateNewIssue = true;
      this.component$ = this.dataService.getNode(this.listId.node);
      this.componentSub = this.component$.subscribe();
    } else if (this.listId.node.type === NodeType.ComponentInterface) {
      this.canCreateNewIssue = true;
      this.componentInterface$ = this.dataService.getNode(this.listId.node);
      this.componentInterfaceSub = this.componentInterface$.subscribe();

      this.componentInterface$.dataAsPromise().then(data => {
        this.componentInterfaceProvider = { type: NodeType.Component, id: data.component.id };
      });
    }

    // FIXME: a hack to fix the labels list on interfaces
    if (this.listId.node.type === NodeType.ComponentInterface) {
      const interfaceNode = this.dataService.getNode<ComponentInterface>(this.listId.node);
      interfaceNode.dataAsPromise().then(data => {
        this.allLabelsList = {
          node: { type: NodeType.Component, id: data.component.id },
          type: ListType.Labels
        };
      });
    }

    this.list$ = this.dataService.getList(this.listId);
    this.list$.count = 25;
    this.listSub = this.list$.subscribe(data => {
      this.dataSource = new MatTableDataSource<any>(data ? [...data.values()] : []);
      this.sort.sort(({ id: 'category', start: 'asc' }) as MatSortable);
      this.dataSource.sort = this.sort;
      // FIXME use bespoke pagination/sorting/filtering
      // this.dataSource.paginator = this.paginator;
      this.dataSource.filter = this.getQueryParamFilter();
      this.validationFilter.setValue(this.getQueryParamFilter());
      this.prepareIssueArray();
    });
  }

  ngOnDestroy() {
    this.listSub.unsubscribe();
    this.componentSub?.unsubscribe();
    this.componentInterfaceSub?.unsubscribe();
  }

  /**
   * Gets the query param filter.
   * If it is set, the issue list shows only issues that match the given keyword.
   * Otherwise all issues are displayed.
   */
  private getQueryParamFilter(): string {
    let returnedFilter = '';
    this.activatedRoute.queryParams.subscribe(
      params => {

        // case: query param filter is set
        // => shows only matching issues
        if (params.filter) {
          this.queryParamFilter = params.filter;
          returnedFilter = params.filter;
        }

          // case: query param filter is not set
        // => shows all issues
        else {
          returnedFilter = '';
        }
      });
    return returnedFilter;
  }

  /**
   * Applies a given filter.
   * @param filter - Given filter to be applied.
   */
  applyFilter(filter: IssueFilter) {
    this.list$.filter = filter;
  }

  /**
   * Gets activated when an issue is clicked.
   * Navigates the user to the corresponding issue page.
   * @param row - Issue that is clicked.
   */
  clickedOnRow(row: any) {
    this.router.navigate(['/projects', this.projectId, 'issues', row.id]);
  }

  /**
   * Prepares the issue array for the filter function.
   * For each issue a search string is defined.
   * The search string contains assignees, labels, and the author.
   * The filter funcion can search inside the string for keywords matching the given search string.
   */
  private prepareIssueArray() {

    // FIXME use API search
    if (!this.list$.hasData) {
      return;
    }
    this.searchIssuesDataArray = [...this.list$.current.values()];
    for (const issue of this.searchIssuesDataArray) {
      let additionalSearchString = '';
      issue.assigneesString = '';
      issue.labelsString = '';

      // adds all assignees
      for (const assignee of issue.assignees.nodes) {
        additionalSearchString += ' ' + assignee.displayName;
        issue.assigneesString += ' ' + assignee.displayName;
      }

      // adds all labels
      for (const label of issue.labels.nodes) {
        additionalSearchString += ' ' + label.name;
        issue.labelsString += ' ' + label.name;
      }

      // adds the author
      additionalSearchString += ' ' + issue.createdBy.displayName;

      issue.search = additionalSearchString;
    }
  }

  /**
   * Opens a Create Issue dialog.
   * Also selects components and locations depending from which
   * Component / Interface page the Create Issue dialog was initiated.
   * ex. Interface I1 with Prvider Component C1 lead to an Interface Issue
   * with components: Component C1 and locations: Component C1, Interface I1
   */
  onAddClick() {

    // FIXME move functionality so that the component can be reusable as a list

    // case: node is a component
    if (this.listId.node.type === NodeType.Component) {
      this.dialog.open(CreateIssueDialogComponent,
        {
          data: {
            projectId: this.projectId,
            components: [this.component$.id]
          },
          width: '600px'
        });
    }

    // case: node is an interface
    else if (this.listId.node.type === NodeType.ComponentInterface) {
      this.dialog.open(CreateIssueDialogComponent,
        {
          data: {
            projectId: this.projectId,
            components: [this.componentInterfaceProvider],
            locations: [this.componentInterface$.id]
          },
          width: '600px'
        });
    }
  }

}

