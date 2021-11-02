import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Issue } from 'src/generated/graphql-dgql';
import { Subscription } from 'rxjs';
import { encodeNodeId, NodeType } from '@app/data-dgql/id';
import { DataNode } from '@app/data-dgql/query';
import DataService from '@app/data-dgql';
import { TimeFormatter } from '@app/issue-detail/TimeFormatter';
import { FormControl, Validators } from '@angular/forms';
import { IssueCategory } from 'src/generated/graphql';

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

    // sets up the issue category
    this.issue$.dataAsPromise().then(data =>
      {
        this.category.setValue(data.category);
      });
  }

  ngOnDestroy() {
    this.issueSub.unsubscribe();
  }

  formatIssueOpenTime(): string {
    if (this.issue$.hasData) {
      return this.timeFormatter.formatTimeDifference(this.issue$.current.createdAt);
    }
  }

  beginEditingTitle() {
    this.editTitle = true;
  }

  /**
   * Edits the title of the current issue.
   *
   * @param save - Boolean that indicates whether to save the new title.
   */
  public finishEditingTitle(save?: boolean): void {
    // case: the new title is to be saved
    if (save) {
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
    } else {
      // case: the new title is not to be saved
      this.editTitle = !this.editTitle;
    }
  }
}
