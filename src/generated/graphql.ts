import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * A scalar type representing a colour in RGB colour space.
   * The scalar must be a string in CSS Colour Hex format:
   * 
   * `#rrggbb` where `rr`, `gg`, `bb` are the hex values between _0_ and _ff_
   * 
   * Example: `#ffff00` (would be a _beautiful_ yellow)
   */
  Color: any;
  /**
   * The `Date` scalar is a sting containing a date in a format compatible with _ISO-8601_
   * 
   * Example: `2011-10 - 10T14: 48: 00``
   */
  Date: any;
  /**
   * The `JSON` scalar is a string in the a JSON format
   * 
   * Example: `{"numbers": [1,2,3,4]}`
   */
  JSON: any;
  /**
   * A integer number representing the length of the time span in milliseconds
   * 
   * Example: `60000` (equivalent to a time span of one minute)
   */
  TimeSpan: any;
};



/** The type of the Issue management system. Currently only GitHub and ccims internal are available */
export enum ImsType {
  /** The type of the Issue management system. Currently only GitHub and ccims internal are available */
  Ccims = 'CCIMS',
  /** GitHub (or GitHub enterprise server) is the IMS for the component */
  Github = 'GITHUB',
  /** Any instance of GitLab is used as issue management system */
  Gitlab = 'GITLAB',
  /** Any instance of Jira is used as issue management system */
  Jira = 'JIRA',
  /** Any instance of Redmine is used as issue management system */
  Redmine = 'REDMINE'
}

/** The category of an issue. The issue will be displayed accordingly in the ccims */
export enum IssueCategory {
  /** If an issue is classified _bug_ it describes an error, flaw or fault in one ore multiple component(s) or interface(s) */
  Bug = 'BUG',
  /** If an issue is defined a _feature request_, it describes a functionality that is to be implemented at some point */
  FeatureRequest = 'FEATURE_REQUEST',
  /** The category for issues, that either weren't yet assigned to a category or that don't fit into one of the other categories */
  Unclassified = 'UNCLASSIFIED'
}

/** The type of a timeline item/event so it can be filtered for <sup>(because GraphQL doesn't allow to filter for a type)</sup> */
export enum IssueTimelineItemType {
  /** A still visible comment on an issue (not including the actual issue text) */
  IssueComment = 'ISSUE_COMMENT',
  /** A comment that has been deleted by a user. This will contain no text etc., but a message should be shown in place of the comment stating that this is a deleted comment */
  DeletedIssueComment = 'DELETED_ISSUE_COMMENT',
  /** An event when this issue was referenced by an element in an IMS that is not an issue (e.g. in a commit message, pull request etc.) */
  ReferencedByOtherEvent = 'REFERENCED_BY_OTHER_EVENT',
  /** An event when this issue was referenced by an other issue in an IMS or the ccims itself */
  ReferencedByIssueEvent = 'REFERENCED_BY_ISSUE_EVENT',
  /** A link from this issue to another issue was created */
  LinkEvent = 'LINK_EVENT',
  /** A link from this issue to another issue was removed */
  UnlinkEvent = 'UNLINK_EVENT',
  /** An event if this issue was linked to in another issue */
  WasLinkedEvent = 'WAS_LINKED_EVENT',
  /** An event if the link from another issue to this one was removed */
  WasUnlinkedEvent = 'WAS_UNLINKED_EVENT',
  /** A label was added to this issue */
  LabelledEvent = 'LABELLED_EVENT',
  /** A label was removed from tis issue */
  UnlabelledEvent = 'UNLABELLED_EVENT',
  /**
   * This issue was pinned as important issue in the ccims.
   * 
   * __This event won't be synced along all subscribed issue management systems__
   */
  PinnedEvent = 'PINNED_EVENT',
  /**
   * This issue was unpinned in the ccims.
   * 
   * __This event won't be synced along all subscribed issue management systems__
   */
  UnpinnedEvent = 'UNPINNED_EVENT',
  /** Occurs if the title of the issue has been changed */
  RenamedTitleEvent = 'RENAMED_TITLE_EVENT',
  /** An event if the category (see `enum IssueCategory`) of the issue has been changed */
  CategoryChangedEvent = 'CATEGORY_CHANGED_EVENT',
  /** If a user has been assigned as responsible person for this issue */
  AssignedEvent = 'ASSIGNED_EVENT',
  /** If a user has been unassigned from this issue and is no longer responsible */
  UnassignedEvent = 'UNASSIGNED_EVENT',
  /** Happens if the issue has been closed by anybody */
  ClosedEvent = 'CLOSED_EVENT',
  /**
   * Happens if the issue has been reopened after being closed by anybody.
   * 
   * _This event doesn't occur on the first opening of the issue_
   */
  ReopenedEvent = 'REOPENED_EVENT',
  /** If the issue priority was changed (see `enum Priority`) */
  PriorityChangedEvent = 'PRIORITY_CHANGED_EVENT',
  /** An event if the date the issue gets relevant/starts has changed */
  StartDateChangedEvent = 'START_DATE_CHANGED_EVENT',
  /** An event if the date the issue is due on/must be finished by was changed */
  DueDateChangedEvent = 'DUE_DATE_CHANGED_EVENT',
  /** The estimated time required to resolve this issue was updated */
  EstimatedTimeChangedEvent = 'ESTIMATED_TIME_CHANGED_EVENT',
  /** Event if the cross component issue was added to another location (another component/another) */
  AddedLocationEvent = 'ADDED_LOCATION_EVENT',
  /** Event if the cross component issue was removed from a location (another component/another) */
  RemovedLocationEvent = 'REMOVED_LOCATION_EVENT',
  /**
   * Occurs if this issue was marked as duplicate of some other issue which is known to the ccims.
   * 
   * (if the issue in unknown to the ccims at time of marking it as a duplicate; it's not guaranteed, that the mark will be synced)
   */
  MarkedAsDuplicateEvent = 'MARKED_AS_DUPLICATE_EVENT',
  /** An event if the issue is no longer a duplicate of another issue */
  UnmarkedAsDuplicateEvent = 'UNMARKED_AS_DUPLICATE_EVENT',
  /** An event if the issue has been added to a new component and copied to the components ims (not a issue location) */
  AddedToComponentEvent = 'ADDED_TO_COMPONENT_EVENT',
  /** An event if the issue has been removed from a component and deleted in the components ims (not a issue location) */
  RemovedFromComponentEvent = 'REMOVED_FROM_COMPONENT_EVENT'
}

/** The Priority which an issue has - how urgent it needs to be resolved */
export enum Priority {
  /** The issue has a low priority but higher than issues without priority */
  Low = 'LOW',
  /** The issue has a priority higher than low bot is not absolutely urgent */
  Default = 'DEFAULT',
  /** Issues with this priority are __very__ urgent and need to be resolved quickly */
  High = 'HIGH'
}





