import { Component, Input } from '@angular/core';
import { IssueCategory } from '../../../generated/graphql-dgql';

@Component({
  selector: 'app-issue-category',
  templateUrl: './issue-category.component.html',
  styleUrls: ['./issue-category.component.scss']
})
export class IssueCategoryComponent {
  @Input() category: IssueCategory;
}
