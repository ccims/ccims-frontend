import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataNode, HydrateList } from '@app/data-dgql/query';
import {
  Component as QComponent,
  ComponentFilter,
  Issue, IssueFilter,
  IssueLocation,
  IssueLocationFilter,
  LabelFilter,
  User, UserFilter
} from '../../generated/graphql-dgql';
import { decodeNodeId, encodeListId, encodeNodeId, ListId, ListType, NodeId, NodeType, ROOT_NODE } from '@app/data-dgql/id';
import { SetMultiSource } from '@app/components/set-editor/set-editor-dialog.component';
import DataService from '@app/data-dgql';
import { MatDialog } from '@angular/material/dialog';
import { CreateLabelDialogComponent } from '@app/dialogs/create-label-dialog/create-label-dialog.component';

type MaybeLocalList<T> = ListId | T[];
export type LocalIssueData = {
  components: NodeId[],
  locations: NodeId[],
  labels: NodeId[],
  assignees: NodeId[],
  linksToIssues: NodeId[],
};

@Component({
  selector: 'app-issue-sidebar',
  templateUrl: './issue-sidebar.component.html',
  styleUrls: ['./issue-sidebar.component.scss'],
})
export class IssueSidebarComponent implements OnInit {
  @Input() issue$?: DataNode<Issue>;
  @Input() issueId?: string;
  @Input() projectId: string;

  /** Use this input to edit a local issue object. Used for creation. */
  @Input() localIssue: LocalIssueData;
  @Output() localIssueChange = new EventEmitter<LocalIssueData>();

  constructor(private dataService: DataService, private dialogService: MatDialog) {}

  public componentList: MaybeLocalList<string>;
  public locationList: MaybeLocalList<string>;
  public labelList: MaybeLocalList<string>;
  public linkedIssueList: MaybeLocalList<string>;
  public linkedByIssueList: MaybeLocalList<string>;
  public assigneeList: MaybeLocalList<string>;

  public allComponentsList: ListId;
  public allLocationsList: SetMultiSource;
  public allLabelsList: SetMultiSource;
  public allLinkedIssuesList: MaybeLocalList<string>;
  public allAssigneeCandidatesList: SetMultiSource;

  public componentListPromise?: Promise<HydrateList<QComponent>>;
  public locationListPromise?: Promise<HydrateList<IssueLocation>>;
  public labelListPromise?: Promise<HydrateList<Issue>>;
  public linkedIssueListPromise?: Promise<HydrateList<Issue>>;
  public linkedByIssueListPromise?: Promise<HydrateList<Issue>>;
  public assigneeListPromise?: Promise<HydrateList<User>>;

  ngOnInit() {
    if (this.issueId) {
      this.componentList = encodeListId({
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.Components
      });
      this.locationList = encodeListId({
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.IssueLocations
      });
      this.labelList = encodeListId({
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.Labels
      });
      this.assigneeList = encodeListId({
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.Assignees
      });
      this.linkedIssueList = encodeListId({
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.LinkedIssues
      });
      this.linkedByIssueList = encodeListId({
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.LinkedByIssues
      });
    } else if (this.localIssue) {
      this.componentList = this.localIssue.components;
      this.locationList = this.localIssue.locations;
      this.labelList = this.localIssue.labels;
      this.assigneeList = this.localIssue.assignees;
      this.linkedIssueList = this.localIssue.linksToIssues;
      this.linkedByIssueList = [];
    }

    const projectComponents = encodeListId({
      node: { type: NodeType.Project, id: this.projectId },
      type: ListType.Components
    });
    const projectInterfaces = encodeListId({
      node: { type: NodeType.Project, id: this.projectId },
      type: ListType.ComponentInterfaces
    });

    this.allComponentsList = projectComponents;
    this.allLocationsList = {
      staticSources: [projectComponents, projectInterfaces],
    };
    this.allLabelsList = {
      staticSources: this.issueId ? [encodeListId({
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.Labels
      })] : [],
      // source labels from labels of issue components
      sourceNodes: this.issueId ? encodeListId({
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.Components,
      }) : (this.localIssue.components || []),
      listFromNode: node => encodeListId({
        node: decodeNodeId(node),
        type: ListType.Labels
      })
    };
    this.allAssigneeCandidatesList = {
      staticSources: [
        this.issueId && encodeListId({
          node: { type: NodeType.Issue, id: this.issueId },
          type: ListType.Assignees
        }),
        encodeListId({
          node: ROOT_NODE,
          type: ListType.SearchUsers
        })
      ].filter(x => x),
    };
    this.allLinkedIssuesList = encodeListId({
      node: { type: NodeType.Project, id: this.projectId },
      type: ListType.Issues
    });

    this.componentListPromise = this.issue$?.dataAsPromise().then(data => data.components);
    this.locationListPromise = this.issue$?.dataAsPromise().then(data => data.locations);
    this.labelListPromise = this.issue$?.dataAsPromise().then(data => data.labels);
    this.assigneeListPromise = this.issue$?.dataAsPromise().then(data => data.assignees);
    this.linkedIssueListPromise = this.issue$?.dataAsPromise().then(data => data.linksToIssues);
    this.linkedByIssueListPromise = this.issue$?.dataAsPromise().then(data => data.linkedByIssues);
  }