/** An object which can be identified by an ID - called a node */
export type Node = {
  /**
   * The ID of this node. Every node will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
};

/** An edge for a ComponentInterfacePage to link a cursor to an element */
export type ComponentInterfaceEdge = {
  /** The interface linked to by this edge */
  node?: Maybe<ComponentInterface>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a ComponentPage to link a cursor to an element */
export type ComponentEdge = {
  /** The component linked to by this edge */
  node?: Maybe<Component>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for an IssueCommentPage to link a cursor to an element */
export type IssueCommentEdge = {
  /** The issue comment linked to by this edge */
  node?: Maybe<IssueComment>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for an IssuePage to link a cursor to an element */
export type IssueEdge = {
  /** The issue linked to by this edge */
  node?: Maybe<Issue>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for an IssueLocationPage to link a cursor to an element */
export type IssueLocationEdge = {
  /** The issue location linked to by this edge */
  node?: Maybe<IssueLocation>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for an IssueTimelineItemPage to link a cursor to an element */
export type IssueTimelineItemEdge = {
  /** The issue timeline item linked to by this edge */
  node?: Maybe<IssueTimelineItem>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a LabelPage to link a cursor to an element */
export type LabelEdge = {
  /** The label linked to by this edge */
  node?: Maybe<Label>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a ProjectPage to link a cursor to an element */
export type ProjectEdge = {
  /** The project linked to by this edge */
  node?: Maybe<Project>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a RecationGroupPage to link a cursor to an element */
export type ReactionGroupEdge = {
  /** The reaction group linked to by this edge */
  node?: Maybe<ReactionGroup>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a UserPage to link a cursor to an element */
export type UserEdge = {
  /** The user linked to by this edge */
  node?: Maybe<User>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** Filters for component matching the given properties */
export type ComponentFilter = {
  /** The name of the component must match any of the given strings */
  name?: Maybe<Array<Scalars['String']>>;
  /** The owner of the component must have any of the given ids */
  owner?: Maybe<Array<Scalars['ID']>>;
  /** The components description must match the given __RegEx__ */
  description?: Maybe<Scalars['String']>;
  /** The IMS type of a component must be one of the given ones */
  imsType?: Maybe<Array<ImsType>>;
};

/** Filters for an instance of a component's interface */
export type ComponentInterfaceFilter = {
  /** The name the component has to have */
  name?: Maybe<Scalars['String']>;
  /** A Regex which the description of the interface needs to match */
  description?: Maybe<Scalars['String']>;
  /** If given, only interfaces, that are __offered by__ one of the components with the IDs given can match the given filter */
  component?: Maybe<Array<Scalars['ID']>>;
  /** If given, only interfaces which are consumed by at least one of the components with the given ids can match the filter */
  consumedBy?: Maybe<Array<Scalars['ID']>>;
};

/** Filter for comments on issues (not including the issue bodies themselves). All parameters given in this filter will be connected via _AND_ */
export type IssueCommentFilter = {
  /** The id of the issue the comment belongs to must match any of the given ids */
  issue?: Maybe<Array<Scalars['ID']>>;
  /** The id of the user creating the comment.Must match any one of the given ids */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The id of the user who __last__ edited the comment must match any of the given ids */
  editedBy?: Maybe<Array<Scalars['ID']>>;
  /** Match all comments created after the given date (inclusive) */
  createdAfter?: Maybe<Scalars['Date']>;
  /** Match all comments created before the given date (inclusive) */
  createdBefore?: Maybe<Scalars['Date']>;
  /** Match all comments last edited after the given date (inclusive) */
  editedAfter?: Maybe<Scalars['Date']>;
  /** Match all comments last edited before the given date (inclusive) */
  editedBefore?: Maybe<Scalars['Date']>;
  /** The body of a comment must match this __RegEx__ to match the filter */
  body?: Maybe<Scalars['String']>;
  /** A comment must have all the reactions in one of the lists given. */
  reactions?: Maybe<Array<Array<Scalars['String']>>>;
  /** If given, filters for comments which the user either has or hasn't got edit permissions */
  currentUserCanEdit?: Maybe<Scalars['Boolean']>;
};

/**
 * Filters for Issues. All parameters given in this filter will be connected via _AND_
 * 
 * Not specific issues in issue management systems but the issue in the ccims
 */
export type IssueFilter = {
  /** The title of the issue must match the given regex */
  title?: Maybe<Scalars['String']>;
  /** The issue must be on at least one of the components with the given ids */
  components?: Maybe<Array<Scalars['ID']>>;
  /** The body text of this issue must match this given __RegEx__ */
  body?: Maybe<Scalars['String']>;
  /** The id of the user creating the issue must be any of the given ones */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The id of the user last editing the issue must match any of the ones in the list */
  editedBy?: Maybe<Array<Scalars['ID']>>;
  /** The issue must have been created __after__ the given date (inclusive) */
  createdAfter?: Maybe<Scalars['Date']>;
  /** The issue must have been created __before__ the given date (inclusive) */
  createdBefore?: Maybe<Scalars['Date']>;
  /** The issue must have been last edited __after__ the given date (inclusive) */
  editedAfter?: Maybe<Scalars['Date']>;
  /** The issue must have been last edited __before__ the given date (inclusive) */
  editedBefore?: Maybe<Scalars['Date']>;
  /** The last event in this issue must have occurred __after__ the given date (inclusive) */
  updatedAfter?: Maybe<Scalars['Date']>;
  /** The last event in this issue must have occurred __before__ the given date (inclusive) */
  updatedBefore?: Maybe<Scalars['Date']>;
  /** If given, filters for opened/closed issues */
  isOpen?: Maybe<Scalars['Boolean']>;
  /** If given, filters for issues which are/aren't duplicates of another issue */
  isDuplicate?: Maybe<Scalars['Boolean']>;
  /** The issue must have any of the given categories to match the filter */
  category?: Maybe<Array<IssueCategory>>;
  /** If given, filters for issues which do/don't link __to__ other issues */
  linksIssues?: Maybe<Scalars['Boolean']>;
  /** If given, filters for issues which are/aren't linkt __by__ other issues */
  isLinkedByIssues?: Maybe<Scalars['Boolean']>;
  /** The issue must link __to__ at least one of the issues with the given ids */
  linkedIssues?: Maybe<Array<Scalars['ID']>>;
  /** The issue must be linked __by__ at least one of the issues with the given ids */
  linkedByIssues?: Maybe<Array<Scalars['ID']>>;
  /** The issue (body text) must have all the reactions in one of the lists given. */
  reactions?: Maybe<Array<Array<Scalars['String']>>>;
  /** Any of the users with the given ids must be an assignee to the issue for it to match this filter */
  assignees?: Maybe<Array<Scalars['ID']>>;
  /** The issue must have at least one label with one of the given ids */
  labels?: Maybe<Array<Scalars['ID']>>;
  /** Any of the users with the given ids must be a participant to the issue for it to match this filter */
  participants?: Maybe<Array<Scalars['ID']>>;
  /** The issue must be assigned to at least one of the locations with the given ids */
  locations?: Maybe<Array<Scalars['ID']>>;
  /** If given filters for issues the current user is allowed/not allowed to edit (the title and body text) */
  currentUserCanEdit?: Maybe<Scalars['Boolean']>;
  /** If given filters for issues the current user is allowed/not allowed to write new comments on */
  currentUserCanComment?: Maybe<Scalars['Boolean']>;
  /** Filters for all issues that have a start date __after__ the give date */
  startDateAfter?: Maybe<Scalars['Date']>;
  /** Filters for all issues that have a start date __before__ the give date */
  startDateBefore?: Maybe<Scalars['Date']>;
  /** Filters for all issues that have a due date __after__ the give date */
  dueDateAfter?: Maybe<Scalars['Date']>;
  /** Filters for all issues that have a due date __before__ the give date */
  dueDateBefore?: Maybe<Scalars['Date']>;
  /** Matches all issues that have an estimated time __greater or equal__ than the given one */
  estimatedTimeGreaterThan?: Maybe<Scalars['TimeSpan']>;
  /** Matches all issues that have an estimated time __lower or equal__ than the given one */
  estimatedTimeLowerThan?: Maybe<Scalars['TimeSpan']>;
  /** Matches all issues that have an actual spent time __greater or equal__ than the given one */
  spentTimeGreaterThan?: Maybe<Scalars['TimeSpan']>;
  /** Matches all issues that have an actual spent time __lower or equal__ than the given one */
  spentTimeLowerThan?: Maybe<Scalars['TimeSpan']>;
};

/** Filters for Issues locations (components and interfaces). All parameters given in this filter will be connected via _AND_ */
export type IssueLocationFilter = {
  /** The name of the location must match one of the gien strings */
  name?: Maybe<Array<Scalars['String']>>;
  /** The issue locations description must match the given __RegEx__ */
  description?: Maybe<Scalars['String']>;
};

/**
 * Filters for certain timeline events. All parameters given in this filter will be connected via _AND_
 * 
 * __Please note:__ It's currently __not__ possible to filter for specific properties of an event. Might be added in future
 */
export type IssueTimelineItemFilter = {
  /** Filters for the creator user of the timeline event. The id of the user must match any of the given ids */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The timeline event must have occurred after the given date (inclusive) to match the filter */
  createdAfter?: Maybe<Scalars['Date']>;
  /** The timeline event must have occurred before the given date (inclusive) to match the filter */
  createdBefore?: Maybe<Scalars['Date']>;
  /** The type of the timeline item must match one of the given ones */
  type?: Maybe<Array<IssueTimelineItemType>>;
};

/** A Filter data input for labels.  All parameters given in this filter will be connected via _AND_ */
export type LabelFilter = {
  /** A lists of names. The label needs to match any one or more of these. */
  name?: Maybe<Array<Scalars['String']>>;
  /** The __RegEx__ the description of the label needs to match */
  description?: Maybe<Scalars['String']>;
  /** Filters for the creator user of the label. The id of the user must match any of the given ids */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The label must have been created after the given date (inclusive) to match the filter */
  createdAfter?: Maybe<Scalars['Date']>;
  /** The label must have been created before the given date (inclusive) to match the filter */
  createdBefore?: Maybe<Scalars['Date']>;
  /** A list of label colours. Any one or more of the given colours need to match the labels colour. */
  color?: Maybe<Array<Scalars['Color']>>;
};

/** Filter for a Project. All parameters given in this filter will be connected via _AND_ */
export type ProjectFilter = {
  /** The name of the project must match the given RegEx */
  name?: Maybe<Scalars['String']>;
  /** The project must have any of the components with the given ids */
  components?: Maybe<Array<Scalars['ID']>>;
  /** At least one of the users with the given ids must be part of the project */
  users?: Maybe<Array<Scalars['ID']>>;
  /** The Owner of the project must be a user with one of the given ids */
  owner?: Maybe<Array<Scalars['ID']>>;
  /** At least one of the issues given must be on a component assigned to the project */
  issues?: Maybe<Array<Scalars['ID']>>;
  /** The projects description must match the given __RegEx__ */
  description?: Maybe<Scalars['String']>;
};

/** A filter for reaction groups (a reaction together with the users who reacted). All parameters given in this filter will be connected via _AND_ */
export type ReactionGroupFilter = {
  /** The reactions name must match this regex */
  reaction?: Maybe<Scalars['String']>;
  /** A list of Users who reacted. Any reaction group which contains at least one of the given users will match the filter */
  users?: Maybe<Array<Scalars['ID']>>;
};

/** Filter for a user of the system. All parameters given in this filter will be connected via _AND_ */
export type UserFilter = {
  /** The users username must match this given RegEx */
  username?: Maybe<Scalars['String']>;
  /** The users display name must match this given RegEx */
  displayName?: Maybe<Scalars['String']>;
  /** The users email must match this given RegEx */
  email?: Maybe<Scalars['String']>;
  /** The user must be member of at least one of the projects with the given ids */
  projects?: Maybe<Array<Scalars['ID']>>;
  /** The user must be assigned to at least one of the issues with the given ids */
  assignedToIssues?: Maybe<Array<Scalars['ID']>>;
  /** The user must be participant of at least one of the issues with the given ids */
  participantOfIssues?: Maybe<Array<Scalars['ID']>>;
  /** The user must have written or edited at least one of the comments (issue or comment) with the given ids */
  comments?: Maybe<Array<Scalars['ID']>>;
};

/** A page of multiple component interfaces */
export type ComponentInterfacePage = Page & {
  /** All interfaces on this page */
  nodes?: Maybe<Array<Maybe<ComponentInterface>>>;
  /** Edges to all nodes containing the cursor */
  edges?: Maybe<Array<Maybe<ComponentInterfaceEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** A page of multiple components */
export type ComponentPage = Page & {
  /** All components on this page */
  nodes?: Maybe<Array<Maybe<Component>>>;
  /** Edges to all nodes containing the cursor */
  edges?: Maybe<Array<Maybe<ComponentEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** A page of multiple issue comments */
export type IssueCommentPage = Page & {
  /** All issue comments on this page */
  nodes?: Maybe<Array<Maybe<IssueComment>>>;
  /** Edges to all nodes containing the cursor */
  edges?: Maybe<Array<Maybe<IssueCommentEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** A page of multiple issue locations */
export type IssueLocationPage = Page & {
  /** All issue locations on this page */
  nodes?: Maybe<Array<Maybe<IssueLocation>>>;
  /** Edges to all nodes containing the cursor */
  edges?: Maybe<Array<Maybe<IssueLocationEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** A page of multiple issues */
export type IssuePage = Page & {
  /** All issues on this page */
  nodes?: Maybe<Array<Maybe<Issue>>>;
  /** Edges to all nodes containing the cursor */
  edges?: Maybe<Array<Maybe<IssueEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** A page of multiple labels */
export type LabelPage = Page & {
  /** All labels on this page */
  nodes?: Maybe<Array<Maybe<Label>>>;
  /** Edges to all nodes containing the cursor */
  edges?: Maybe<Array<Maybe<LabelEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** A page of multiple issue timeline items */
export type IssueTimelineItemPage = Page & {
  /** All issue timeline items on this page */
  nodes?: Maybe<Array<Maybe<IssueTimelineItem>>>;
  /** Edges to all nodes containing the cursor */
  edges?: Maybe<Array<Maybe<IssueTimelineItemEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/**
 * A page of elements
 * 
 * Contains edges and nodes as well as some information and a node count
 */
export type Page = {
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** Information about a page including the first and last elements cursor and next/previous pages */
export type PageInfo = {
  /** The cursor of the first element on the page. Can be used to request the previous page. */
  startCursor?: Maybe<Scalars['String']>;
  /** The cursor of the last element on the page. Can be used to request the next page. */
  endCursor?: Maybe<Scalars['String']>;
  /** true iff there is another page of elements with the current filter */
  hasNextPage: Scalars['Boolean'];
  /** true iff there is a previous page of elements with the current filter */
  hasPreviousPage: Scalars['Boolean'];
};

/** A page of multiple users */
export type UserPage = Page & {
  /** All users on this page */
  nodes?: Maybe<Array<Maybe<User>>>;
  /** Edges to all nodes containing the cursor */
  edges?: Maybe<Array<Maybe<UserEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** A page of reaction groups */
export type ReactionGroupPage = Page & {
  /** All reaction groups on this page */
  nodes?: Maybe<Array<Maybe<ReactionGroup>>>;
  /** Edges to all nodes containing the cursor */
  edges?: Maybe<Array<Maybe<ReactionGroupEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** A page of projects */
export type ProjectPage = Page & {
  /** All projects on this page */
  nodes?: Maybe<Array<Maybe<Project>>>;
  /** Edges to all nodes containing the cursor */
  edges?: Maybe<Array<Maybe<ProjectEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** An interface specifying an editable text block (e.g. Issue, Comment) */
export type Comment = {
  /** The unique id of this comment */
  id: Scalars['ID'];
  /**
   * The body text of the comment.
   * Markdown supported.
   * 
   * Max. 65536 characters
   */
  body?: Maybe<Scalars['String']>;
  /** The body text of the comment rendered to html */
  bodyRendered?: Maybe<Scalars['String']>;
  /** The user who originally created the comment (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** A list of all people who edited the root of this comment (body and title) */
  editedBy?: Maybe<Array<User>>;
  /** The date the comment was first created on */
  createdAt: Scalars['Date'];
  /** Date when the core comment(title, body etc.) was last changed (comments and other events DO NOT count) */
  lastEditedAt?: Maybe<Scalars['Date']>;
  /**
   * `true` iff the user authenticated by the given JWT is permitted to edit this comment.
   * 
   * This only refers to editing the core comment (title, body, etc.)
   */
  currentUserCanEdit: Scalars['Boolean'];
  /** All reactions that have been added to this comment */
  reactions?: Maybe<ReactionGroupPage>;
};


/** An interface specifying an editable text block (e.g. Issue, Comment) */
export type CommentReactionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ReactionGroupFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/**
 * A component known to ccims.
 * 
 * A component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export type Component = Node & IssueLocation & {
  /** The unique id of this component */
  id: Scalars['ID'];
  /**
   * The (non unique) display name of this component
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /** The user who administrates "owns" the component */
  owner?: Maybe<User>;
  /**
   * A textual description (of the fuction) of this component.
   * 
   * Max. 65536 characters
   */
  description?: Maybe<Scalars['String']>;
  /** The IMS instance used by this component. */
  ims?: Maybe<Ims>;
  /** All issues that are mirrored on this component (not the issue location but the ims) matching (if given) `filterBy` */
  issues?: Maybe<IssuePage>;
  /** All issues that are assigned to this components issue location matching (if given) `filterBy` */
  issuesOnLocation?: Maybe<IssuePage>;
  /** All projects that this component is assigned to matching the `filterBy` */
  projects?: Maybe<ProjectPage>;
  /** Requests component interfaces which this component offers */
  interfaces?: Maybe<ComponentInterfacePage>;
  /** Requests component interfaces that are used/consumed by this component */
  consumedInterfaces?: Maybe<ComponentInterfacePage>;
  /** All labels which are available on this component, matching (if given) `filterBy` */
  labels?: Maybe<LabelPage>;
};


/**
 * A component known to ccims.
 * 
 * A component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export type ComponentIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/**
 * A component known to ccims.
 * 
 * A component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export type ComponentIssuesOnLocationArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/**
 * A component known to ccims.
 * 
 * A component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export type ComponentProjectsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ProjectFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/**
 * A component known to ccims.
 * 
 * A component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export type ComponentInterfacesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ComponentInterfaceFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/**
 * A component known to ccims.
 * 
 * A component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export type ComponentConsumedInterfacesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ComponentInterfaceFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/**
 * A component known to ccims.
 * 
 * A component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export type ComponentLabelsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<LabelFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/**
 * An issue management system. This will be an __instance__ of one of the available IMS Types.
 * 
 * E.g. One GitHub Repository's issue page.
 */
export type Ims = Node & {
  /** The unique ID of this IMS */
  id: Scalars['ID'];
  /** The type/system this IMS is an instance of */
  imsType?: Maybe<ImsType>;
  /** The component this IMS belongs to */
  component?: Maybe<Component>;
};

/** An interface offered by a component which can be counsumed by other components */
export type ComponentInterface = Node & IssueLocation & {
  /** The unique id of this component interface */
  id: Scalars['ID'];
  /**
   * The name of the component interface
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /**
   * A textual description (of the fuction) of this component interface .
   * 
   * Max. 65536 characters
   */
  description?: Maybe<Scalars['String']>;
  /** The parent component of this interface which offers it */
  component: Component;
  /** All issues that are assigned to this component interface matching (if given) `filterBy` */
  issuesOnLocation?: Maybe<IssuePage>;
  /**
   * Components which consume the interface and match the filter.
   * 
   * If no filter is given, all components will be returned
   */
  consumedBy?: Maybe<ComponentPage>;
};


/** An interface offered by a component which can be counsumed by other components */
export type ComponentInterfaceIssuesOnLocationArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** An interface offered by a component which can be counsumed by other components */
export type ComponentInterfaceConsumedByArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ComponentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A cross component issue within ccims which links multiple issues from single ims */
export type Issue = Comment & Node & {
  /** The unique id of this issue */
  id: Scalars['ID'];
  /**
   * The title to display for this issue.
   * 
   * Not unique; Max. 256 characters
   */
  title: Scalars['String'];
  /**
   * The body text of the issue.
   * Markdown supported.
   * 
   * Max. 65536 characters
   */
  body?: Maybe<Scalars['String']>;
  /** The body text of the issue rendered to html */
  bodyRendered?: Maybe<Scalars['String']>;
  /** The user who originally created the issue (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** A list of all people who edited the root of this issue (body and title) */
  editedBy?: Maybe<Array<User>>;
  /** The date the issue was first created on */
  createdAt: Scalars['Date'];
  /** Date when the core issue(title, body etc.) was last changed (comments and other events DO NOT count) */
  lastEditedAt?: Maybe<Scalars['Date']>;
  /** Date when any update / activity was made to any part of the issue (__including__ title, commens, reactions) */
  updatedAt?: Maybe<Scalars['Date']>;
  /** `true` iff the issue is open at this point */
  isOpen: Scalars['Boolean'];
  /** Weather or not this issue has been marked as duplicate of another issue */
  isDuplicate: Scalars['Boolean'];
  /**
   * The ccims-issue-category the issue belongs to.
   * 
   * This can be one of BUG,FEATURE_REQUEST or UNCLASSIFIED
   */
  category: IssueCategory;
  /**
   * `true` iff the user authenticated by the given JWT is permitted to edit this issue.
   * 
   * This only refers to editing the core issue (title, body, etc.)
   */
  currentUserCanEdit: Scalars['Boolean'];
  /** `true` iff the user authenticated by the given JWT is permitted to comment on this issue. */
  currentUserCanComment: Scalars['Boolean'];
  /**
   * A start date set for start of work on this issue.
   * 
   * This is only for displaying and has no effect on the ccims but will be synce to other ims
   */
  startDate?: Maybe<Scalars['Date']>;
  /**
   * A due date set when work on the issue must be done.
   * 
   * This is only for displaying and has no effect on the ccims but will be synce to other ims
   */
  dueDate?: Maybe<Scalars['Date']>;
  /**
   * The time estimated needed for work on this issue.
   * 
   * This is only for displaying and has no effect on the ccims but will be synce to other ims
   */
  estimatedTime?: Maybe<Scalars['TimeSpan']>;
  /**
   * The time already spent on work on this issue.
   * 
   * This is only for displaying and has no effect on the ccims but will be synce to other ims
   */
  spentTime?: Maybe<Scalars['TimeSpan']>;
  /** All issue comments on this issue */
  issueComments?: Maybe<IssueCommentPage>;
  /**
   * All issues linked to from issue (this issue is __origin__ of relation, matching the given filter.
   * If no filter is given, all issues will be returned
   */
  linksToIssues?: Maybe<IssuePage>;
  /**
   * All issues linking to this issue (this issue is __destination__ of relation), matching the given filter.
   * If no filter is given, all issues will be returned
   */
  linkedByIssues?: Maybe<IssuePage>;
  /** All reactions that have been added to the body of this issue */
  reactions?: Maybe<ReactionGroupPage>;
  /**
   * All users who are explicitely assigned to issue, matching the given filter.
   * If no filter is given, all issues will be returned
   */
  assignees?: Maybe<UserPage>;
  /** All labels that are currently assigned to this issue */
  labels?: Maybe<LabelPage>;
  /**
   * All users participating on this issue (by writing a comment, etc.), matching the given filter.
   * If no filter is given, all users will be returned
   */
  participants?: Maybe<UserPage>;
  /**
   * All components where this issue has been pinned, matching the given filter.
   * If no filter is given, all components will be returned
   */
  pinnedOn?: Maybe<ComponentPage>;
  /** All timeline events for this issue in chonological order from oldest to newest, matching (if given) `filterBy` */
  timeline?: Maybe<IssueTimelineItemPage>;
  /** All issue locations this issue is assigned to, matching (if given) `filterBy` */
  locations?: Maybe<IssueLocationPage>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueIssueCommentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueCommentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueLinksToIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueLinkedByIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueReactionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ReactionGroupFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueAssigneesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<UserFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueLabelsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<LabelFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueParticipantsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<UserFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssuePinnedOnArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ComponentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueTimelineArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueTimelineItemFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueLocationsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueLocationFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/**
 * A location an issue can be assigned to
 * 
 * Currently this can be either a component or an interface
 */
export type IssueLocation = {
  /** The unique id of the node of this location */
  id: Scalars['ID'];
  /**
   * The name of the location
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /**
   * A textual description (of the fuction) of this issue location.
   * 
   * Max. 65536 characters
   */
  description?: Maybe<Scalars['String']>;
  /** All issues that are assinged to on this issue location matching (if given) `filterBy` */
  issuesOnLocation?: Maybe<IssuePage>;
};


/**
 * A location an issue can be assigned to
 * 
 * Currently this can be either a component or an interface
 */
export type IssueLocationIssuesOnLocationArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** An event in the timeline of an issue with a date and a creator */
export type IssueTimelineItem = {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
};

/** A label assignable to issues. A label is per-project */
export type Label = Node & {
  /** The unique id of this label */
  id: Scalars['ID'];
  /**
   * The name of the label to display.
   * 
   *  Max. 256 characters
   */
  name: Scalars['String'];
  /**
   * A text describing the labels' function
   * 
   * Max. 65536 characters
   */
  description?: Maybe<Scalars['String']>;
  /** The color of the label in the GUI */
  color?: Maybe<Scalars['Color']>;
  /** The components this label is available on */
  components?: Maybe<ComponentPage>;
  /** All projetcs that this label is used on */
  projects?: Maybe<ProjectPage>;
};


/** A label assignable to issues. A label is per-project */
export type LabelComponentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ComponentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A label assignable to issues. A label is per-project */
export type LabelProjectsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ProjectFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A relation of users who have reacted with a certain reaction to something */
export type ReactionGroup = Node & {
  /** The unique id of this reaction group */
  id: Scalars['ID'];
  /**
   * Users who reacted with this reaction.
   * 
   * If there are only a few, all users will be returned. If too many users are part of this reaction group, only a few will be returned
   */
  users?: Maybe<Array<Maybe<User>>>;
  /**
   * The total number of users in this reaction group.
   * This is needed in case the `users` list was truncated.
   */
  totalUserCount: Scalars['Int'];
  /** The name of the recation with which the people in this reaction group have reacted */
  reaction: Scalars['String'];
};

/** A project is a one unit in which the participating components colaborate */
export type Project = Node & {
  /** The unique id of this project */
  id: Scalars['ID'];
  /**
   * The human readable name of this project
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /** All compomponents which are a part of this project and match (if given) `filterBy` */
  components?: Maybe<ComponentPage>;
  /** Requests component interfaces which are offered by any of this project's components */
  interfaces?: Maybe<ComponentInterfacePage>;
  /** All users that participate in this project and (if given)match `filterBy` */
  users?: Maybe<UserPage>;
  /** The user who administrates "owns" the project */
  owner: User;
  /** All issues on components that are assigned to this project */
  issues?: Maybe<IssuePage>;
  /**
   * All labels which are available on this project, matching the given filter.
   * If no filter is given, all labels will be returned
   */
  labels?: Maybe<LabelPage>;
  /**
   * A textual description of this project.
   * 
   * Max. 65536 characters
   */
  description?: Maybe<Scalars['String']>;
};


/** A project is a one unit in which the participating components colaborate */
export type ProjectComponentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ComponentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A project is a one unit in which the participating components colaborate */
export type ProjectInterfacesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ComponentInterfaceFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A project is a one unit in which the participating components colaborate */
export type ProjectUsersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<UserFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A project is a one unit in which the participating components colaborate */
export type ProjectIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A project is a one unit in which the participating components colaborate */
export type ProjectLabelsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<LabelFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A user of th ccims. Can be assigned to projects, components and can have multiple ims accounts */
export type User = Node & {
  /** The unique id of this user */
  id: Scalars['ID'];
  /** The unique username used for login */
  username: Scalars['String'];
  /** The name of the user to display in the GUI */
  displayName?: Maybe<Scalars['String']>;
  /** The mail address of the user */
  email?: Maybe<Scalars['String']>;
  /** All the projects this user is a participant of matching `filterBy` */
  projects?: Maybe<ProjectPage>;
  /** All issues that this the user is assigned to matching (if given) `filterBy` */
  assignedToIssues?: Maybe<IssuePage>;
  /** All issues that this the user is a participant of matching (if given) `filterBy` */
  participantOfIssues?: Maybe<IssuePage>;
  /** All issue comments (not including issues) written by this user */
  issueComments?: Maybe<IssueCommentPage>;
};


/** A user of th ccims. Can be assigned to projects, components and can have multiple ims accounts */
export type UserProjectsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ProjectFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user of th ccims. Can be assigned to projects, components and can have multiple ims accounts */
export type UserAssignedToIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user of th ccims. Can be assigned to projects, components and can have multiple ims accounts */
export type UserParticipantOfIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user of th ccims. Can be assigned to projects, components and can have multiple ims accounts */
export type UserIssueCommentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueCommentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** An AddedToComponentEvent in the timeline of an issue with a date and a creator */
export type AddedToComponentEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The component the issue was added to */
  component: Component;
};

/** An AddedToLocationEvent in the timeline of an issue with a date and a creator */
export type AddedToLocationEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The location the issue was added to */
  location: IssueLocation;
};

/** An ClosedEvent in the timeline of an issue with a date and a creator */
export type ClosedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
};

/** An AssignedEvent in the timeline of an issue with a date and a creator */
export type AssignedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The user which was newly assigned to this issue */
  assignee: User;
};

/** An CategoryChangedEvent in the timeline of an issue with a date and a creator */
export type CategoryChangedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The old category of the issue */
  oldCategory: IssueCategory;
  /** The new updated issue category */
  newCategory: IssueCategory;
};

/** An DueDateChangedEvent in the timeline of an issue with a date and a creator */
export type DueDateChangedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The old due date */
  oldDueDate?: Maybe<Scalars['Date']>;
  /** The new due date for the issue */
  newDueDate?: Maybe<Scalars['Date']>;
};

/** An DeletedIssueComment in the timeline of an issue with a date and a creator */
export type DeletedIssueComment = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /** The user responsible who originally wrote the comment */
  createdBy?: Maybe<User>;
  /** The date the original comment was first written. It's importand to user __this__ date for sorting to maintain the conversation order */
  createdAt: Scalars['Date'];
  /** The user who __deleted__ the comment */
  deletedBy?: Maybe<User>;
  /** The date the comment was deleted */
  deletedAt?: Maybe<Scalars['Date']>;
};

/** An EstimatedTimeChangedEvent in the timeline of an issue with a date and a creator */
export type EstimatedTimeChangedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The old time estimate for the issue */
  oldEstimatedTime?: Maybe<Scalars['TimeSpan']>;
  /** The new updated time estimate for the issue */
  newEstimatedTime?: Maybe<Scalars['TimeSpan']>;
};

/** An LabelledEvent in the timeline of an issue with a date and a creator */
export type LabelledEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The label which was added to the issue */
  label: Label;
};

/** A commemt on an issue. Not including th issue body itself */
export type IssueComment = IssueTimelineItem & Comment & Node & {
  /** The unique id of this comment */
  id: Scalars['ID'];
  /** The issue this comment belongs to */
  issue: Issue;
  /**
   * The body text of the comment.
   * Markdown supported.
   * 
   * Max. 65536 characters
   */
  body?: Maybe<Scalars['String']>;
  /** The body text of the comment rendered to html */
  bodyRendered?: Maybe<Scalars['String']>;
  /** The user who originally created the comment (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** A list of all people who edited the root of this comment (body and title) */
  editedBy?: Maybe<Array<User>>;
  /** The date the comment was first created on */
  createdAt: Scalars['Date'];
  /** Date when the core comment(title, body etc.) was last changed (comments and other events DO NOT count) */
  lastEditedAt?: Maybe<Scalars['Date']>;
  /**
   * `true` iff the user authenticated by the given JWT is permitted to edit this comment.
   * 
   * This only refers to editing the core comment (title, body, etc.)
   */
  currentUserCanEdit: Scalars['Boolean'];
  /** All reactions on this issue comment */
  reactions?: Maybe<ReactionGroupPage>;
};


/** A commemt on an issue. Not including th issue body itself */
export type IssueCommentReactionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ReactionGroupFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** An MarkedAsDuplicateEvent in the timeline of an issue with a date and a creator */
export type MarkedAsDuplicateEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The issue of which __this__ issue is a duplicate */
  originalIssue?: Maybe<Issue>;
};

/** An LinkEvent in the timeline of an issue with a date and a creator */
export type LinkEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The issue that was linked __to__ (__from__ this issue) */
  linkedIssue?: Maybe<Issue>;
};

/** An PinnedEvent in the timeline of an issue with a date and a creator */
export type PinnedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
};

/**
 * An ReferencedByIssueEvent in the timeline of an issue with a date and a creator
 * 
 * This occurs if this issue is referenced by another known issue
 */
export type ReferencedByIssueEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The issue by which this issue was referenced */
  mentionedAt?: Maybe<Issue>;
  /** The comment in which the reference to this issue was made */
  mentionedInComment?: Maybe<IssueComment>;
};

/** An PriorityChangedEvent in the timeline of an issue with a date and a creator */
export type PriorityChangedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The old priority of the issue */
  oldPriority?: Maybe<Priority>;
  /** The new updated priority of the issue */
  newPriority?: Maybe<Priority>;
};

/** An RemovedFromComponentEvent in the timeline of an issue with a date and a creator */
export type RemovedFromComponentEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The component the issue was removed from */
  removedComponent: Component;
};

/**
 * An ReferencedByOtherEvent in the timeline of an issue with a date and a creator.
 * 
 * This occures if this issue is referenced outside of an issue (e.g. pull request etc.)
 */
export type ReferencedByOtherEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The component from which this issue was referenced */
  component?: Maybe<Component>;
  /** A human readable name of the source of the reference (e.g. 'Pull request #2') */
  source?: Maybe<Scalars['String']>;
  /** An URL to where the issue was linked from */
  sourceURL?: Maybe<Scalars['String']>;
};

/** An RemovedFromLocationEvent in the timeline of an issue with a date and a creator */
export type RemovedFromLocationEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The location the issue was removed from */
  removedLocation: IssueLocation;
};

/** An ReopenedEvent in the timeline of an issue with a date and a creator */
export type ReopenedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
};

/** An StartDateChangedEvent in the timeline of an issue with a date and a creator */
export type StartDateChangedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The start date set for the issue before it was changed */
  oldStartDate?: Maybe<Scalars['Date']>;
  /** The new set start date for the issue */
  newStartDate?: Maybe<Scalars['Date']>;
};

/** An RenamedTitleEvent in the timeline of an issue with a date and a creator */
export type RenamedTitleEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The title of the issue before the change */
  oldTitle: Scalars['String'];
  /** The new updated title of the issue */
  newTitle: Scalars['String'];
};

/** An UnassignedEvent in the timeline of an issue with a date and a creator */
export type UnassignedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The user which was unassigned from this issue */
  removedAssignee: User;
};

/** An UnlabelledEvent in the timeline of an issue with a date and a creator */
export type UnlabelledEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The label which was removed from the issue on this event */
  removedLabel: Label;
};

