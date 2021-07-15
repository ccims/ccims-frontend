import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IssueStoreService} from '@app/data/issue/issue-store.service';
import {
  AddIssueCommentInput,
  CloseIssueInput,
  DeleteIssueCommentInput,
  GetIssueQuery,
  Issue,
  RenameIssueTitleInput,
  ReopenIssueInput
} from 'src/generated/graphql';
import {Observable} from 'rxjs';
import {LabelStoreService} from '@app/data/label/label-store.service';
import {ProjectStoreService} from '@app/data/project/project-store.service';
import {SelectionType} from '@app/issue-settings-container/issue-settings-container.component';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
/**
 * This component provides detailed information about an issue.
 * It also lets the user edit properties of an issue.
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
  public attributeToEdit: SelectionType = SelectionType.Labels;
  public labelList = [];
  public editTitle = false;
  public editBody = false;
  public projectComponents;
  public selectionType = SelectionType;

  constructor(
    private labelStoreService: LabelStoreService,
    public activatedRoute: ActivatedRoute,
    private issueStoreService: IssueStoreService,
    private projectStoreService: ProjectStoreService) {
  }

  ngOnInit(): void {

    // request current issue
    this.requestIssue();

    // request project info for current issue
    this.requestProjectInformation();

  }

  pluralize(n: number, singular: string): string {
    return (n === 1 ? n + ' ' + singular : n + ' ' + singular + 's');
  }

  formatTime(time: string): string {
    return new Date(Date.parse(time)).toString();
  }

  formatTimeDifference(dateString: string): string {
    const pastTimeMs = Date.parse(dateString);
    const nowMs = Date.now();
    const now = new Date(nowMs);
    const pastTime = new Date(pastTimeMs);

    const months = (now.getMonth() - pastTime.getMonth()) + (now.getFullYear() - pastTime.getFullYear()) * 12;
    const minutes = Math.round((nowMs - pastTimeMs) / 1000 / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (months >= 12) {
      return this.pluralize(months / 12, 'year') + ' ago';
    } else if (days >= 31) {
      return this.pluralize(months, 'month') + ' ago';
    } else if (hours >= 24) {
      return this.pluralize(days, 'day') + ' ago';
    } else if (minutes >= 60) {
      return this.pluralize(hours, 'hour') + ' ago';
    } else if (minutes >= 1) {
      return this.pluralize(minutes, 'minute') + ' ago';
    }

    return 'just now';
  }

  formatIssueOpenTime(): string {
    if (this.issue) {
      return this.formatTimeDifference(this.issue.node.createdAt);
    }
    return '?';
  }

  /**
   * Requests the current issue.
   */
  private requestIssue(): void {

    // current issue id
    this.issueId = this.activatedRoute.snapshot.paramMap.get('issueId');

    // current issue
    this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
  }

  /**
   * Requests project information for the current issue.
   *
   * TODO: Currently, the method retrieves only the component name
   * the current issue belongs to.
   * It must also retrieve an interface name in case no component name is found.
   *
   * TODO: Implement a method that handles the case in which
   * no component name or interface name is found for the current issue.
   */
  private requestProjectInformation(): void {
    this.issue$.subscribe(issue => {

      // retrieves overall issue information?
      issue.node.labels.nodes.forEach(element => this.labelList.push(element.id));

      // retrieves the component name (the current issue belongs to)
      this.projectStoreService.getFullProject(this.activatedRoute.snapshot.paramMap.get('id'))
        .subscribe(project => {

          // project components
          this.projectComponents = project.node.components.edges;

          // extended type of issue that includes the component name
          let extended: ExtendedIssue;

          issue.node.linksToIssues.nodes.forEach(linkedIssue => {

            extended = linkedIssue;

            // name of the component (the current issue belongs to)
            extended.componentName = this.getComponentName(extended.id);
          });

          // updates information for the current issue
          this.issue = issue;
        });

      // retrieves the interface name (the current issue belongs to)
      //TODO: Implement a method that retrieves the interface name.
    });
  }

  /**
   * Returns the name of the component the current issue belongs to.
   *
   * @param {string} id - The id of the current issue.
   * @returns {string} Name of the component the current issue belongs to.
   */
  public getComponentName(id: string): string {

    // by default: component name not found, return value is empty
    let found = false;
    let componentName = '';

    // goes through all the components of the project
    this.projectComponents.forEach(component => {

      // case: component name found => continue iterating
      if (found) {
        return;
      }

      // goes through all the issues of each component
      component.node.issues.nodes.forEach(issue => {

        // case: component issue matches the current issue => update component name
        if (issue.id === id) {
          componentName = component.node.name;
          found = true;
          return;
        }
      });
    });

    // case: component name found => return component name
    if (found) {
      return componentName;
    }
    // case: component name not found => return null
    else {
      return null;
    }
  }

  /**
   * Returns the id of the component the current issue belongs to.
   *
   * @param {string} id - The id of the current issue.
   * @returns {string} Id of the component the current issue belongs to.
   */
  public getComponentId(id: string): string {

    // by default: component id not found, return value is empty
    let found = false;
    let componentId = '';

    // goes through all the components of the project
    this.projectComponents.forEach(component => {

      // case: component name found => continue iterating
      if (found) {
        return;
      }

      // goes through all the issues of each component
      component.node.issues.nodes.forEach(issue => {
        
        // case: component issue matches the current issue => update component id
        if (issue.id === id) {
          componentId = component.node.id;
          found = true;
          return;
        }
      });
    });

    // case: component id found => return component id
    if (found) {
      return componentId;
    }
    // case: component id not found => return null
    else {
      return null;
    }
  }

  /**
   * Determines whether the background color is light or dark.
   *
   * @param {any} color - Background color of a label.
   * @returns {any} White if the background color is dark, black if the background color is light.
   *
   * TODO: Better document the functionality of this method
   * and its connection to LabelStoreService.lightOrDark().
   */
  public lightOrDark(color) {
    return this.labelStoreService.lightOrDark(color);
  }

  /**
   * Adds a comment to the current issue.
   *
   * @param {string} commentBody - Comment to be added.
   */
  public commentIssue(commentBody: string): void {

    // input for the addIssueComment mutation
    const mutationInput: AddIssueCommentInput = {
      issue: this.issueId,
      body: commentBody
    };

    // calls the addIssueComment mutation
    this.issueStoreService.commentIssue(mutationInput).subscribe(data => {
      console.log(data);
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
        this.issue = issue;
      });
    });
  }

  /**
   * Deletes an issue comment by using its id.
   *
   * @param  {string} id - Id of the issue comment to be deleted.
   * 
   * TODO: Implement the deleteIssueComment mutation that's to be used 
   * to delete an issue comment (in ccims-frontend and in ccims-backed-gql).
   */
  public deleteComment(id: string) {

    // tests whether comment id is delivered correctly
    this.issue.node.issueComments.nodes.forEach(comment => {
      if (comment.id == id) {
        // comment to be deleted found
        alert('Comment to be deleted has id: ' + id);
      }
    });

    // input for the deleteIssueComment mutation
    const mutationInput: DeleteIssueCommentInput = {
      issueComment: id
    };

    // calls the deleteIssueComment mutation
    this.issueStoreService.deleteComment(mutationInput).subscribe(data => {
      console.log(data);
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
        this.issue = issue;
      });
    });
  }

  /**
   * Opens the settings window (IssueSettingsContainer)
   * for a specific attribute depending on the mouse position.
   * Sets the state of the issue to edit-mode.
   *
   * @param {any} e - Mouse event.
   * @param {SelectionType} attributeToEdit - Editable property represented as string.
   */
  public openSettings(e: any, attributeToEdit: SelectionType): void {
    const rect = document.getElementById('sidenav');
    const rect2 = document.getElementById('toolbar');
    let y;
    let x;
    if (rect.style.visibility === 'hidden') {
      x = e.clientX;
    } else {
      x = e.clientX - rect.offsetWidth - 200;
    }
    y = e.clientY - rect2.offsetHeight;
    this.mouseX = x.toString() + 'px';
    this.mouseY = y.toString() + 'px';
    this.attributeToEdit = attributeToEdit;
    this.editIssue = true;
  }

  /**
   * This method is triggered when the user clicks
   * outside of an open IssueSettingsContainer.
   *
   * @param {any} $event Closing event comming from the IssueSettingsContainer.
   * The event contains information whether the user changed some properties.
   */
  public receiveMessage($event: any): void {
    if ($event === true && this.editIssue) {
      this.editIssue = false;
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
        this.issue = issue;
        this.labelList = [];
        issue.node.labels.nodes.forEach(element => this.labelList.push(element.id));
      });
    }
    if ($event === false && this.editIssue) {
      this.editIssue = false;
    }
  }

  /**
   * Resets the edit state of the current issue.
   */
  public closeSettings(): void {
    if (this.editIssue) {
      this.editIssue = false;
    }
  }

  /**
   * Closes the current issue and refreshes its information.
   */
  public closeIssue(): void {
    
    // input for the closeIssue mutation
    const closeIssueInput: CloseIssueInput = {
      issue: this.issueId
    };

    // calsl the closeIssue mutation
    this.issueStoreService.close(closeIssueInput).subscribe(data => {
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
        this.issue = issue;
      });
    });
  }

  /**
   * Reopens the closed current issue.
   */
  public reopenIssue(): void {

    // input for the reopenIssueInput mutation
    const reopenIssueInput: ReopenIssueInput = {
      issue: this.issueId
    };

    // calls the reopenIssueInput mutation
    this.issueStoreService.reopen(reopenIssueInput).subscribe(data => {
      console.log(data);
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
        this.issue = issue;
      });
    });
  }

  /**
   * Edits the description of the current issue.
   *
   * @param {string} body - The new description of the current issue.
   * 
   * TODO: Implement the edittIssueBody mutation that's to be used 
   * to edit the issue's description (in ccims-frontend and in ccims-backed-gql).
   */
  public editIssueBody(body: string): void {
    // ...
  }

  /**
   * Edits the title of the current issue.
   *
   * @param {boolean} save - Boolean that indicates whether to save the new title.
   */
  public editIssueTitle(save?: boolean): void {

    // case: the new title is to be saved
    if (save) {
      
      // input for the renameIssueTitle mutation
      const nameIssueInput: RenameIssueTitleInput = {
        issue: this.issueId,
        newTitle: this.inputTitle.nativeElement.value
      };

      // calls the renameIssueTitle mutation
      this.issueStoreService.rename(nameIssueInput).subscribe(data => {
        console.log(data);
        this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
        this.issue$.subscribe(issue => {
          this.issue = issue;
        });
      });
    }

    // case: the new title is not to be saved
    this.editTitle = !this.editTitle;
  }

}

// defines an extended type of an issue that includes the component name
// TODO: include the interface name (if needed)
export interface ExtendedIssue extends Pick<Issue, 'id' | 'title'> {
  componentName?: string;
}
