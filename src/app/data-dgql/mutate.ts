import { NodeCache } from '@app/data-dgql/query';
import { QueriesService } from '@app/data-dgql/queries/queries.service';
import { decodeNodeId, encodeListId, ListId, ListType, NodeId } from '@app/data-dgql/id';

const getId = (id: NodeId) => decodeNodeId(id).id;

export class Mutations {
  constructor(private qs: QueriesService, private nc: NodeCache, private invalidateLists: (id: ListId) => void) {}

  addIssueLabel(id: string, issue: NodeId, label: NodeId) {
    this.qs.issues.mutAddIssueLabel(id, getId(issue), getId(label)).then(() => {
      // while we do have the new timeline item, there's currently no way in the API to just append it to the end,
      // so we'll just invalidate lists
      const issueNode = decodeNodeId(issue);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.Labels }));
    });
  }
  removeIssueLabel(id: string, issue: NodeId, label: NodeId) {
    this.qs.issues.mutRemoveIssueLabel(id, getId(issue), getId(label)).then(() => {
      const issueNode = decodeNodeId(issue);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.Labels }));
    });
  }

  addIssueComponent(id: string, issue: NodeId, component: NodeId) {
    this.qs.issues.mutAddIssueComponent(id, getId(issue), getId(component)).then(() => {
      const issueNode = decodeNodeId(issue);
      const componentNode = decodeNodeId(component);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.Components }));
      this.invalidateLists(encodeListId({ node: componentNode, type: ListType.Issues }));
      this.invalidateLists(encodeListId({ node: componentNode, type: ListType.IssuesOnLocation }));
    });
  }
  removeIssueComponent(id: string, issue: NodeId, component: NodeId) {
    this.qs.issues.mutRemoveIssueComponent(id, getId(issue), getId(component)).then(() => {
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
    this.qs.issues.mutAddIssueLocation(id, getId(issue), getId(location)).then(() => {
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
    this.qs.issues.mutRemoveIssueLocation(id, getId(issue), getId(location)).then(() => {
      const issueNode = decodeNodeId(issue);
      const locationNode = decodeNodeId(location);
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.TimelineItems }));
      this.invalidateLists(encodeListId({ node: issueNode, type: ListType.IssueLocations }));
      this.invalidateLists(encodeListId({ node: locationNode, type: ListType.Issues }));
      this.invalidateLists(encodeListId({ node: locationNode, type: ListType.IssuesOnLocation }));
    });
  }
}