/** An WasLinkedEvent in the timeline of an issue with a date and a creator */
export type WasLinkedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The issue which this issue is linked to after this event */
  linkedBy?: Maybe<Issue>;
};

/** An UnmarkedAsDuplicateEvent in the timeline of an issue with a date and a creator */
export type UnmarkedAsDuplicateEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
};

/** An WasUnlinkedEvent in the timeline of an issue with a date and a creator */
export type WasUnlinkedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The issue which this issue was linked to before this event */
  unlinkedBy?: Maybe<Issue>;
};

/** An UnpinnedEvent in the timeline of an issue with a date and a creator */
export type UnpinnedEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
};

/** An UnlinkEvent in the timeline of an issue with a date and a creator */
export type UnlinkEvent = IssueTimelineItem & Node & {
  /** The unique id of this timeline item */
  id: Scalars['ID'];
  /** The issue this timeline event belongs to */
  issue: Issue;
  /**
   * The user responsible for the creation of the event (e.g. autor of a comment)
   * 
   * It's possible there is no autor, for example if the action was performed automatically
   */
  createdBy?: Maybe<User>;
  /**
   * The date the event occured on/was created.
   * 
   * This ISN'T updated if the event is be changed
   */
  createdAt: Scalars['Date'];
  /** The issue this issue __linked to__ before this event */
  removedLinkedIssue?: Maybe<Issue>;
};

