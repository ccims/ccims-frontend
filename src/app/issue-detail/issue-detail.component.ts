import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueStoreService } from '@app/data/issue/issue-store.service';
import { GetIssueQuery } from 'src/generated/graphql';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent implements OnInit {
  public issueId: string;
  public issue: GetIssueQuery;
  public issue$: Observable<GetIssueQuery>;

  constructor(private activatedRoute: ActivatedRoute, private issueStoreService: IssueStoreService) { }

  ngOnInit(): void {
    this.issueId = this.activatedRoute.snapshot.paramMap.get('issueId');
    this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
    this.issue$.subscribe(issue => {
      this.issue = issue;
    });
  }

}
