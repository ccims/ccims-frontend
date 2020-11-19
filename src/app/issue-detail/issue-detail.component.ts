import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueStoreService } from '@app/data/issue/issue-store.service';
import { GetIssueQuery, AddIssueCommentInput, Issue} from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { IssueListComponent } from '@app/issue-list/issue-list.component';
import { LabelStoreService } from '@app/data/label/label-store.service';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent implements OnInit {
  public issueId: string;
  public issue: GetIssueQuery;
  public issue$: Observable<GetIssueQuery>;
  public editMode: boolean;

  constructor(private labelStoreService: LabelStoreService, private activatedRoute: ActivatedRoute,
              private issueStoreService: IssueStoreService) { }

  ngOnInit(): void {
    this.issueId = this.activatedRoute.snapshot.paramMap.get('issueId');
    this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
    this.issue$.subscribe(issue => {
      this.issue = issue;
      console.log(issue);
    });
  }
  public lightOrDark(color){
    return this.labelStoreService.lightOrDark(color);
  }
  public commentIssue(commentBody: string){
    const mutationInput: AddIssueCommentInput ={
      issue:this.issueId,
      body:commentBody
    };
    this.issueStoreService.commentIssue(mutationInput).subscribe(data => {
      console.log(data);
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
    this.issue$.subscribe(issue => {
      this.issue = issue;
    });
    });

  }

}
