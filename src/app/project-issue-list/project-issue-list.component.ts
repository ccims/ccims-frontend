import { Component, OnInit } from '@angular/core';
import {IssueListComponent} from '../issue-list/issue-list.component';
@Component({
  selector: 'app-project-issue-list',
  templateUrl: './project-issue-list.component.html',
  styleUrls: ['./project-issue-list.component.scss']
})
export class ProjectIssueListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
