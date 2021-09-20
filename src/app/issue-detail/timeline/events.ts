import {Component, IssueTimelineItem, User} from "../../../generated/graphql";
import {Location} from "graphql";

export enum EventType {
  AddedToComponentEvent,
  AddedToLocationEvent,
  ClosedEvent,
  AssignedEvent,
  CategoryChangedEvent,
  DueDateChangedEvent,
  DeletedIssueComment,
  EstimatedTimeChangedEvent,
  LabelledEvent,
  IssueComment,
  MarkedAsDuplicateEvent,
  LinkEvent,
  PinnedEvent,
  ReferencedByIssueEvent,
  PriorityChangedEvent,
  RemovedFromComponentEvent,
  ReferencedByOtherEvent,
  RemovedFromLocationEvent,
  ReopenedEvent,
  StartDateChangedEvent,
  RenamedTitleEvent,
  UnassignedEvent,
  UnlabelledEvent,
  WasLinkedEvent,
  UnmarkedAsDuplicateEvent,
  WasUnlinkedEvent,
  UnpinnedEvent,
  UnlinkEvent,
  AddedArtifactEvent,
  RemovedArtifactEvent,
  AddedNonFunctionalConstraintEvent,
  RemovedNonFunctionalConstraintEvent
}

// TODO: further extend properties
type extension = {
  component?: Component,
  location?: Location,
  assignee?: User
  body?: string
};

// Defines properties of all possible Events
export type timelineItemsUnionType = IssueTimelineItem & extension;