/** All queries for requesting stuff */
export type Query = {
  /** Requests an object (node) using the given ID. If the given ID is invalid an error will be returned */
  node?: Maybe<Node>;
  /** Returns the string which is given as input */
  echo?: Maybe<Scalars['String']>;
  /** Requests all projects within the current ccims instance mathcing the `filterBy` */
  projects?: Maybe<ProjectPage>;
  /** Returns the user from which the PAI is currently being accessed */
  currentUser?: Maybe<User>;
  /**
   * Checks wether the given username is still available or already taken.
   * 
   * `true` is returned if the username is available and __NOT__ take
   * `false, if it __IS__ already taken and can't be used for a new user
   */
  checkUsername?: Maybe<Scalars['Boolean']>;
};


/** All queries for requesting stuff */
export type QueryNodeArgs = {
  id: Scalars['ID'];
};


/** All queries for requesting stuff */
export type QueryEchoArgs = {
  input?: Maybe<Scalars['String']>;
};


/** All queries for requesting stuff */
export type QueryProjectsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ProjectFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** All queries for requesting stuff */
export type QueryCheckUsernameArgs = {
  username: Scalars['String'];
};

/** Mutations to change the data within the ccims */
export type Mutation = {
  /** A mutation for testing if you're able to use GraphQL */
  testMutation?: Maybe<TestMutationPayload>;
  /** Creates a new issue */
  createIssue?: Maybe<CreateIssuePayload>;
  /** Creates a new comment on an existing issue */
  addIssueComment?: Maybe<AddIssueCommentPayload>;
  /**
   * Deletes an issue comment.
   * 
   * Comments don't get fully deleted but replaced by a
   * 
   * `DeletedComment` (only contains creation/deletion date/user) which is for conversation completness
   */
  deleteIssueComment?: Maybe<DeleteIssueCommentPayload>;
  /** Links an issue to another one, creating a relation */
  linkIssue?: Maybe<LinkIssuePayload>;
  /** Unlink an issue from another and remove their relation */
  unlinkIssue?: Maybe<UnlinkIssuePayload>;
  /** Adds a label to an issue */
  addLabelToIssue?: Maybe<AddLabelToIssuePayload>;
  /** Remove a label that is currently on the issue */
  removeLabelFromIssue?: Maybe<RemoveLabelFromIssuePayload>;
  /** Pins an issue to a component (including in the IMS of the component) */
  pinIssue?: Maybe<PinIssuePayload>;
  /** Unpin an issue from a component */
  unpinIssue?: Maybe<UnpinIssuePayload>;
  /** Change the title (rename) an issue */
  renameIssueTitle?: Maybe<RenameIssueTitlePayload>;
  /** Changes the category of an issue */
  changeIssueCategory?: Maybe<ChangeIssueCategoryPayload>;
  /** Adds a user as assignee to the issue */
  addAssignee?: Maybe<AddAssigneePayload>;
  /** Unassignes a user that is currently an assinee on an issue */
  removeAssignee?: Maybe<RemoveAssigneePayload>;
  /** Closes an open issue */
  closeIssue?: Maybe<CloseIssuePayload>;
  /** Reopen an issue after it has been closed */
  reopenIssue?: Maybe<ReopenIssuePayload>;
  /** Changes the priority of an issue */
  changeIssuePriority?: Maybe<ChangeIssuePriorityPayload>;
  /** Changes the set start date on an issue */
  changeIssueStartDate?: Maybe<ChangeIssueStartDatePayload>;
  /** Changes the set due date on an issue */
  changeIssueDueDate?: Maybe<ChangeIssueDueDatePayload>;
  /** Changes the set estimated time on an issue */
  changeIssueEstimatedTime?: Maybe<ChangeIssueEstimatedTimePayload>;
  /** Adds an issue to a location (location or interface) */
  addIssueToLocation?: Maybe<AddIssueToLocationPayload>;
  /** Removes an issue from an issue location it was assigned to */
  removeIssueFromLocation?: Maybe<RemoveIssueFromLocationPayload>;
  /** Adds an issue to a component (including creating the issue on the ims of the component) */
  addIssueToComponent?: Maybe<AddIssueToComponentPayload>;
  /** Removes an issue from a component it is currently assigned to and deletes it from the ims of the component */
  removeIssueFromComponent?: Maybe<RemoveIssueFromComponentPayload>;
  /** Marks an issue as being a duplicate of another issue */
  markIssueAsDuplicate?: Maybe<MarkIssueAsDuplicatePayload>;
  /** Remove the marking on an issue that it is a duplicate of another issue */
  unmarkIssueAsDuplicate?: Maybe<UnmarkIssueAsDuplicatePayload>;
  /** Adds a reaction by the current user to a comment (issue body or issue comment) */
  addReactionToComment?: Maybe<AddReactionToCommentPayload>;
  /** Remove a reaction from a comment which was added by the current user (issue body or issue comment) */
  removeReactionFromComment?: Maybe<RemoveReactionFromCommentPayload>;
  /** Creates a new project */
  createProject?: Maybe<CreateProjectPayload>;
  /** Delets the specified project */
  deleteProject?: Maybe<DeleteProjectPayload>;
  /** Updates the specified project */
  updateProject?: Maybe<UpdateProjectPayload>;
  /** Adds the specified component to the project if it is not already on the project */
  addComponentToProject?: Maybe<AddComponentToProjectPayload>;
  /** Removes the specified component from the project if it is on the project */
  removeComponentFromProject?: Maybe<RemoveComponentFromProjectPayload>;
  /** Creates a new component in the ccims and adds it to the given users */
  createComponent?: Maybe<CreateComponentPayload>;
  /** Creates a new user in the system */
  createUser?: Maybe<CreateUserPayload>;
  /** Registers/creates a new user in the ccims system */
  registerUser?: Maybe<RegisterUserPayload>;
  /** Create a new label in the system */
  createLabel?: Maybe<CreateLabelPayload>;
};


