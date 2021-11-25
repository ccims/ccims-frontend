import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'src/generated/graphql-dgql';
import { Subscription } from 'rxjs';
import { NodeType } from '@app/data-dgql/id';
import { DataNode } from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import { TimeFormatter } from '@app/issue-detail/time-formatter';
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
  // current project id
  public projectId: string;

  // current issue id
  public issueId: string;

  // mark whether the current issue is editable
  public issueEditable = false;

  // mark whether changes to the current issue are being saved,
  // used for the loading spinner of the Save button
  public savingChanges = false;

  // provides functions for time formatting
  public timeFormatter = new TimeFormatter();

  // FIXME: replace with issue$.current?.userCanEditIssue in HTML once that works
  public userCanEditIssue = true;

  public issue$: DataNode<Issue>;
  public issueSub: Subscription;

  // new title of the current issue
  @ViewChild('titleInput') inputTitle: ElementRef;

  // new category of the current issue
  category = new FormControl('', [Validators.required]);

  constructor(private dataService: DataService, public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id');
    this.issueId = this.activatedRoute.snapshot.paramMap.get('issueId');
    const issueNodeId = { type: NodeType.Issue, id: this.issueId };

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
    this.issueEditable = true;

    // sets up the issue category
    this.issue$.dataAsPromise().then((data) => {
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
    // case: the new changes are to be saved
    if (save) {
      // marks the saving process as started
      this.savingChanges = true;

      // saves all changes
      this.saveChanges();
    }

    // case: the new changes are not to be saved
    else {
      this.issueEditable = false;
    }
  }

  /**
   * Saves all changes to the current issue.
   */
  private saveChanges() {
    // 1) saves the new title
    this.dataService.mutations.renameIssueTitle(Math.random().toString(), this.issue$.id, this.inputTitle.nativeElement.value);

    // 2) saves the new category
    this.dataService.mutations
      .changeIssueCategory(Math.random().toString(), this.issue$.id, this.category.value)
      .then(() => {
        // marks the issue as uneditable
        this.issueEditable = false;
      })
      .finally(() => {
        // marks the saving process as finished
        this.savingChanges = false;
      });
  }
}