  makeComponentFilter(search): ComponentFilter {
    return { name: search };
  }
  makeLocationFilter(search): IssueLocationFilter {
    return { name: search };
  }
  makeLabelFilter(search): LabelFilter {
    return { name: search };
  }
  makeIssueFilter(search): IssueFilter {
    return { title: search };
  }
  makeUserFilter(search): UserFilter {
    // FIXME: maybe you would want to search by display name?
    return { username: search };
  }

  applyLocalChangeset(key: keyof LocalIssueData, add: NodeId[], remove: NodeId[]) {
    const set = this.localIssue[key];

    for (const id of add) {
      if (!set.includes(id)) {
        set.push(id);
      }
    }
    for (const id of remove) {
      if (set.includes(id)) {
        set.splice(set.indexOf(id), 1);
      }
    }

    this.localIssueChange.emit(this.localIssue);
  }

  applyComponentChangeset = async (add: NodeId[], remove: NodeId[]) => {
    if (this.localIssue) {
      return this.applyLocalChangeset('components', add, remove);
    }

    const mutId = Math.random().toString();
    const issue = encodeNodeId({ type: NodeType.Issue, id: this.issueId });
    // FIXME: batch mutations?
    for (const id of add) {
      await this.dataService.mutations.addIssueComponent(mutId, issue, id);
    }
    for (const id of remove) {
      await this.dataService.mutations.removeIssueComponent(mutId, issue, id);
    }
  }
  applyLocationChangeset = async (add: NodeId[], remove: NodeId[]) => {
    if (this.localIssue) {
      return this.applyLocalChangeset('locations', add, remove);
    }

    const mutId = Math.random().toString();
    const issue = encodeNodeId({ type: NodeType.Issue, id: this.issueId });
    // FIXME: batch mutations?
    for (const id of add) {
      await this.dataService.mutations.addIssueLocation(mutId, issue, id);
    }
    for (const id of remove) {
      await this.dataService.mutations.removeIssueLocation(mutId, issue, id);
    }
  }
  applyLabelChangeset = async (add: NodeId[], remove: NodeId[]) => {
    if (this.localIssue) {
      return this.applyLocalChangeset('labels', add, remove);
    }
    const mutId = Math.random().toString();
    const issue = encodeNodeId({ type: NodeType.Issue, id: this.issueId });
    // FIXME: batch mutations?
    for (const id of add) {
      await this.dataService.mutations.addIssueLabel(mutId, issue, id);
    }
    for (const id of remove) {
      await this.dataService.mutations.removeIssueLabel(mutId, issue, id);
    }
  }
  applyAssigneeChangeset = async (add: NodeId[], remove: NodeId[]) => {
    if (this.localIssue) {
      return this.applyLocalChangeset('assignees', add, remove);
    }
    const mutId = Math.random().toString();
    const issue = encodeNodeId({ type: NodeType.Issue, id: this.issueId });
    // FIXME: batch mutations?
    for (const id of add) {
      await this.dataService.mutations.addIssueAssignee(mutId, issue, id);
    }
    for (const id of remove) {
      await this.dataService.mutations.removeIssueAssignee(mutId, issue, id);
    }
  }
  applyLinkedIssueChangeset = async (add: NodeId[], remove: NodeId[]) => {
    if (this.localIssue) {
      return this.applyLocalChangeset('linksToIssues', add, remove);
    }

    const mutId = Math.random().toString();
    const issue = encodeNodeId({ type: NodeType.Issue, id: this.issueId });
    // FIXME: batch mutations?
    for (const id of add) {
      await this.dataService.mutations.linkIssue(mutId, issue, id);
    }
    for (const id of remove) {
      await this.dataService.mutations.unlinkIssue(mutId, issue, id);
    }
  }

  onCreateLabel = (): Promise<NodeId | null> => {
    return new Promise(resolve => {
      this.dialogService.open(CreateLabelDialogComponent, {
        width: '400px',
        data: {
          projectId: encodeNodeId({ type: NodeType.Project, id: this.projectId })
        }
      }).afterClosed().subscribe(created => {
        if (created) {
          resolve(encodeNodeId({ type: NodeType.Label, id: created.id }));
        } else {
          resolve(null);
        }
      });
    });
  }
  onEditLabel({ id, preview }) {

  }
  onDeleteLabel({ id, preview }) {

  }
}
