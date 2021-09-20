import { Component, Input } from '@angular/core';
import { Issue, IssueCategory } from 'src/generated/graphql-dgql';

/**
 * This component automatically displays the appropriate mat-icon for the given issue.
 */
@Component({
  selector: 'app-issue-icon',
  templateUrl: './issue-icon.component.html',
  styleUrls: ['./issue-icon.component.scss']
})
export class IssueIconComponent {
  @Input() issue: Issue;

  getIconName() {
    const category = this.issue.category === IssueCategory.Bug
      ? 'bug'
      : this.issue.category === IssueCategory.FeatureRequest
      ? 'feature'
      : 'uncategorized';
    const closed = this.issue.isOpen ? null : '-closed';

    const hasIn = this.issue.linkedByIssues?.totalCount;
    const hasOut = this.issue.linksToIssues?.totalCount;
    const edgeType = (hasIn ? 'in' : '') + (hasOut ? 'out' : '');

    return ['issue-', category, closed, edgeType && '-', edgeType].filter(part => part).join('');
  }

  getIconLabel() {
    const category = this.issue.category === IssueCategory.Bug ? 'bug'
      : this.issue.category === IssueCategory.FeatureRequest ? 'feature' : 'issue';
    return this.issue.isOpen ? `Open ${category}` : `Closed ${category}`;
  }
}
