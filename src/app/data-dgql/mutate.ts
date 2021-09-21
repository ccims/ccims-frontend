import { NodeCache } from '@app/data-dgql/query';
import { QueriesService } from '@app/data-dgql/queries/queries.service';
import { decodeNodeId, encodeListId, getRawId, ListId, ListType, NodeId, NodeType } from '@app/data-dgql/id';
import { CreateIssueInput } from '../../generated/graphql-dgql';

export class Mutations {
  constructor(private qs: QueriesService, private nc: NodeCache, private invalidateLists: (id: ListId) => void) {}

  invalidateNode(id: NodeId) {
    if (this.nc.nodes.has(id)) {
      this.nc.getNode(id).loadDebounced();
    }
  }

  createIssue(issue: CreateIssueInput) {
    return this.qs.issues.mutCreateIssue(issue).then(data => {
      for (const id of issue.components) {
        const component = { type: NodeType.Component, id };
        this.invalidateLists(encodeListId({ node: component, type: ListType.Issues }));
      }
      for (const id of issue.locations) {
        // we have no idea if this is a component or an interface, so let's try both
        const component = { type: NodeType.Component, id };
        const cInterface = { type: NodeType.ComponentInterface, id };
        this.invalidateLists(encodeListId({ node: component, type: ListType.IssuesOnLocation }));
        this.invalidateLists(encodeListId({ node: cInterface, type: ListType.IssuesOnLocation }));
      }

      return data.createIssue.issue;
    });
  }

  closeIssue(id: string, issue: NodeId) {
    return this.qs.issues.mutCloseIssue(id, getRawId(issue)).then(() => {
      this.invalidateNode(issue);
    });
  }

  reopenIssue(id: string, issue: NodeId) {
    return this.qs.issues.mutReopenIssue(id, getRawId(issue)).then(() => {
      this.invalidateNode(issue);
    });
  }

  renameIssueTitle(id: string, issue: NodeId, title: string) {
    return this.qs.issues.mutRenameIssueTitle(id, getRawId(issue), title).then(() => {
      const issueNode = decodeNodeId(issue);
      this.invalidateNode(issue);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
    });
  }

  addIssueComment(id: string, issue: NodeId, commentBody: string) {
    return this.qs.issues.mutAddIssueComment(id, getRawId(issue), commentBody).then(() => {
      const issueNode = decodeNodeId(issue);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
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
    return this.qs.issues.mutUpdateIssueComment(id, getRawId(comment), commentBody).then(() => {
      this.invalidateNode(comment);
    });
  }

  deleteIssueComment(id: string, comment: NodeId) {
    return this.qs.issues.mutDeleteIssueComment(id, getRawId(comment)).then(() => {
      this.invalidateNode(comment);
    });
  }

  addIssueLabel(id: string, issue: NodeId, label: NodeId) {
    return this.qs.issues.mutAddIssueLabel(id, getRawId(issue), getRawId(label)).then(() => {
      // while we do have the new timeline item, there's currently no way in the API to just append it to the end,
      // so we'll just invalidate lists
      const issueNode = decodeNodeId(issue);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.Labels }));
    });
  }
  removeIssueLabel(id: string, issue: NodeId, label: NodeId) {
    return this.qs.issues.mutRemoveIssueLabel(id, getRawId(issue), getRawId(label)).then(() => {
      const issueNode = decodeNodeId(issue);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.Labels }));
    });
  }

  addIssueComponent(id: string, issue: NodeId, component: NodeId) {
    return this.qs.issues.mutAddIssueComponent(id, getRawId(issue), getRawId(component)).then(() => {
      const issueNode = decodeNodeId(issue);
      const componentNode = decodeNodeId(component);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.Components }));
      this.invalidateLists(encodeListId({ node: componentNode, type: ListType.Issues }));
      this.invalidateLists(encodeListId({ node: componentNode, type: ListType.IssuesOnLocation }));
    });
  }
  removeIssueComponent(id: string, issue: NodeId, component: NodeId) {
    return this.qs.issues.mutRemoveIssueComponent(id, getRawId(issue), getRawId(component)).then(() => {
      const issueNode = decodeNodeId(issue);
      const componentNode = decodeNodeId(component);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.Components }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.IssueLocations }));
      this.invalidateLists(encodeListId({ node: componentNode, type: ListType.Issues }));
      this.invalidateLists(encodeListId({ node: componentNode, type: ListType.IssuesOnLocation }));
    });
  }

  addIssueLocation(id: string, issue: NodeId, location: NodeId) {
    return this.qs.issues.mutAddIssueLocation(id, getRawId(issue), getRawId(location)).then(() => {
      const issueNode = decodeNodeId(issue);
      const locationNode = decodeNodeId(location);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.Components }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.IssueLocations }));
      this.invalidateLists(encodeListId({ node: locationNode, type: ListType.Issues }));
      this.invalidateLists(encodeListId({ node: locationNode, type: ListType.IssuesOnLocation }));
    });
  }
  removeIssueLocation(id: string, issue: NodeId, location: NodeId) {
    return this.qs.issues.mutRemoveIssueLocation(id, getRawId(issue), getRawId(location)).then(() => {
      const issueNode = decodeNodeId(issue);
      const locationNode = decodeNodeId(location);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.IssueLocations }));
      this.invalidateLists(encodeListId({ node: locationNode, type: ListType.Issues }));
      this.invalidateLists(encodeListId({ node: locationNode, type: ListType.IssuesOnLocation }));
    });
  }

  addIssueAssignee(id: string, issue: NodeId, assignee: NodeId) {
    return this.qs.issues.mutAddIssueAssignee(id, getRawId(issue), getRawId(assignee)).then(() => {
      const issueNode = decodeNodeId(issue);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.Assignees }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.Participants }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
    });
  }
  removeIssueAssignee(id: string, issue: NodeId, assignee: NodeId) {
    return this.qs.issues.mutRemoveIssueAssignee(id, getRawId(issue), getRawId(assignee)).then(() => {
      const issueNode = decodeNodeId(issue);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.Assignees }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
    });
  }

  linkIssue(id: string, issue: NodeId, linkedIssue: NodeId) {
    return this.qs.issues.mutLinkIssue(id, getRawId(issue), getRawId(linkedIssue)).then(() => {
      const issueNode = decodeNodeId(issue);
      const linkedNode = decodeNodeId(linkedIssue);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.LinkedIssues }));
      this.invalidateLists(encodeListId({ node: linkedNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: linkedNode, type: ListType.LinkedByIssues }));
    });
  }
  unlinkIssue(id: string, issue: NodeId, linkedIssue: NodeId) {
    return this.qs.issues.mutUnlinkIssue(id, getRawId(issue), getRawId(linkedIssue)).then(() => {
      const issueNode = decodeNodeId(issue);
      const linkedNode = decodeNodeId(linkedIssue);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.LinkedIssues }));
      this.invalidateLists(encodeListId({ node: linkedNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: linkedNode, type: ListType.LinkedByIssues }));
    });
  }
}