/** Mutations to change the data within the ccims */
export type MutationTestMutationArgs = {
  input?: Maybe<TestMutationInput>;
};


/** Mutations to change the data within the ccims */
export type MutationCreateIssueArgs = {
  input: CreateIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationAddIssueCommentArgs = {
  input: AddIssueCommentInput;
};


/** Mutations to change the data within the ccims */
export type MutationDeleteIssueCommentArgs = {
  input?: Maybe<DeleteIssueCommentInput>;
};


/** Mutations to change the data within the ccims */
export type MutationLinkIssueArgs = {
  input: LinkIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationUnlinkIssueArgs = {
  input?: Maybe<UnlinkIssueInput>;
};


/** Mutations to change the data within the ccims */
export type MutationAddLabelToIssueArgs = {
  input: AddLabelToIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveLabelFromIssueArgs = {
  input?: Maybe<RemoveLabelFromIssueInput>;
};


/** Mutations to change the data within the ccims */
export type MutationPinIssueArgs = {
  input?: Maybe<PinIssueInput>;
};


/** Mutations to change the data within the ccims */
export type MutationUnpinIssueArgs = {
  input?: Maybe<UnpinIssueInput>;
};


/** Mutations to change the data within the ccims */
export type MutationRenameIssueTitleArgs = {
  input: RenameIssueTitleInput;
};


/** Mutations to change the data within the ccims */
export type MutationChangeIssueCategoryArgs = {
  input: ChangeIssueCategoryInput;
};


/** Mutations to change the data within the ccims */
export type MutationAddAssigneeArgs = {
  input: AddAssigneeInput;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveAssigneeArgs = {
  input: RemoveAssigneeInput;
};


/** Mutations to change the data within the ccims */
export type MutationCloseIssueArgs = {
  input: CloseIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationReopenIssueArgs = {
  input?: Maybe<ReopenIssueInput>;
};


/** Mutations to change the data within the ccims */
export type MutationChangeIssuePriorityArgs = {
  input?: Maybe<ChangeIssuePriorityInput>;
};


/** Mutations to change the data within the ccims */
export type MutationChangeIssueStartDateArgs = {
  input?: Maybe<ChangeIssueStartDateInput>;
};


/** Mutations to change the data within the ccims */
export type MutationChangeIssueDueDateArgs = {
  input: ChangeIssueDueDateInput;
};


/** Mutations to change the data within the ccims */
export type MutationChangeIssueEstimatedTimeArgs = {
  input?: Maybe<ChangeIssueEstimatedTimeInput>;
};


/** Mutations to change the data within the ccims */
export type MutationAddIssueToLocationArgs = {
  input: AddIssueToLocationInput;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveIssueFromLocationArgs = {
  input?: Maybe<RemoveIssueFromLocationInput>;
};


/** Mutations to change the data within the ccims */
export type MutationAddIssueToComponentArgs = {
  input: AddIssueToComponentInput;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveIssueFromComponentArgs = {
  input?: Maybe<RemoveIssueFromComponentInput>;
};


/** Mutations to change the data within the ccims */
export type MutationMarkIssueAsDuplicateArgs = {
  input?: Maybe<MarkIssueAsDuplicateInput>;
};


/** Mutations to change the data within the ccims */
export type MutationUnmarkIssueAsDuplicateArgs = {
  input?: Maybe<UnmarkIssueAsDuplicateInput>;
};


/** Mutations to change the data within the ccims */
export type MutationAddReactionToCommentArgs = {
  input?: Maybe<AddReactionToCommentInput>;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveReactionFromCommentArgs = {
  input?: Maybe<RemoveReactionFromCommentInput>;
};


/** Mutations to change the data within the ccims */
export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


/** Mutations to change the data within the ccims */
export type MutationDeleteProjectArgs = {
  input: DeleteProjectInput;
};


/** Mutations to change the data within the ccims */
export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};


/** Mutations to change the data within the ccims */
export type MutationAddComponentToProjectArgs = {
  input: AddComponentToProjectInput;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveComponentFromProjectArgs = {
  input: RemoveComponentFromProjectInput;
};


/** Mutations to change the data within the ccims */
export type MutationCreateComponentArgs = {
  input: CreateComponentInput;
};


/** Mutations to change the data within the ccims */
export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


/** Mutations to change the data within the ccims */
export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};


/** Mutations to change the data within the ccims */
export type MutationCreateLabelArgs = {
  input: CreateLabelInput;
};

/** The Payload/Response for the addIssueToLocation mutation */
export type TestMutationPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
};

/** The inputs for the testMutation */
export type TestMutationInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
};

/** The Payload/Response for the createIssue mutation */
export type CreateIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The created issue node */
  issue?: Maybe<Issue>;
};

/** The inputs for the createIssue */
export type CreateIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /**
   * The human readable title for the new issue.
   * 
   * This can't be `null`. Max. 256 caracters.
   */
  title: Scalars['String'];
  /**
   * The body text for the issue as markdown.
   * 
   * This can be `null` (will result in an empty body). Max. 65536 characters
   */
  body?: Maybe<Scalars['String']>;
  /**
   * The IDs of the components the issue is mirrored to.
   * 
   * At least one valid component must be given.
   */
  componentIDs: Array<Scalars['ID']>;
  /**
   * The category to assign the issue to.
   * 
   * If none is given, the issue wil have the category `UNCLASSIFIED`.
   */
  category?: Maybe<IssueCategory>;
  /**
   * A list of all label IDs to assign to the new issue.
   * 
   * If `null`, none will be assigned.
   */
  labels?: Maybe<Array<Scalars['ID']>>;
  /**
   * A list of user IDs to added as assignees to the issue.
   * 
   * If `null`, no users will be assigned
   */
  assignees?: Maybe<Array<Scalars['ID']>>;
  /**
   * A list of IDs of issue locations to add the issue to.
   * 
   * If `null`, the issue will not be assigned to any locations
   */
  locations?: Maybe<Array<Scalars['ID']>>;
  /**
   * The start date to be set for the issue.
   * 
   * If `null`, none will be set
   */
  startDate?: Maybe<Scalars['Date']>;
  /**
   * The due date to be set for the issue.
   * 
   * If `null`, none will be set
   */
  dueDate?: Maybe<Scalars['Date']>;
  /**
   * The estimated time to be set for the issue.
   * 
   * If `null`, none will be set
   */
  estimatedTime?: Maybe<Scalars['TimeSpan']>;
};

/** The Payload/Response for the addIssueComment mutation */
export type AddIssueCommentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /**
   * The issue comment object that was created.
   * 
   * __NOTE:__This is also the timeline event!
   */
  comment?: Maybe<IssueComment>;
  /** The issue to which the user was assigned */
  issue?: Maybe<Issue>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the addIssueComment */
export type AddIssueCommentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to which to add a new comment */
  issue: Scalars['ID'];
  /**
   * The body text of the comment to be added.
   * 
   * Max. 65536 characters.
   */
  body: Scalars['String'];
};

/** The Payload/Response for the deleteIssueComment mutation */
export type DeleteIssueCommentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** A replacement for the deleted comment to be shown in the GUI instead of the original comment for the completeness of the history */
  deletedComment?: Maybe<DeletedIssueComment>;
  /** The issue from which the comment was removed */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the deletion of the comment */
  event?: Maybe<DeletedIssueComment>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the deleteIssueComment */
export type DeleteIssueCommentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue comment to be deleted */
  issueComment: Scalars['ID'];
};

/** The Payload/Response for the linkIssue mutation */
export type LinkIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue the `issue` was linked to (the __destination__ of the relation) */
  linkedIssue?: Maybe<Issue>;
  /** The issue which was linked to the `linkedIssue` (the __origin__ of the relation) */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the linking of the issues */
  event?: Maybe<LinkEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the linkIssue */
export type LinkIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to be linked to another one (the __origin__ of the relation) */
  issue: Scalars['ID'];
  /** TheID of the issue to link the above issue to (the __destination__ of the relation) */
  issueToLink: Scalars['ID'];
};

