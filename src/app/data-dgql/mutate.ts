import { NodeCache } from '@app/data-dgql/query';
import { QueriesService } from '@app/data-dgql/queries/queries.service';
import { encodeNodeId, ListId, ListType, NodeId, NodeType } from '@app/data-dgql/id';
import { CreateIssueInput, IssueCategory } from '../../generated/graphql-dgql';

export class Mutations {
  constructor(private qs: QueriesService, private nc: NodeCache, private invalidateLists: (id: ListType | ListId) => void) {}

  invalidateNode(id: NodeId) {
    if (this.nc.nodes.has(encodeNodeId(id))) {
      this.nc.getNode(id).loadDebounced();
    }
  }

  updateNode<T>(id: NodeId, data: unknown) {
    this.nc.getNode(id).insertResult(data);
  }

  createIssue(issue: CreateIssueInput) {
    return this.qs.issues.mutCreateIssue(issue).then(data => {
      for (const id of issue.components) {
        const component = { type: NodeType.Component, id };
        this.invalidateLists({ node: component, type: ListType.Issues });
      }
      for (const id of issue.locations) {
        // we have no idea if this is a component or an interface, so let's try both
        const component = { type: NodeType.Component, id };
        const cInterface = { type: NodeType.ComponentInterface, id };
        this.invalidateLists({ node: component, type: ListType.IssuesOnLocation });
        this.invalidateLists({ node: cInterface, type: ListType.IssuesOnLocation });
      }

      return data.createIssue.issue;
    });
  }

  closeIssue(id: string, issue: NodeId) {
    return this.qs.issues.mutCloseIssue(id, issue.id).then(() => {
      this.invalidateNode(issue);
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
    });
  }

  reopenIssue(id: string, issue: NodeId) {
    return this.qs.issues.mutReopenIssue(id, issue.id).then(() => {
      this.invalidateNode(issue);
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
    });
  }

  renameIssueTitle(id: string, issue: NodeId, title: string) {
    return this.qs.issues.mutRenameIssueTitle(id, issue.id, title).then(() => {
      this.invalidateNode(issue);
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
    });
  }

  changeIssueCategory(id: string, issue: NodeId, category: IssueCategory) {
    return this.qs.issues.mutChangeIssueCategory(id, issue.id, category).then(() => {
      this.invalidateNode(issue);
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
    })
  }

  addIssueComment(id: string, issue: NodeId, commentBody: string) {
    return this.qs.issues.mutAddIssueComment(id, issue.id, commentBody).then(() => {
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
    });
  }

  /**
   * Updates the issue comment.
   *
   * @param id - mutation id
   * @param comment - either an issue ID or a comment ID. Pass an issue ID to edit the issue body
   * @param commentBody - plain text body
   */
  updateIssueComment(id: string, comment: NodeId, commentBody: string) {
    return this.qs.issues.mutUpdateIssueComment(id, comment.id, commentBody).then(data => {
      if (comment.type === NodeType.Issue) {
        // this is actually an issue. we can't use the result data because it's incomplete
        this.invalidateNode(comment);
      } else {
        // update comment with result
        this.updateNode(comment, data.updateComment.comment);
      }
    });
  }

  deleteIssueComment(id: string, issue: NodeId, comment: NodeId) {
    return this.qs.issues.mutDeleteIssueComment(id, comment.id).then(() => {
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
    });
  }

  addIssueLabel(id: string, issue: NodeId, label: NodeId) {
    return this.qs.issues.mutAddIssueLabel(id, issue.id, label.id).then(() => {
      // while we do have the new timeline item, there's currently no way in the API to just append it to the end,
      // so we'll just invalidate lists
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
      this.invalidateLists({ node: issue, type: ListType.Labels });
    });
  }
  removeIssueLabel(id: string, issue: NodeId, label: NodeId) {
    return this.qs.issues.mutRemoveIssueLabel(id, issue.id, label.id).then(() => {
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
      this.invalidateLists({ node: issue, type: ListType.Labels });
    });
  }

  addIssueComponent(id: string, issue: NodeId, component: NodeId) {
    return this.qs.issues.mutAddIssueComponent(id, issue.id, component.id).then(() => {
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
      this.invalidateLists({ node: issue, type: ListType.Components });
      this.invalidateLists({ node: component, type: ListType.Issues });
      this.invalidateLists({ node: component, type: ListType.IssuesOnLocation });
    });
  }
  removeIssueComponent(id: string, issue: NodeId, component: NodeId) {
    return this.qs.issues.mutRemoveIssueComponent(id, issue.id, component.id).then(() => {
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
      this.invalidateLists({ node: issue, type: ListType.Components });
      this.invalidateLists({ node: issue, type: ListType.IssueLocations });
      this.invalidateLists({ node: component, type: ListType.Issues });
      this.invalidateLists({ node: component, type: ListType.IssuesOnLocation });
    });
  }

