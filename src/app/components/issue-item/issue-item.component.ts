import { Component, Input } from '@angular/core';
import { Issue } from 'src/generated/graphql-dgql';
import { Router } from '@angular/router';

/** This component displays an issue (for use in e.g. a list). */
@Component({
  selector: 'app-issue-item',
  templateUrl: './issue-item.component.html',
  styleUrls: ['./issue-item.component.scss'],
})
export class IssueItemComponent {
  /** The raw project ID. */
  @Input() projectId: string;
  /** The issue object that will be displayed. */
  @Input() issue: Issue;
  /** Whether to show extended info, such as the issue's locations. */
  @Input() extended = false;
  /** If true, this component will display a hyperlink. */
  @Input() interactive = false;

  constructor(private router: Router) {}

  /** Returns the link URL for the issue. */
  getIssueLink() {
    return this.router.serializeUrl(
      this.router.createUrlTree([
        '/projects',
        this.projectId,
        'issues',
        this.issue.id,
      ])
    );
  }
}
