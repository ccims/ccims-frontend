import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueStoreService } from '@app/data/issue/issue-store.service';
import { GetIssueQuery, AddIssueCommentInput, Issue, CloseIssueInput, ReopenIssueInput, RenameIssueTitleInput} from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { IssueListComponent } from '@app/issue-list/issue-list.component';
import { LabelStoreService } from '@app/data/label/label-store.service';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
export class IssueDetailComponent implements OnInit {
  @ViewChild('issueContainer') issueContainer: ElementRef;
  @ViewChild('titleInput') inputTitle: ElementRef;
  public issueId: string;
  public issue: GetIssueQuery;
  public issue$: Observable<GetIssueQuery>;
  public editMode: boolean;
  public editIssue: boolean;
  public mouseX = '00px';
  public mouseY = '00px';
  public attributeToEdit = 'start';
  public labelList = [];
  public editTitle = false;
  constructor(private labelStoreService: LabelStoreService, private activatedRoute: ActivatedRoute,
              private issueStoreService: IssueStoreService) { }

  ngOnInit(): void {
    this.issueId = this.activatedRoute.snapshot.paramMap.get('issueId');
    this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
    this.issue$.subscribe(issue => {
      issue.node.labels.nodes.forEach(element => this.labelList.push(element.id));
      this.issue = issue;

      console.log(issue);
    });
  }
  public lightOrDark(color){
    return this.labelStoreService.lightOrDark(color);
  }
  public commentIssue(commentBody: string){
    const mutationInput: AddIssueCommentInput = {
      issue: this.issueId,
      body: commentBody
    };
    this.issueStoreService.commentIssue(mutationInput).subscribe(data => {
      console.log(data);
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
      this.issue = issue;
    });
    });

  }
  public openSettings(e: any, attributeToEdit: string) {
    const rect = document.getElementById('sidenav');
    const rect2 = document.getElementById('toolbar');
    let y;
    let x;
    if (rect.style.visibility === 'hidden'){
         x = e.clientX;
      }else{
        x = e.clientX - rect.offsetWidth - 200;
      }
    y = e.clientY - rect2.offsetHeight;
    this.mouseX = x.toString() + 'px';
    this.mouseY = y.toString() + 'px';
    this.attributeToEdit = attributeToEdit;
    this.editIssue = true;
  }
  public receiveMessage($event){
    if ($event === true && this.editIssue){
      this.editIssue = false;
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
      this.issue = issue;
    });
    }
    if ($event === false && this.editIssue){
      this.editIssue = false;
    }

  }
  public closeSettings(){
    if (this.editIssue){this.editIssue = false; }

  }

  public closeIssue(){
    const closeIssueInput: CloseIssueInput = {
      issue: this.issueId
    };
    this.issueStoreService.close(closeIssueInput).subscribe(data => {
      console.log(data);
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
      this.issue = issue;
    });
    });
  }
  public reopenIssue(){
    const reopenIssueInput: ReopenIssueInput = {
      issue: this.issueId
    };
    this.issueStoreService.reopen(reopenIssueInput).subscribe(data => {
      console.log(data);
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
      this.issue = issue;
    });
    });
  }
  public editIssueTitle(save?: boolean){

      if (save){
        const nameIssueInput: RenameIssueTitleInput = {
          issue: this.issueId,
          newTitle: this.inputTitle.nativeElement.value
        };
        this.issueStoreService.rename(nameIssueInput).subscribe(data => {
          console.log(data);
          this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
          this.issue$.subscribe(issue => {
          this.issue = issue;
        });
        });
      }
      this.editTitle = !this.editTitle;


  }

}
