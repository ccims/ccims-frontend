import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IssueStoreService } from '@app/data/issue/issue-store.service';
import {
  AddIssueCommentInput,
  CloseIssueInput,
  Issue,
  RenameIssueTitleInput,
  ReopenIssueInput, UpdateCommentInput
} from 'src/generated/graphql';
import { Subscription } from 'rxjs';
import { SelectionType } from '@app/issue-settings-container/issue-settings-container.component';
import { encodeNodeId, NodeType } from '@app/data-dgql/id';
import { DataNode } from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import { TimeFormatter } from '@app/issue-detail/TimeFormatter';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss']
})
/**
 * This component provides detailed information about an issue.
 * It also lets the user edit properties of an issue.
 */
export class IssueDetailComponent implements OnInit, OnDestroy {
  @ViewChild('issueContainer') issueContainer: ElementRef;
  @ViewChild('titleInput') inputTitle: ElementRef;
  public projectId: string;
  public issueId: string;
  public editMode: boolean;
  public editIssue: boolean;
  public attributeToEdit: SelectionType = SelectionType.Labels;
  public labelList = [];
  public editTitle = false;
  public editBody = false;
  public projectComponents;
  public selectionType = SelectionType;

  // Provides functions for time formatting
  public timeFormatter = new TimeFormatter();

  public userCanEditIssue = true;

  public issue$: DataNode<Issue>;
  public issueSub: Subscription;

  constructor(
    private dataService: DataService,
    public activatedRoute: ActivatedRoute,
    private issueStoreService: IssueStoreService) {
  }

  ngOnInit(): void {
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id');

    // request current issue
    this.requestIssue();

    // request project info for current issue
    this.requestProjectInformation();

    this.issue$ = this.dataService.getNode(encodeNodeId({ type: NodeType.Issue, id: this.issueId }));
    this.issueSub = this.issue$.subscribe();
  }

  ngOnDestroy() {
    this.issueSub.unsubscribe();
  }


  formatIssueOpenTime(): string {
    if (this.issue$.hasData) {
      return this.timeFormatter.formatTimeDifference(this.issue$.current.createdAt);
    }
  }

  /**
   * Requests the current issue.
   */
  private requestIssue(): void {

    // current issue id
    this.issueId = this.activatedRoute.snapshot.paramMap.get('issueId');

    // current issue
    // this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
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
    /*
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
          // this.issue = issue;
        });

      // retrieves the interface name (the current issue belongs to)
      //TODO: Implement a method that retrieves the interface name.
    }); */
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
    return 'meow';

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
      // TODO
    });
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
      // TODO
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
      // TODO
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
    const updateCommentInput: UpdateCommentInput = {
      comment: this.issueId,
      body
    };
    this.issueStoreService.updateComment(updateCommentInput).subscribe((data) => {
      console.log(data);
      // TODO
      /*
      this.issue$ = this.issueStoreService.getFullIssue(this.issueId);
      this.issue$.subscribe(issue => {
        this.issue = issue;
      });*/
    });

    this.editBody = !this.editBody;
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
        // TODO
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
