import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListId, ListType, NodeType } from '@app/data-dgql/id';
import { DataNode } from '@app/data-dgql/query';
import { Project } from '../../generated/graphql-dgql';
import DataService from '@app/data-dgql';

/**
 * This component is displayed when clicking on issues on the sidebar.
 * It contains the IssueHeaderComponent and the IssueListComponent.
 */
@Component({
  selector: 'app-project-issue-list',
  templateUrl: './project-issue-list.component.html',
  styleUrls: ['./project-issue-list.component.scss']
})
export class ProjectIssueListComponent implements OnInit {

  public projectId: string;
  public project$: DataNode<Project>;
  /**
   * ID of the list which is shown in the IssueListComponent
   */
  public issueListId: ListId;

  /**
   * @param route for retrieving the id of the project through the url
   * @param dataService for connection to API
   */
  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    const node = { type: NodeType.Project, id: this.projectId };
    this.project$ = this.dataService.getNode(node);
    this.issueListId = { node, type: ListType.Issues };
  }

}
