import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'src/generated/graphql-dgql';
import { Subscription } from 'rxjs';
import { encodeNodeId, NodeType } from '@app/data-dgql/id';
import { DataNode } from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import { TimeFormatter } from '@app/issue-detail/TimeFormatter';
import { FormControl, Validators } from '@angular/forms';

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
  public projectId: string;
  public issueId: string;

  public editTitle = false;
  public savingTitle = false;
  @ViewChild('titleInput') inputTitle: ElementRef;

  // Provides functions for time formatting
  public timeFormatter = new TimeFormatter();

  // TODO: replace this with issue$.current?.userCanEditIssue in HTML once that works
  public userCanEditIssue = true;

  public issue$: DataNode<Issue>;
  public issueSub: Subscription;

  constructor(private dataService: DataService, 
              public activatedRoute: ActivatedRoute
  ) {
  }

  // form controls for the form fields
  category = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id');
    this.issueId = this.activatedRoute.snapshot.paramMap.get('issueId');
    const issueNodeId = encodeNodeId({ type: NodeType.Issue, id: this.issueId });

    this.issue$ = this.dataService.getNode(issueNodeId);
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
   * Begins the editing process in which:
   * 1) the issue title and 
   * 2) the issue category can be changed.
   */
  beginEditing() {

    // marks the issue as editable
    this.editTitle = true;

    // sets up the issue category
    this.issue$.dataAsPromise().then(data =>
      {
        this.category.setValue(data.category);
      });
  }

  /**
   * Finishes the editing process in which:
   * 1) the issue title and 
   * 2) the issue category can be changed.
   * @param save - Boolean that indicates whether to save the new title.
   */
  public finishEditing(save?: boolean): void {

    // case: the new title and category will be saved
    if (save) {

      // saves the new title
      this.savingTitle = true;
      this.dataService.mutations.renameIssueTitle(
        Math.random().toString(),
        this.issue$.id,
        this.inputTitle.nativeElement.value
      ).then(() => {
        // only leave edit mode if successful
        this.editTitle = false;
      }).finally(() => {
        this.savingTitle = false;
      });

      // saves the new category
      console.log("The selected category: " + this.category.value);
      this.dataService.mutations.changeIssueCategory(
        Math.random().toString(),
        this.issue$.id,
        this.category.value
      );
    } 
    
    // case: the new title and category won't be saved
    else {
      this.editTitle = !this.editTitle;
    }
  }
}