  addIssueLocation(id: string, issue: NodeId, location: NodeId) {
    return this.qs.issues.mutAddIssueLocation(id, issue.id, location.id).then(() => {
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
      this.invalidateLists({ node: issue, type: ListType.Components });
      this.invalidateLists({ node: issue, type: ListType.IssueLocations });
      this.invalidateLists({ node: location, type: ListType.Issues });
      this.invalidateLists({ node: location, type: ListType.IssuesOnLocation });
    });
  }
  removeIssueLocation(id: string, issue: NodeId, location: NodeId) {
    return this.qs.issues.mutRemoveIssueLocation(id, issue.id, location.id).then(() => {
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
      this.invalidateLists({ node: issue, type: ListType.IssueLocations });
      this.invalidateLists({ node: location, type: ListType.Issues });
      this.invalidateLists({ node: location, type: ListType.IssuesOnLocation });
    });
  }

  addIssueAssignee(id: string, issue: NodeId, assignee: NodeId) {
    return this.qs.issues.mutAddIssueAssignee(id, issue.id, assignee.id).then(() => {
      this.invalidateLists({ node: issue, type: ListType.Assignees });
      this.invalidateLists({ node: issue, type: ListType.Participants });
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
    });
  }
  removeIssueAssignee(id: string, issue: NodeId, assignee: NodeId) {
    return this.qs.issues.mutRemoveIssueAssignee(id, issue.id, assignee.id).then(() => {
      this.invalidateLists({ node: issue, type: ListType.Assignees });
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
    });
  }

  linkIssue(id: string, issue: NodeId, linkedIssue: NodeId) {
    return this.qs.issues.mutLinkIssue(id, issue.id, linkedIssue.id).then(() => {
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
      this.invalidateLists({ node: issue, type: ListType.LinkedIssues });
      this.invalidateLists({ node: linkedIssue, type: ListType.TimelineItems });
      this.invalidateLists({ node: linkedIssue, type: ListType.LinkedByIssues });
    });
  }
  unlinkIssue(id: string, issue: NodeId, linkedIssue: NodeId) {
    return this.qs.issues.mutUnlinkIssue(id, issue.id, linkedIssue.id).then(() => {
      this.invalidateLists({ node: issue, type: ListType.TimelineItems });
      this.invalidateLists({ node: issue, type: ListType.LinkedIssues });
      this.invalidateLists({ node: linkedIssue, type: ListType.TimelineItems });
      this.invalidateLists({ node: linkedIssue, type: ListType.LinkedByIssues });
    });
  }

  createLabel(id: string, components: NodeId[], name: string, color: string, description?: string) {
    return this.qs.issues.mutCreateLabel(id, components.map(node => node.id), name, color, description).then(data => {
      for (const component of components) {
        this.invalidateLists({ node: component, type: ListType.Labels });
      }
      return data.createLabel.label;
    });
  }
  updateLabel(id: string, label: NodeId, name?: string, color?: string, description?: string) {
    return this.qs.issues.mutUpdateLabel(id, label.id, name, color, description).then(() => {
      this.invalidateNode(label);
      // invalidate all label lists because the label might've been loaded directly from a list elsewhere
      this.invalidateLists(ListType.Labels);
    });
  }
  addLabelToComponent(id: string, label: NodeId, component: NodeId) {
    return this.qs.issues.mutAddLabelToComponent(id, label.id, component.id).then(() => {
      this.invalidateLists({ node: label, type: ListType.Components });
      this.invalidateLists({ node: component, type: ListType.Labels });
    });
  }
  removeLabelFromComponent(id: string, label: NodeId, component: NodeId) {
    return this.qs.issues.mutRemoveLabelFromComponent(id, label.id, component.id).then(() => {
      this.invalidateLists({ node: label, type: ListType.Components });
      // invalidate all label lists because the label might've been in an issue
      this.invalidateLists(ListType.Labels);
    });
  }
  deleteLabel(id: string, label: NodeId) {
    return this.qs.issues.mutDeleteLabel(id, label.id).then(() => {
      // invalidate all label lists because the label might've been in an issue
      this.invalidateLists(ListType.Labels);
    });
  }
}