/** The Payload/Response for the unlinkIssue mutation */
export type UnlinkIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue which was unlinked (the former __origin__ of the relation) */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the unlinking of the issue */
  event?: Maybe<UnlinkEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the unlinkIssue */
export type UnlinkIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue which is the __origin__ of the relation */
  issue: Scalars['ID'];
  /** The ID of the issue the link to which sholud be removed (destination of relation) */
  issueToUnlink: Scalars['ID'];
};

/** The Payload/Response for the addToIssueLabel mutation */
export type AddLabelToIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The label that was added to the issue */
  label?: Maybe<Label>;
  /** The issue to which the specified label was added */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the labeling of the issue with the specified label */
  event?: Maybe<LabelledEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the addToIssueLabel */
export type AddLabelToIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to which to add the label */
  issue: Scalars['ID'];
  /** The ID of the label to be added to the specified issue */
  label: Scalars['ID'];
};

/** The Payload/Response for the removeFromIssueLabel mutation */
export type RemoveLabelFromIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The label that was removed from the issue */
  label?: Maybe<Label>;
  /** The issue from which the label was removed */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the removal of the label from the issue */
  event?: Maybe<UnlabelledEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the removeFromIssueLabel */
export type RemoveLabelFromIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue from which to remove a label */
  issue: Scalars['ID'];
  /** The ID of the label to remove from the specified issue */
  label: Scalars['ID'];
};

/** The Payload/Response for the pinIssue mutation */
export type PinIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The component the issue was pinned to */
  component?: Maybe<Component>;
  /** The issue which removed from the location */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the pinnine of the issue to the component */
  event?: Maybe<PinnedEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the pinIssue */
export type PinIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the issue to pin */
  issue: Scalars['ID'];
  /** The component id where to pin the issue */
  component: Scalars['ID'];
};

