import { Component, Input } from '@angular/core';
import { Issue } from 'src/generated/graphql-dgql';
import { Router } from '@angular/router';

@Component({
  selector: 'app-issue-item',
  templateUrl: './issue-item.component.html',
  styleUrls: ['./issue-item.component.scss']
})
export class IssueItemComponent {
  @Input() projectId: string;
  @Input() issue: Issue;
  @Input() interactive = false;

  constructor(private router: Router) {}

  getIssueLink() {
    return this.router.serializeUrl(this.router.createUrlTree(
      ['/projects', this.projectId, 'issues', this.issue.id]
    ));
  }
}
