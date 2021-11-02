import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListId, ListType, NodeType } from '@app/data-dgql/id';
import { DataNode } from '@app/data-dgql/query';
import { Project } from '../../generated/graphql-dgql';
import DataService from '@app/data-dgql';

@Component({
  selector: 'app-project-issue-list',
  templateUrl: './project-issue-list.component.html',
  styleUrls: ['./project-issue-list.component.scss']
})
export class ProjectIssueListComponent implements OnInit {
  public projectId: string;
  public project$: DataNode<Project>;
  public issueListId: ListId;
  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    const node = { type: NodeType.Project, id: this.projectId };
    this.project$ = this.dataService.getNode(node);
    this.issueListId = { node, type: ListType.Issues };
  }

}
