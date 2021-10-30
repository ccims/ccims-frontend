import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
import { encodeNodeId, ListId, ListType, NodeId, NodeType, ROOT_NODE } from '@app/data-dgql/id';
import { SetMultiSource } from '@app/components/set-editor/set-editor-dialog.component';
import DataService from '@app/data-dgql';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditLabelDialogComponent } from '@app/dialogs/create-label-dialog/create-edit-label-dialog.component';
import { RemoveDialogComponent } from '@app/dialogs/remove-dialog/remove-dialog.component';
import { UserNotifyService } from '@app/user-notify/user-notify.service';

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

  @ViewChild('componentSet') componentSetEditor;

  constructor(private dataService: DataService, private dialogService: MatDialog, private notify: UserNotifyService) {}

  public componentList: MaybeLocalList<NodeId>;
  public locationList: MaybeLocalList<NodeId>;
  public labelList: MaybeLocalList<NodeId>;
  public linkedIssueList: MaybeLocalList<NodeId>;
  public linkedByIssueList: MaybeLocalList<NodeId>;
  public assigneeList: MaybeLocalList<NodeId>;

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
      this.componentList = {
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.Components
      };
      this.locationList = {
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.IssueLocations
      };
      this.labelList = {
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.Labels
      };
      this.assigneeList = {
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.Assignees
      };
      this.linkedIssueList = {
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.LinkedIssues
      };
      this.linkedByIssueList = {
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.LinkedByIssues
      };
    } else if (this.localIssue) {
      this.componentList = this.localIssue.components;
      this.locationList = this.localIssue.locations;
      this.labelList = this.localIssue.labels;
      this.assigneeList = this.localIssue.assignees;
      this.linkedIssueList = this.localIssue.linksToIssues;
      this.linkedByIssueList = [];
    }

    const projectComponents = {
      node: { type: NodeType.Project, id: this.projectId },
      type: ListType.Components
    };
    const projectInterfaces = {
      node: { type: NodeType.Project, id: this.projectId },
      type: ListType.ComponentInterfaces
    };

    this.allComponentsList = projectComponents;
    this.allLocationsList = {
      staticSources: [projectComponents, projectInterfaces],
    };
    this.allLabelsList = {
      staticSources: this.issueId ? [{
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.Labels
      }] : [],
      // source labels from labels of issue components
      sourceNodes: this.issueId ? ({
        node: { type: NodeType.Issue, id: this.issueId },
        type: ListType.Components,
      }) : (this.localIssue.components || []),
      listFromNode: node => ({
        node,
        type: ListType.Labels
      })
    };
    this.allAssigneeCandidatesList = {
      staticSources: [
        this.issueId && {
          node: { type: NodeType.Issue, id: this.issueId },
          type: ListType.Assignees
        },
        {
          node: ROOT_NODE,
          type: ListType.SearchUsers
        }
      ].filter(x => x),
    };
    this.allLinkedIssuesList = {
      node: { type: NodeType.Project, id: this.projectId },
      type: ListType.Issues
    };

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
    const keySet = new Set([...set].map(id => encodeNodeId(id)));

    for (const id of add) {
      const encId = encodeNodeId(id);
      if (!keySet.has(encId)) {
        set.push(id);
        keySet.add(encId);
      }
    }
    for (const id of remove) {
      const encId = encodeNodeId(id);
      if (keySet.has(encId)) {
        set.splice(set.indexOf(id), 1);
        keySet.delete(encId);
      }
    }

    this.localIssueChange.emit(this.localIssue);
  }

  applyComponentChangeset = async (add: NodeId[], remove: NodeId[]) => {
    if (this.localIssue) {
      return this.applyLocalChangeset('components', add, remove);
    }

    const mutId = Math.random().toString();
    const issue = { type: NodeType.Issue, id: this.issueId };
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
    const issue = { type: NodeType.Issue, id: this.issueId };
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
    const issue = { type: NodeType.Issue, id: this.issueId };
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
    const issue = { type: NodeType.Issue, id: this.issueId };
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
    const issue = { type: NodeType.Issue, id: this.issueId };
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
      this.dialogService.open(CreateEditLabelDialogComponent, {
        width: '400px',
        data: {
          projectId: { type: NodeType.Project, id: this.projectId },
          issueId: this.issue$?.current.components.nodes.map(c => {
            return {type: NodeType.Component, id: c.id};
          })
        }
      }).afterClosed().subscribe(created => {
        if (created) {
          const labelComponents = created.components.nodes.map(c => c.id);
          let hasOverlap = false;
          if (Array.isArray(this.componentList)) {
            for (const componentId of this.componentList) {
              if (labelComponents.includes(componentId.id)) {
                hasOverlap = true;
                break;
              }
            }
          } else {
            for (const item of this.componentSetEditor.listSet$.currentItems) {
              if (labelComponents.includes(item.id)) {
                hasOverlap = true;
                break;
              }
            }
          }

          if (hasOverlap) {
            resolve({ type: NodeType.Label, id: created.id });
          } else {
            this.notify.notifyInfo('New label could not be added to issue because it does not appear to have any components in common.');
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  }
  onEditLabel({ id }) {
    this.dialogService.open(CreateEditLabelDialogComponent, {
      width: '400px',
      data: {
        editExisting: id,
        projectId: { type: NodeType.Project, id: this.projectId }
      }
    });
  }
  onDeleteLabel({ id, preview }) {
    this.dialogService.open(RemoveDialogComponent, {
      data: {
        title: 'Delete label',
        messages: [
          `Are you sure you want to delete the label “${preview.name}”?`
        ]
      }
    }).afterClosed().subscribe(shouldDelete => {
      if (shouldDelete) {
        this.dataService.mutations.deleteLabel(Math.random().toString(), id);
      }
    });
  }
}