/** The Payload/Response for the unpinIssue mutation */
export type UnpinIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue which was unpinned by the performed mutation */
  issue?: Maybe<Issue>;
  /** The component the issue was unpinned from */
  component?: Maybe<Comment>;
  /** The issue timeline event for the unpinning of the issue */
  event?: Maybe<UnpinnedEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the unpinIssue */
export type UnpinIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the issue to unpin */
  issue: Scalars['ID'];
  /** The component id where to pin the unissue */
  component: Scalars['ID'];
};

/** The Payload/Response for the renameIssueTitle mutation */
export type RenameIssueTitlePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue which was renamed */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the renaming of the issue */
  event?: Maybe<RenamedTitleEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the renameIssueTitle */
export type RenameIssueTitleInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to rename (Change the title of) */
  issue: Scalars['ID'];
  /**
   * The new title to set for the issue.
   * 
   * Max. 256 characters
   */
  newTitle: Scalars['String'];
};

/** The Payload/Response for the changeIssueCategory mutation */
export type ChangeIssueCategoryPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue of whichthe category was changed */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the changed category */
  event?: Maybe<CategoryChangedEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the changeIssueCategory */
export type ChangeIssueCategoryInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the for which to change the category */
  issue: Scalars['ID'];
  /** The new category to be set for the issue */
  newCategory: IssueCategory;
};

/** The Payload/Response for the addAssignee mutation */
export type AddAssigneePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The user that was assigned to the issue */
  assignee?: Maybe<User>;
  /** The issue to which the user was assigned */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the assigning of the user to the issue */
  event?: Maybe<AssignedEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the addAssignee */
export type AddAssigneeInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to which the new assignee should be added */
  issue: Scalars['ID'];
  /** The ID of the user to be added as assignee to the specified issue */
  user: Scalars['ID'];
};

/** The Payload/Response for the removeAssignee mutation */
export type RemoveAssigneePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The user that was uassigned from the issue */
  user?: Maybe<User>;
  /** The issue from which the user was unassigned */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the uassigning of the user from the issue */
  event?: Maybe<UnassignedEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the removeAssignee */
export type RemoveAssigneeInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue from which to remove an assignee */
  issue: Scalars['ID'];
  /** The ID of the user being unassigned from the specified issue */
  user: Scalars['ID'];
};

/** The Payload/Response for the closeIssue mutation */
export type CloseIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue which was closed */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the closing of the issue */
  event?: Maybe<ClosedEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the closeIssue */
export type CloseIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to be closed */
  issue: Scalars['ID'];
};

/** The Payload/Response for the reopenIssue mutation */
export type ReopenIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue which was reopened */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the reopening of the issue */
  event?: Maybe<ReopenedEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the reopenIssue */
export type ReopenIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the issue to reopen */
  issue: Scalars['ID'];
};

/** The Payload/Response for the changeIssuePriority mutation */
export type ChangeIssuePriorityPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue of which the priority was changed */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the changed priority */
  event?: Maybe<PriorityChangedEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the changeIssuePriority */
export type ChangeIssuePriorityInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to change the priority of */
  issue: Scalars['ID'];
  /** The new priority to be set for the issue */
  newPriority: Priority;
};

/** The Payload/Response for the changeIssueStartDate mutation */
export type ChangeIssueStartDatePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue of which the start date was updated */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the changing start date */
  event?: Maybe<StartDateChangedEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the changeIssueStartDate */
export type ChangeIssueStartDateInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to change the start date of */
  issue: Scalars['ID'];
  /** The new start date to assign to the issue */
  newStartDate: Scalars['Date'];
};

/** The Payload/Response for the changeIssueDueDate mutation */
export type ChangeIssueDueDatePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue of which the due date was changed */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the changed due date */
  event?: Maybe<DueDateChangedEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the changeIssueDueDate */
export type ChangeIssueDueDateInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue of which to change the due date */
  issue: Scalars['ID'];
  /** The new due date to be set for the issue */
  newDueDate: Scalars['Date'];
};

/** The Payload/Response for the changeIssueEstimatedTime mutation */
export type ChangeIssueEstimatedTimePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue of which the estimated time was changed */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the changed estimated time */
  event?: Maybe<EstimatedTimeChangedEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the changeIssueEstimatedTime */
export type ChangeIssueEstimatedTimeInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue for which to change the estimated time */
  issue: Scalars['ID'];
  /** The time span to be set as new estimated time for the issue */
  newEstimatedTime: Scalars['TimeSpan'];
};

/** The Payload/Response for the addIssueToLocation mutation */
export type AddIssueToLocationPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The location the issue was added to */
  location?: Maybe<IssueLocation>;
  /** The issue which removed from the location */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the addition of the issue to the location */
  event?: Maybe<AddedToLocationEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the addIssueToLocation */
export type AddIssueToLocationInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to be added to the specified issue location */
  issue: Scalars['ID'];
  /** The ID of the issue location the issue should be added to */
  location: Scalars['ID'];
};

/** The Payload/Response for the removeIssueFromLocation mutation */
export type RemoveIssueFromLocationPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue location the issue was removed from */
  location?: Maybe<IssueLocation>;
  /** The issue which removed from the location */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the removal of the issue from the location */
  event?: Maybe<RemovedFromLocationEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the removeIssueFromLocation */
export type RemoveIssueFromLocationInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to remove from the specified location */
  issue: Scalars['ID'];
  /** The issue-location ID from which to remove the issue */
  location: Scalars['ID'];
};

/** The Payload/Response for the addIssueToComponent mutation */
export type AddIssueToComponentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The component (with its IMS) to which the issue was added */
  component?: Maybe<Component>;
  /** The issue which added to the component and its IMS */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the addition of this issue to this component */
  event?: Maybe<AddedToComponentEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the addIssueToComponent */
export type AddIssueToComponentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to be added to the specified component */
  issue: Scalars['ID'];
  /** The ID of the component the issue should be added to */
  component: Scalars['ID'];
};

/** The Payload/Response for the removeIssueFromComponent mutation */
export type RemoveIssueFromComponentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The component the issue was removed from (including from the components IMS) */
  component?: Maybe<Component>;
  /** The issue which removed from the component */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the removal of the issue from the component */
  event?: Maybe<RemovedFromComponentEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the removeIssueFromComponent */
export type RemoveIssueFromComponentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /**
   * The ID of the issue to remove from the specified component
   * 
   * (it will be deleted in the components IMS)
   */
  issue: Scalars['ID'];
  /** The ID of the component from which to remove the issue */
  component: Scalars['ID'];
};

/** The Payload/Response for the markIssueAsDuplicate mutation */
export type MarkIssueAsDuplicatePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The original issue of which the `issue` was marked as a duplicate of */
  originalIssue?: Maybe<Issue>;
  /** The issue which is a duplicate of the `originalIssue` */
  issue?: Maybe<Issue>;
  /** The issue timeline event for marking the issue as a duplicate */
  event?: Maybe<MarkedAsDuplicateEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the markIssueAsDuplicate */
export type MarkIssueAsDuplicateInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to be marked as duplicate (the duplicate) */
  issue: Scalars['ID'];
  /** The ID of the issue the above one is a duplicate of (the original) */
  originalIssue: Scalars['ID'];
};

/** The Payload/Response for the unmarkIssueAsDuplicate mutation */
export type UnmarkIssueAsDuplicatePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The issue which was unmarked as duplicate */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the removal of the duplicate marking of the issue */
  event?: Maybe<UnmarkedAsDuplicateEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the unmarkIssueAsDuplicate */
export type UnmarkIssueAsDuplicateInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue which to unmark as duplicate */
  issue: Scalars['ID'];
};

/** The Payload/Response for the addToCommentReaction mutation */
export type AddReactionToCommentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The comment the reaction was added to */
  comment?: Maybe<Comment>;
  /** The group of users that all reacted to this comment with the same reaction */
  reaction?: Maybe<ReactionGroup>;
};

/** The inputs for the addToCommentReaction */
export type AddReactionToCommentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the comment to which to add the specified reaction by the current user */
  comment: Scalars['ID'];
  /** The name of the reaction to be added to the specified comment by the current user */
  reaction: Scalars['String'];
};

/** The Payload/Response for the removeFromCommentReaction mutation */
export type RemoveReactionFromCommentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
};

/** The inputs for the removeFromCommentReaction */
export type RemoveReactionFromCommentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the comment from which to remove the specified reaction by the current user */
  comment: Scalars['ID'];
  /** The name of the reaction to remove from the given comment */
  reactionToRemove: Scalars['String'];
};

/** The Payload/Response for the createProject mutation */
export type CreateProjectPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The project created by this mutation */
  project?: Maybe<Project>;
};

/** The inputs for the createProject mutation */
export type CreateProjectInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /**
   * The name of the project
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /**
   * The description of the project
   * 
   * Max. 65536 characters
   */
  description?: Maybe<Scalars['String']>;
  /**
   * The list of components for the project to be initialized with.
   * 
   * If `null`, the peoject will contain no components (However, they can be added later)
   */
  components?: Maybe<Array<Scalars['ID']>>;
  /**
   * The users which will initially be part of the project.
   * The owner will always be added.
   * 
   * If `null`, only the owner will be added to the project
   */
  users?: Maybe<Array<Scalars['ID']>>;
  /** The owner user of this component. This user will be able to administrate the component */
  owner: Scalars['ID'];
};

/** The Payload/Response for the deleteProject mutation */
export type DeleteProjectPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
};

/** The inputs for the deleteProject mutation */
export type DeleteProjectInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the project to delete */
  projectId: Scalars['ID'];
};

/** The Payload/Response for the updateProject mutation */
export type UpdateProjectPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The project updated by this mutation */
  project?: Maybe<Project>;
};

/** The inputs for the updateProject mutation, updates only the provided fields */
export type UpdateProjectInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the project to update */
  projectId: Scalars['ID'];
  /**
   * The name of the project
   * 
   * Max. 256 characters
   */
  name?: Maybe<Scalars['String']>;
  /**
   * The description of the project
   * 
   * Max. 65536 characters
   */
  description?: Maybe<Scalars['String']>;
};

