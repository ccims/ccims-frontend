import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueStoreService } from '@app/data/issue/issue-store.service';
import { GetIssueQuery, AddIssueCommentInput, Issue, CloseIssueInput, ReopenIssueInput, RenameIssueTitleInput} from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { IssueListComponent } from '@app/issue-list/issue-list.component';
import { LabelStoreService } from '@app/data/label/label-store.service';
import { ProjectStoreService } from '@app/data/project/project-store.service';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
/**
 * This component prevents detailed information about an issue
 * and provides functions to change properties of an issue like
 * labels, body, assignees, title
 */
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
  public editBody = false;
  public projectComponents;
  constructor(private labelStoreService: LabelStoreService, public activatedRoute: ActivatedRoute,
              private issueStoreService: IssueStoreService, private projectStoreService: ProjectStoreService) { }


  /**
   * requests the issue from the database
   * request the project information for an issue
   */
  ngOnInit(): void {
    this.issueId = this.activatedRoute.snapshot.paramMap.get('issueId');
    this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
    this.issue$.subscribe(issue => {
      issue.node.labels.nodes.forEach(element => this.labelList.push(element.id));

      // adding the component name to the issue information
      this.projectStoreService.getFullProject(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(project=>{
        this.projectComponents = project.node.components.edges;
        let extended: ExtendedIssue;
        issue.node.linksToIssues.nodes.forEach(linkedIssue=> {
          extended = linkedIssue;
          extended.componentName = this.getComponentName(extended.id);
        });
        this.issue = issue;
      });
    });
  }
  /**
   * Determines the name of the component which the issue belongs to
   * @param id issueID
   * @returns compName component name
   */
  public getComponentName(id: string): string{
    let found = false;
    let compName = '';
    this.projectComponents.forEach(comp => {
      if(found){return;}
      comp.node.issues.nodes.forEach(element => {
        if (element.id === id){
          compName = comp.node.name;
          found = true;
          return;
        }
      });
    });
    if(found){
      return compName;
    }else{return null;}

  }
  public getComponentId(id: string): string{
    let found = false;
    let compId = '';
    this.projectComponents.forEach(comp => {
      if(found){return;}
      comp.node.issues.nodes.forEach(element => {
        if (element.id === id){
          compId = comp.node.id;
          found = true;
          return;
        }
      });
    });
    if(found){


      return compId;
    }else{return null;}

  }
  public lightOrDark(color){
    return this.labelStoreService.lightOrDark(color);
  }

  /**
   * Adds a comment to an issue
   * @param commentBody comment string the user typed in
   */
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
  /**
   * opens the settings window (IssueSettingsContainer) for a specific attribute depending on the mouse position
   * sets the state of the issue to edit-mode
   * @param e mouse event
   * @param attributeToEdit editable property represented as string
   */
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
  /**
   * This method is triggered when the user clicks outside of a open IssueSettingsContainer
   * @param $event closing event comming from the IssueSettingsContainer. The event contains the information
   *               whether the user changed some properties
   */
  public receiveMessage($event){
    if ($event === true && this.editIssue){
      this.editIssue = false;
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
      this.issue = issue;
      this.labelList = [];
      issue.node.labels.nodes.forEach(element => this.labelList.push(element.id));
    });
    }
    if ($event === false && this.editIssue){
      this.editIssue = false;
    }

  }

  // resetst the issue edit state
  public closeSettings(){
    if (this.editIssue){this.editIssue = false; }

  }

  /**
   * closes the issue and refreshes the issue information
   */
  public closeIssue(){
    const closeIssueInput: CloseIssueInput = {
      issue: this.issueId
    };
    this.issueStoreService.close(closeIssueInput).subscribe(data => {
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
      this.issue = issue;
    });
    });
  }
  /**
   * reopens a closed issue
   */
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
  public EditIssueBody(body:string){
    // TODO mutation for changing the issue body

  }
  /**
   * Changes the issue title
   * @param save is a boolean if true saves the new title to the database. If it is false edit title is no longer active
   */
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
// Defines an extended type of an issue including the component name
export interface ExtendedIssue extends Pick<Issue, "id" | "title">{
    componentName?: string;
}