/** The Payload/Response for the addComponentToProject mutation */
export type AddComponentToProjectPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The project to which the component was added */
  project?: Maybe<Project>;
  /** The component which was added to the project */
  component?: Maybe<Component>;
};

/** The inputs for the addComponentToProject mutation */
export type AddComponentToProjectInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the project to which to add the component */
  projectId: Scalars['ID'];
  /** The id of the component to add to the project */
  componentId: Scalars['ID'];
};

/** The Payload/Response for the removeComponentFromProject mutation */
export type RemoveComponentFromProjectPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The project from which the component was removed */
  project: Project;
  /** The component which was removed from the project */
  component: Component;
};

/** The inputs for the removeComponentFromProject mutation */
export type RemoveComponentFromProjectInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the project from which to remove the component */
  projectId: Scalars['ID'];
  /** The id of the component to remove from the project */
  componentId: Scalars['ID'];
};

/** The Payload/Response for the createComponent mutation */
export type CreateComponentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The component created by this mutation */
  component?: Maybe<Component>;
  /** The IMS of the component created by this mutation */
  ims?: Maybe<Ims>;
};

/** The inputs for the createComponent mutation */
export type CreateComponentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /**
   * The (non unique) display name of this component
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /** The ID of the user who administrates "owns" the component */
  owner: Scalars['ID'];
  /**
   * A textual description (of the fuction) of this component.
   * 
   * Max. 65536 characters. `null` equivalent to ""
   */
  description?: Maybe<Scalars['String']>;
  /** The type/system the IMS of this component is an instance of */
  imsType: ImsType;
  /**
   * The endpoint where to reach the IMS of this component instance.
   * 
   * In the most cases this will be a URL in the form of
   * ```
   * https://example.com/api/[API_KEY]
   * ```
   * where strings in [] can be replaced by the IMS extension with values needed
   * (either dynamid, like the API key of a user or static, like values from the config).
   * See the documentation for the IMS extions for information which keys are expected.
   * 
   * In rare cases depending on the IMS type this might be empty or not a URL
   */
  endpoint?: Maybe<Scalars['String']>;
  /**
   * Data needed for the connection to the IMS API.
   * 
   * See the documentation for the IMS extions for information which keys are expected.
   * This must be a valid JSON-string
   */
  connectionData?: Maybe<Scalars['JSON']>;
  /**
   * If given, the component will be added to the projects with those IDs.
   * 
   * Can be `null`
   */
  projects?: Maybe<Array<Scalars['ID']>>;
  /**
   * If given, the new component will consume the interfacs with the given IDs.
   * 
   * Can be `null`
   */
  consumedInterfaces?: Maybe<Array<Scalars['ID']>>;
};

/** The Payload/Response for the createUser mutation */
export type CreateUserPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The user created by this mutation */
  user?: Maybe<User>;
};

/** The inputs for the createUser mutation */
export type CreateUserInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /**
   * The unique username used for login.
   * 
   * Max. 100 characters.
   */
  username: Scalars['String'];
  /**
   * The name of the user to display in the GUI.
   * 
   * Max. 200 characters.
   */
  displayName: Scalars['String'];
  /** The password for the new user in plain text */
  password: Scalars['String'];
  /**
   * The mail address of the user.
   * 
   * Max. 320 characters. Must be a valid email address
   */
  email?: Maybe<Scalars['String']>;
};

/** The Payload/Response for the public registerUser mutation */
export type RegisterUserPayload = {
  /** The ID of the user created by this mutation */
  userId?: Maybe<Scalars['ID']>;
};

/** The inputs for the registerUser mutation */
export type RegisterUserInput = {
  /**
   * The unique username used for login.
   * 
   * Max. 100 characters.
   */
  username: Scalars['String'];
  /**
   * The name of the user to display in the GUI.
   * 
   * Max. 200 characters.
   */
  displayName: Scalars['String'];
  /** The password for the new user in plain text */
  password: Scalars['String'];
  /**
   * The mail address of the user.
   * 
   * Max. 320 characters. Must be a valid email address
   */
  email?: Maybe<Scalars['String']>;
};

/** The Payload/Response for the createLabel mutation */
export type CreateLabelPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The label created by this mutation */
  label?: Maybe<Label>;
};

/** The inputs for the createLabel mutation */
export type CreateLabelInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /**
   * The name of the label which to show in the GUI.
   * 
   * Max. 256 characters.
   */
  name: Scalars['String'];
  /**
   * The description text for the label.
   * 
   * Max. 65536 characters.
   */
  description?: Maybe<Scalars['String']>;
  /**
   * The color of the label
   * 
   * Must be a valid Color string
   */
  color: Scalars['Color'];
  /**
   * A list of components to which to add the label. At least one component is required
   * 
   * This must be a valid component ids
   */
  components: Array<Scalars['ID']>;
};

export type CreateComponentMutationVariables = Exact<{
  input: CreateComponentInput;
}>;


export type CreateComponentMutation = { createComponent?: Maybe<{ component?: Maybe<(
      Pick<Component, 'id' | 'name'>
      & { ims?: Maybe<Pick<Ims, 'id'>>, projects?: Maybe<{ edges?: Maybe<Array<Maybe<{ node?: Maybe<Pick<Project, 'id'>> }>>> }> }
    )> }> };

export type GetIssueGraphDataQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;


export type GetIssueGraphDataQuery = { node?: Maybe<{ components?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<Component, 'id'>
        & { bugs?: Maybe<Pick<IssuePage, 'totalCount'>>, featureRequests?: Maybe<Pick<IssuePage, 'totalCount'>>, unclassified?: Maybe<Pick<IssuePage, 'totalCount'>> }
      )>>> }>, interfaces?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<ComponentInterface, 'id'>
        & { bugs?: Maybe<Pick<IssuePage, 'totalCount'>>, featureRequests?: Maybe<Pick<IssuePage, 'totalCount'>>, unclassified?: Maybe<Pick<IssuePage, 'totalCount'>>, consumedBy?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id'>>>> }> }
      )>>> }>, linkingIssues?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<Issue, 'id' | 'category'>
        & { locations?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>>>> }>, linksToIssues?: Maybe<{ nodes?: Maybe<Array<Maybe<(
            Pick<Issue, 'id' | 'category'>
            & { locations?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>>>> }> }
          )>>> }> }
      )>>> }> }> };

export type GetAllProjectsQueryVariables = Exact<{
  filter?: Maybe<ProjectFilter>;
}>;


export type GetAllProjectsQuery = { projects?: Maybe<{ edges?: Maybe<Array<Maybe<{ node?: Maybe<Pick<Project, 'id' | 'name'>> }>>> }> };

export type GetProjectQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProjectQuery = { node?: Maybe<Pick<Project, 'id' | 'name'>> };

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { createProject?: Maybe<{ project?: Maybe<Pick<Project, 'id'>> }> };

export type DeleteProjectMutationVariables = Exact<{
  input: DeleteProjectInput;
}>;


export type DeleteProjectMutation = { deleteProject?: Maybe<Pick<DeleteProjectPayload, 'clientMutationID'>> };

export const CreateComponentDocument = gql`
    mutation CreateComponent($input: CreateComponentInput!) {
  createComponent(input: $input) {
    component {
      id
      name
      ims {
        id
      }
      projects {
        edges {
          node {
            id
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateComponentGQL extends Apollo.Mutation<CreateComponentMutation, CreateComponentMutationVariables> {
    document = CreateComponentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetIssueGraphDataDocument = gql`
    query GetIssueGraphData($projectId: ID!) {
  node(id: $projectId) {
    ... on Project {
      components {
        nodes {
          id
          bugs: issuesOnLocation(filterBy: {category: BUG}) {
            totalCount
          }
          featureRequests: issuesOnLocation(filterBy: {category: FEATURE_REQUEST}) {
            totalCount
          }
          unclassified: issuesOnLocation(filterBy: {category: UNCLASSIFIED}) {
            totalCount
          }
        }
      }
      interfaces {
        nodes {
          id
          bugs: issuesOnLocation(filterBy: {category: BUG}) {
            totalCount
          }
          featureRequests: issuesOnLocation(filterBy: {category: FEATURE_REQUEST}) {
            totalCount
          }
          unclassified: issuesOnLocation(filterBy: {category: UNCLASSIFIED}) {
            totalCount
          }
          consumedBy {
            nodes {
              id
            }
          }
        }
      }
      linkingIssues: issues(filterBy: {linksIssues: true}) {
        nodes {
          id
          category
          locations {
            nodes {
              id
            }
          }
          linksToIssues {
            nodes {
              id
              category
              locations {
                nodes {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetIssueGraphDataGQL extends Apollo.Query<GetIssueGraphDataQuery, GetIssueGraphDataQueryVariables> {
    document = GetIssueGraphDataDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAllProjectsDocument = gql`
    query GetAllProjects($filter: ProjectFilter) {
  projects(filterBy: $filter) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllProjectsGQL extends Apollo.Query<GetAllProjectsQuery, GetAllProjectsQueryVariables> {
    document = GetAllProjectsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetProjectDocument = gql`
    query GetProject($id: ID!) {
  node(id: $id) {
    ... on Project {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetProjectGQL extends Apollo.Query<GetProjectQuery, GetProjectQueryVariables> {
    document = GetProjectDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateProjectDocument = gql`
    mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    project {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateProjectGQL extends Apollo.Mutation<CreateProjectMutation, CreateProjectMutationVariables> {
    document = CreateProjectDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteProjectDocument = gql`
    mutation DeleteProject($input: DeleteProjectInput!) {
  deleteProject(input: $input) {
    clientMutationID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteProjectGQL extends Apollo.Mutation<DeleteProjectMutation, DeleteProjectMutationVariables> {
    document = DeleteProjectDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }