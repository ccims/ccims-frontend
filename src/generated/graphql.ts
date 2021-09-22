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
   * Please note: alpha channel is not supported and will be dropped
   * All common CSS formats are supported
   * For a detailed list of supported values, see https://www.npmjs.com/package/color-string
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
  /** GitHub (or GitHub enterprise server) is the IMS for the component */
  Github = 'GITHUB'
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
  RemovedFromComponentEvent = 'REMOVED_FROM_COMPONENT_EVENT',
  /** An event if an artifact has been added to the issue */
  AddedArtifactEvent = 'ADDED_ARTIFACT_EVENT',
  /** An event if an artifact has been removed from the issue */
  RemovedArtifactEvent = 'REMOVED_ARTIFACT_EVENT',
  /** An event if a non functional constraint has been added to the issue */
  AddedNonFunctionalConstraintEvent = 'ADDED_NON_FUNCTIONAL_CONSTRAINT_EVENT',
  /** An event if a non functional constraint has been removed from the issue */
  RemovedNonFunctionalConstrainEvent = 'REMOVED_NON_FUNCTIONAL_CONSTRAIN_EVENT'
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





/** An object which can be identified by an ID - called a Node */
export type Node = {
  /**
   * The ID of this Node. Every Node will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
};

/** An edge for a ComponentInterfacePage to link a cursor to an element */
export type ComponentInterfaceEdge = {
  /** The ComponentInterface linked to by this edge */
  node?: Maybe<ComponentInterface>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a ComponentPage to link a cursor to an element */
export type ComponentEdge = {
  /** The Component linked to by this edge */
  node?: Maybe<Component>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a IssueCommentPage to link a cursor to an element */
export type IssueCommentEdge = {
  /** The IssueComment linked to by this edge */
  node?: Maybe<IssueComment>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a IssuePage to link a cursor to an element */
export type IssueEdge = {
  /** The Issue linked to by this edge */
  node?: Maybe<Issue>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a IssueLocationPage to link a cursor to an element */
export type IssueLocationEdge = {
  /** The IssueLocation linked to by this edge */
  node?: Maybe<IssueLocation>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a IssueTimelineItemPage to link a cursor to an element */
export type IssueTimelineItemEdge = {
  /** The IssueTimelineItem linked to by this edge */
  node?: Maybe<IssueTimelineItem>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a LabelPage to link a cursor to an element */
export type LabelEdge = {
  /** The Label linked to by this edge */
  node?: Maybe<Label>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a ProjectPage to link a cursor to an element */
export type ProjectEdge = {
  /** The Project linked to by this edge */
  node?: Maybe<Project>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a ReactionGroupPage to link a cursor to an element */
export type ReactionGroupEdge = {
  /** The ReactionGroup linked to by this edge */
  node?: Maybe<ReactionGroup>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** An edge for a UserPage to link a cursor to an element */
export type UserEdge = {
  /** The User linked to by this edge */
  node?: Maybe<User>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** Filters for component matching the given properties */
export type ComponentFilter = {
  /** The id of the Component creating the issue must be any of the given ones */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The Component must have been created __after__ the given date (inclusive) */
  createdAfter?: Maybe<Scalars['Date']>;
  /** The Component must have been created __before__ the given date (inclusive) */
  createdBefore?: Maybe<Scalars['Date']>;
  /** The name of the Component must match the given RegEx */
  name?: Maybe<Scalars['String']>;
  /** The __RegEx__ the description of the Component needs to match */
  description?: Maybe<Scalars['String']>;
  /** The last update to this Component must have occurred __after__ the given date (inclusive) */
  lastUpdatedAfter?: Maybe<Scalars['Date']>;
  /** The last update to this Component must have occurred __before__ the given date (inclusive) */
  lastUpdatedBefore?: Maybe<Scalars['Date']>;
  /** The components repositoryURL must match the given __RegEx__ */
  repositoryURL?: Maybe<Scalars['String']>;
  /** The IMS type of a component must be one of the given ones */
  imsType?: Maybe<Array<ImsType>>;
};

/** Filters for an instance of a component's interface */
export type ComponentInterfaceFilter = {
  /** The id of the ComponentInterface creating the issue must be any of the given ones */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The ComponentInterface must have been created __after__ the given date (inclusive) */
  createdAfter?: Maybe<Scalars['Date']>;
  /** The ComponentInterface must have been created __before__ the given date (inclusive) */
  createdBefore?: Maybe<Scalars['Date']>;
  /** The name of the ComponentInterface must match the given RegEx */
  name?: Maybe<Scalars['String']>;
  /** The __RegEx__ the description of the ComponentInterface needs to match */
  description?: Maybe<Scalars['String']>;
  /** The last update to this ComponentInterface must have occurred __after__ the given date (inclusive) */
  lastUpdatedAfter?: Maybe<Scalars['Date']>;
  /** The last update to this ComponentInterface must have occurred __before__ the given date (inclusive) */
  lastUpdatedBefore?: Maybe<Scalars['Date']>;
  /** The __RegEx__ the type of the ComponentInterface needs to match */
  type?: Maybe<Scalars['String']>;
  /** If given, only interfaces, that are __offered by__ one of the components with the IDs given can match the given filter */
  component?: Maybe<Array<Scalars['ID']>>;
  /** If given, only interfaces which are consumed by at least one of the components with the given ids can match the filter */
  consumedBy?: Maybe<Array<Scalars['ID']>>;
};

/** Filter for comments on issues (not including the issue bodies themselves). All parameters given in this filter will be connected via _AND_ */
export type IssueCommentFilter = {
  /** The id of the IssueComment creating the issue must be any of the given ones */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The IssueComment must have been created __after__ the given date (inclusive) */
  createdAfter?: Maybe<Scalars['Date']>;
  /** The IssueComment must have been created __before__ the given date (inclusive) */
  createdBefore?: Maybe<Scalars['Date']>;
  /** The id of the user who __last__ edited the IssueComment must match any of the given ids */
  editedBy?: Maybe<Array<Scalars['ID']>>;
  /** Match all IssueComments last edited after the given date (inclusive) */
  lastEditedAfter?: Maybe<Scalars['Date']>;
  /** Match all IssueComments last edited before the given date (inclusive) */
  lastEditedBefore?: Maybe<Scalars['Date']>;
  /** The body of a IssueComment must match this __RegEx__ to match the filter */
  body?: Maybe<Scalars['String']>;
  /** A IssueComment must have all the reactions in one of the lists given. */
  reactions?: Maybe<Array<Array<Scalars['String']>>>;
  /** If given, filters for IssueComments which the user either has or hasn't got edit permissions */
  currentUserCanEdit?: Maybe<Scalars['Boolean']>;
  /** The id of the issue the comment belongs to must match any of the given ids */
  issue?: Maybe<Array<Scalars['ID']>>;
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
  /** The issue must match the full search */
  fullSearch?: Maybe<FullSearch>;
  /** The id of the user last editing the issue must match any of the ones in the list */
  editedBy?: Maybe<Array<Scalars['ID']>>;
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

/** Filters for issues which have at least one of the specified labels or of which the title or body matches the specified text regex */
export type FullSearch = {
  /** A Regex which the title or body of the issue needs to match */
  text?: Maybe<Scalars['String']>;
  /** The issue must have at least one label with one of the given ids */
  labels?: Maybe<Array<Scalars['ID']>>;
};

/** Filters for Issues locations (components and interfaces). All parameters given in this filter will be connected via _AND_ */
export type IssueLocationFilter = {
  /** The id of the IssueLocation creating the issue must be any of the given ones */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The IssueLocation must have been created __after__ the given date (inclusive) */
  createdAfter?: Maybe<Scalars['Date']>;
  /** The IssueLocation must have been created __before__ the given date (inclusive) */
  createdBefore?: Maybe<Scalars['Date']>;
  /** The name of the IssueLocation must match the given RegEx */
  name?: Maybe<Scalars['String']>;
  /** The __RegEx__ the description of the IssueLocation needs to match */
  description?: Maybe<Scalars['String']>;
  /** The last update to this IssueLocation must have occurred __after__ the given date (inclusive) */
  lastUpdatedAfter?: Maybe<Scalars['Date']>;
  /** The last update to this IssueLocation must have occurred __before__ the given date (inclusive) */
  lastUpdatedBefore?: Maybe<Scalars['Date']>;
};

/**
 * Filters for certain timeline events. All parameters given in this filter will be connected via _AND_
 * 
 * __Please note:__ It's currently __not__ possible to filter for specific properties of an event. Might be added in future
 */
export type IssueTimelineItemFilter = {
  /** The id of the IssueTimelineItem creating the issue must be any of the given ones */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The IssueTimelineItem must have been created __after__ the given date (inclusive) */
  createdAfter?: Maybe<Scalars['Date']>;
  /** The IssueTimelineItem must have been created __before__ the given date (inclusive) */
  createdBefore?: Maybe<Scalars['Date']>;
  /** The type of the timeline item must match one of the given ones */
  type?: Maybe<Array<IssueTimelineItemType>>;
};

/** A Filter data input for labels.  All parameters given in this filter will be connected via _AND_ */
export type LabelFilter = {
  /** The id of the Label creating the issue must be any of the given ones */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The Label must have been created __after__ the given date (inclusive) */
  createdAfter?: Maybe<Scalars['Date']>;
  /** The Label must have been created __before__ the given date (inclusive) */
  createdBefore?: Maybe<Scalars['Date']>;
  /** The name of the Label must match the given RegEx */
  name?: Maybe<Scalars['String']>;
  /** The __RegEx__ the description of the Label needs to match */
  description?: Maybe<Scalars['String']>;
  /** The last update to this Label must have occurred __after__ the given date (inclusive) */
  lastUpdatedAfter?: Maybe<Scalars['Date']>;
  /** The last update to this Label must have occurred __before__ the given date (inclusive) */
  lastUpdatedBefore?: Maybe<Scalars['Date']>;
  /** A list of label colours. Any one or more of the given colours need to match the labels colour. */
  color?: Maybe<Array<Scalars['Color']>>;
};

/** Filter for a Project. All parameters given in this filter will be connected via _AND_ */
export type ProjectFilter = {
  /** The name of the Project must match the given RegEx */
  name?: Maybe<Scalars['String']>;
  /** The projects description must match the given __RegEx__ */
  description?: Maybe<Scalars['String']>;
  /** At least one of the users with the given ids must be part of the project */
  users?: Maybe<Array<Scalars['ID']>>;
  /** At least one of the issues given must be on a component assigned to the project */
  issues?: Maybe<Array<Scalars['ID']>>;
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
  /** The User's username must match this given RegEx */
  username?: Maybe<Scalars['String']>;
  /** The User's display name must match this given RegEx */
  displayName?: Maybe<Scalars['String']>;
  /** The User's email must match this given RegEx */
  email?: Maybe<Scalars['String']>;
  /** The User must be assigned to at least one of the issues with the given ids */
  assignedToIssues?: Maybe<Array<Scalars['ID']>>;
  /** The User must be participant of at least one of the issues with the given ids */
  participantOfIssues?: Maybe<Array<Scalars['ID']>>;
  /** The User must have written or edited at least one of the comments (issue or comment) with the given ids */
  comments?: Maybe<Array<Scalars['ID']>>;
};

/** A page of multiple ComponentInterfaces */
export type ComponentInterfacePage = Page & {
  /** All ComponentInterfaces on this page */
  nodes?: Maybe<Array<Maybe<ComponentInterface>>>;
  /** Edges to all ComponentInterfaces containing the cursor */
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

/** A page of multiple Components */
export type ComponentPage = Page & {
  /** All Components on this page */
  nodes?: Maybe<Array<Maybe<Component>>>;
  /** Edges to all Components containing the cursor */
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

/** A page of multiple IssueComments */
export type IssueCommentPage = Page & {
  /** All IssueComments on this page */
  nodes?: Maybe<Array<Maybe<IssueComment>>>;
  /** Edges to all IssueComments containing the cursor */
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

/** A page of multiple IssueLocations */
export type IssueLocationPage = Page & {
  /** All IssueLocations on this page */
  nodes?: Maybe<Array<Maybe<IssueLocation>>>;
  /** Edges to all IssueLocations containing the cursor */
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

/** A page of multiple Issues */
export type IssuePage = Page & {
  /** All Issues on this page */
  nodes?: Maybe<Array<Maybe<Issue>>>;
  /** Edges to all Issues containing the cursor */
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

/** A page of multiple Labels */
export type LabelPage = Page & {
  /** All Labels on this page */
  nodes?: Maybe<Array<Maybe<Label>>>;
  /** Edges to all Labels containing the cursor */
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

/** A page of multiple IssueTimelineItems */
export type IssueTimelineItemPage = Page & {
  /** All IssueTimelineItems on this page */
  nodes?: Maybe<Array<Maybe<IssueTimelineItem>>>;
  /** Edges to all IssueTimelineItems containing the cursor */
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

/** A page of multiple Users */
export type UserPage = Page & {
  /** All Users on this page */
  nodes?: Maybe<Array<Maybe<User>>>;
  /** Edges to all Users containing the cursor */
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

/** A page of multiple ReactionGroups */
export type ReactionGroupPage = Page & {
  /** All ReactionGroups on this page */
  nodes?: Maybe<Array<Maybe<ReactionGroup>>>;
  /** Edges to all ReactionGroups containing the cursor */
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

/** A page of multiple Projects */
export type ProjectPage = Page & {
  /** All Projects on this page */
  nodes?: Maybe<Array<Maybe<Project>>>;
  /** Edges to all Projects containing the cursor */
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
  /**
   * The ID of this Comment. Every Comment will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the Comment (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the Comment was first created on */
  createdAt: Scalars['Date'];
  /**
   * The body text of the Comment.
   * Markdown supported.
   * 
   * Max. 65536 characters
   */
  body: Scalars['String'];
  /** The body text of the Comment rendered to html */
  bodyRendered: Scalars['String'];
  /**
   * `true` iff the User authenticated by the given JWT is permitted to edit this Comment.
   * 
   * This only refers to editing the core comment (title, body, etc.)
   */
  currentUserCanEdit: Scalars['Boolean'];
  /** Date when the Comment's body was last edited */
  lastEditedAt: Scalars['Date'];
  /** All Users who edited this Comment (body and/or title) */
  editedBy?: Maybe<UserPage>;
  /** All reactions that have been added to this Comment */
  reactions?: Maybe<ReactionGroupPage>;
};


/** An interface specifying an editable text block (e.g. Issue, Comment) */
export type CommentEditedByArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<UserFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
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
  /**
   * The ID of this Component. Every Component will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the Component (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the Component was first created on */
  createdAt: Scalars['Date'];
  /**
   * The (non unique) display name of this Component
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /**
   * A textual description (of the function) of this Component.
   * 
   * Max. 65536 characters
   */
  description: Scalars['String'];
  /** Date when the name, description or any other field directly on Component was last updated */
  lastUpdatedAt: Scalars['Date'];
  /** All Issues that are assinged to on this Component matching (if given) `filterBy` */
  issuesOnLocation?: Maybe<IssuePage>;
  /**
   * The URL where the code repository of this component is located
   * 
   * Max. 65536 characters
   */
  repositoryURL?: Maybe<Scalars['String']>;
  /** All issues that are mirrored on this component (not the issue location but the ims) matching (if given) `filterBy` */
  issues?: Maybe<IssuePage>;
  /** All projects that this component is assigned to matching the `filterBy` */
  projects?: Maybe<ProjectPage>;
  /** Requests component interfaces which this component offers */
  interfaces?: Maybe<ComponentInterfacePage>;
  /** Requests component interfaces that are used/consumed by this component */
  consumedInterfaces?: Maybe<ComponentInterfacePage>;
  /** All labels which are available on this component, matching (if given) `filterBy` */
  labels?: Maybe<LabelPage>;
  /** All IMSComponents which this component is synced to, matching (if given) `filterBy` */
  imsComponents?: Maybe<ImsComponentPage>;
  /** All Artifacts on this Component, matching (if given) `filterBy` */
  artifacts?: Maybe<ArtifactPage>;
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
 * A component known to ccims.
 * 
 * A component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export type ComponentImsComponentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ImsComponentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/**
 * A component known to ccims.
 * 
 * A component can have issues and can be assigned to multiple projects. (NOTE: One IMS per component)
 */
export type ComponentArtifactsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ArtifactFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** An interface offered by a component which can be counsumed by other components */
export type ComponentInterface = Node & IssueLocation & {
  /**
   * The ID of this ComponentInterface. Every ComponentInterface will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the ComponentInterface (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the ComponentInterface was first created on */
  createdAt: Scalars['Date'];
  /**
   * The (non unique) display name of this ComponentInterface
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /**
   * A textual description (of the function) of this ComponentInterface.
   * 
   * Max. 65536 characters
   */
  description: Scalars['String'];
  /** Date when the name, description or any other field directly on ComponentInterface was last updated */
  lastUpdatedAt: Scalars['Date'];
  /** All Issues that are assinged to on this ComponentInterface matching (if given) `filterBy` */
  issuesOnLocation?: Maybe<IssuePage>;
  /** The type of the ComponentInterface */
  type: Scalars['String'];
  /** The parent component of this interface which offers it, null if deleted */
  component?: Maybe<Component>;
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
  /**
   * The ID of this Issue. Every Issue will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the Issue (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the Issue was first created on */
  createdAt: Scalars['Date'];
  /**
   * The body text of the Issue.
   * Markdown supported.
   * 
   * Max. 65536 characters
   */
  body: Scalars['String'];
  /** The body text of the Issue rendered to html */
  bodyRendered: Scalars['String'];
  /**
   * `true` iff the User authenticated by the given JWT is permitted to edit this Issue.
   * 
   * This only refers to editing the core comment (title, body, etc.)
   */
  currentUserCanEdit: Scalars['Boolean'];
  /** Date when the Issue's body was last edited */
  lastEditedAt: Scalars['Date'];
  /** All Users who edited this Issue (body and/or title) */
  editedBy?: Maybe<UserPage>;
  /** All reactions that have been added to the body of this issue */
  reactions?: Maybe<ReactionGroupPage>;
  /**
   * The title to display for this issue.
   * 
   * Not unique; Max. 256 characters
   */
  title: Scalars['String'];
  /** Date when any update / activity was made to any part of the issue (__including__ title, commens, reactions) */
  lastUpdatedAt: Scalars['Date'];
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
  /** All components this issue is on */
  components?: Maybe<ComponentPage>;
  /** All Artifacts that are currently assigned to this Issue, matching (if given) `filterBy */
  artifacts?: Maybe<ArtifactPage>;
  /**
   * All NonFunctionalConstraints on this Issue, matching (if given) `filterBy.
   * WARNING: if filterBy.isActive is not set, ALL NonFunctionalConstraints are returned
   */
  nonFunctionalConstraints?: Maybe<NonFunctionalConstraintPage>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueEditedByArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<UserFilter>;
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


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueComponentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ComponentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueArtifactsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ArtifactFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A cross component issue within ccims which links multiple issues from single ims */
export type IssueNonFunctionalConstraintsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<NonFunctionalConstraintFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/**
 * A location an issue can be assigned to
 * 
 * Currently this can be either a component or an interface
 */
export type IssueLocation = {
  /**
   * The ID of this IssueLocation. Every IssueLocation will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the IssueLocation (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the IssueLocation was first created on */
  createdAt: Scalars['Date'];
  /**
   * The (non unique) display name of this IssueLocation
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /**
   * A textual description (of the function) of this IssueLocation.
   * 
   * Max. 65536 characters
   */
  description: Scalars['String'];
  /** Date when the name, description or any other field directly on IssueLocation was last updated */
  lastUpdatedAt: Scalars['Date'];
  /** All Issues that are assinged to on this IssueLocation matching (if given) `filterBy` */
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
  /**
   * The ID of this IssueTimelineItem. Every IssueTimelineItem will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the IssueTimelineItem (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the IssueTimelineItem was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this IssueTimelineItem belongs to */
  issue: Issue;
};

/** A label assignable to issues. A label is per-component */
export type Label = Node & {
  /**
   * The ID of this Label. Every Label will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the Label (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the Label was first created on */
  createdAt: Scalars['Date'];
  /**
   * The (non unique) display name of this Label
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /**
   * A textual description (of the function) of this Label.
   * 
   * Max. 65536 characters
   */
  description: Scalars['String'];
  /** Date when the name, description or any other field directly on Label was last updated */
  lastUpdatedAt: Scalars['Date'];
  /** The color of the label in the GUI */
  color: Scalars['Color'];
  /** The components this label is available on */
  components?: Maybe<ComponentPage>;
  /** All projetcs that this label is used on */
  projects?: Maybe<ProjectPage>;
};


/** A label assignable to issues. A label is per-component */
export type LabelComponentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ComponentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A label assignable to issues. A label is per-component */
export type LabelProjectsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ProjectFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A relation of users who have reacted with a certain reaction to something */
export type ReactionGroup = Node & {
  /**
   * The ID of this ReactionGroup. Every ReactionGroup will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The name of the recation with which the people in this reaction group have reacted */
  reaction: Scalars['String'];
  /** Users who reacted with this reaction. */
  users?: Maybe<UserPage>;
};


/** A relation of users who have reacted with a certain reaction to something */
export type ReactionGroupUsersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<UserFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A project is a one unit in which the participating components colaborate */
export type Project = Node & {
  /**
   * The ID of this Project. Every Project will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /**
   * The (non unique) display name of this Project
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /**
   * A textual description (of the function) of this Project.
   * 
   * Max. 65536 characters
   */
  description: Scalars['String'];
  /** All Components which are a part of this Project and match (if given) `filterBy` */
  components?: Maybe<ComponentPage>;
  /** Requests ComponentInterfaces which are offered by any of this Project's Components */
  interfaces?: Maybe<ComponentInterfacePage>;
  /** All Issues on Components that are assigned to this Project */
  issues?: Maybe<IssuePage>;
  /**
   * All Labels which are available on this Project, matching the given filter.
   * If no filter is given, all Labels will be returned
   */
  labels?: Maybe<LabelPage>;
  /** All Artifacts on Components which are part of this Project */
  artifacts?: Maybe<ArtifactPage>;
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


/** A project is a one unit in which the participating components colaborate */
export type ProjectArtifactsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ArtifactFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A user registered  */
export type User = {
  /**
   * The ID of this User. Every User will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The unique username used */
  username: Scalars['String'];
  /** The name of the User to display in the GUI */
  displayName: Scalars['String'];
  /** The mail address of the User */
  email?: Maybe<Scalars['String']>;
  /** All Issues that this the User is assigned to matching (if given) `filterBy` */
  assignedToIssues?: Maybe<IssuePage>;
  /** All Issues that this the User is a participant of matching (if given) `filterBy` */
  participantOfIssues?: Maybe<IssuePage>;
  /** All IssueComments (not including Issues) written by this User */
  issueComments?: Maybe<IssueCommentPage>;
};


/** A user registered  */
export type UserAssignedToIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user registered  */
export type UserParticipantOfIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user registered  */
export type UserIssueCommentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueCommentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** An AddedToComponentEvent in the timeline of an issue with a date and a creator */
export type AddedToComponentEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this AddedToComponentEvent. Every AddedToComponentEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the AddedToComponentEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the AddedToComponentEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this AddedToComponentEvent belongs to */
  issue: Issue;
  /** The component the issue was added to, null if deleted */
  component?: Maybe<Component>;
};

/** An AddedToLocationEvent in the timeline of an issue with a date and a creator */
export type AddedToLocationEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this AddedToLocationEvent. Every AddedToLocationEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the AddedToLocationEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the AddedToLocationEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this AddedToLocationEvent belongs to */
  issue: Issue;
  /** The location the issue was added to, null if deleted */
  location?: Maybe<IssueLocation>;
};

/** An ClosedEvent in the timeline of an issue with a date and a creator */
export type ClosedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this ClosedEvent. Every ClosedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the ClosedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the ClosedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this ClosedEvent belongs to */
  issue: Issue;
};

/** An AssignedEvent in the timeline of an issue with a date and a creator */
export type AssignedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this AssignedEvent. Every AssignedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the AssignedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the AssignedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this AssignedEvent belongs to */
  issue: Issue;
  /** The user which was newly assigned to this issue, null if deleted */
  assignee?: Maybe<User>;
};

/** An CategoryChangedEvent in the timeline of an issue with a date and a creator */
export type CategoryChangedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this CategoryChangedEvent. Every CategoryChangedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the CategoryChangedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the CategoryChangedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this CategoryChangedEvent belongs to */
  issue: Issue;
  /** The old category of the issue */
  oldCategory: IssueCategory;
  /** The new updated issue category */
  newCategory: IssueCategory;
};

/** An DueDateChangedEvent in the timeline of an issue with a date and a creator */
export type DueDateChangedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this DueDateChangedEvent. Every DueDateChangedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the DueDateChangedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the DueDateChangedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this DueDateChangedEvent belongs to */
  issue: Issue;
  /** The old due date */
  oldDueDate?: Maybe<Scalars['Date']>;
  /** The new due date for the issue */
  newDueDate?: Maybe<Scalars['Date']>;
};

/** An DeletedIssueComment in the timeline of an issue with a date and a creator */
export type DeletedIssueComment = IssueTimelineItem & Node & {
  /**
   * The ID of this DeletedIssueComment. Every DeletedIssueComment will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the DeletedIssueComment (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the DeletedIssueComment was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this DeletedIssueComment belongs to */
  issue: Issue;
  /** The user who __deleted__ the comment */
  deletedBy?: Maybe<User>;
  /** The date the comment was deleted */
  deletedAt?: Maybe<Scalars['Date']>;
};

/** An EstimatedTimeChangedEvent in the timeline of an issue with a date and a creator */
export type EstimatedTimeChangedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this EstimatedTimeChangedEvent. Every EstimatedTimeChangedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the EstimatedTimeChangedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the EstimatedTimeChangedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this EstimatedTimeChangedEvent belongs to */
  issue: Issue;
  /** The old time estimate for the issue */
  oldEstimatedTime?: Maybe<Scalars['TimeSpan']>;
  /** The new updated time estimate for the issue */
  newEstimatedTime?: Maybe<Scalars['TimeSpan']>;
};

/** An LabelledEvent in the timeline of an issue with a date and a creator */
export type LabelledEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this LabelledEvent. Every LabelledEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the LabelledEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the LabelledEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this LabelledEvent belongs to */
  issue: Issue;
  /** The label which was added to the issue, null if deleted */
  label?: Maybe<Label>;
};

/** A commemt on an issue. Not including th issue body itself */
export type IssueComment = IssueTimelineItem & Comment & Node & {
  /**
   * The ID of this IssueComment. Every IssueComment will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the IssueComment (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the IssueComment was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this IssueComment belongs to */
  issue: Issue;
  /**
   * The body text of the IssueComment.
   * Markdown supported.
   * 
   * Max. 65536 characters
   */
  body: Scalars['String'];
  /** The body text of the IssueComment rendered to html */
  bodyRendered: Scalars['String'];
  /**
   * `true` iff the User authenticated by the given JWT is permitted to edit this IssueComment.
   * 
   * This only refers to editing the core comment (title, body, etc.)
   */
  currentUserCanEdit: Scalars['Boolean'];
  /** Date when the IssueComment's body was last edited */
  lastEditedAt: Scalars['Date'];
  /** All Users who edited this IssueComment (body and/or title) */
  editedBy?: Maybe<UserPage>;
  /** All reactions that have been added to this IssueComment */
  reactions?: Maybe<ReactionGroupPage>;
};


/** A commemt on an issue. Not including th issue body itself */
export type IssueCommentEditedByArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<UserFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
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
  /**
   * The ID of this MarkedAsDuplicateEvent. Every MarkedAsDuplicateEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the MarkedAsDuplicateEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the MarkedAsDuplicateEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this MarkedAsDuplicateEvent belongs to */
  issue: Issue;
  /** The issue of which __this__ issue is a duplicate, null if deleted */
  originalIssue?: Maybe<Issue>;
};

/** An LinkEvent in the timeline of an issue with a date and a creator */
export type LinkEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this LinkEvent. Every LinkEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the LinkEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the LinkEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this LinkEvent belongs to */
  issue: Issue;
  /** The issue that was linked __to__ (__from__ this issue), nul if deleted */
  linkedIssue?: Maybe<Issue>;
};

/** An PinnedEvent in the timeline of an issue with a date and a creator */
export type PinnedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this PinnedEvent. Every PinnedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the PinnedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the PinnedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this PinnedEvent belongs to */
  issue: Issue;
  /** The component the issue was pinned on, null if deleted */
  component?: Maybe<Component>;
};

/**
 * An ReferencedByIssueEvent in the timeline of an issue with a date and a creator
 * 
 * This occurs if this issue is referenced by another known issue
 */
export type ReferencedByIssueEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this ReferencedByIssueEvent. Every ReferencedByIssueEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the ReferencedByIssueEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the ReferencedByIssueEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this ReferencedByIssueEvent belongs to */
  issue: Issue;
  /** The issue by which this issue was referenced */
  mentionedAt?: Maybe<Issue>;
  /** The comment in which the reference to this issue was made */
  mentionedInComment?: Maybe<IssueComment>;
};

/** An PriorityChangedEvent in the timeline of an issue with a date and a creator */
export type PriorityChangedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this PriorityChangedEvent. Every PriorityChangedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the PriorityChangedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the PriorityChangedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this PriorityChangedEvent belongs to */
  issue: Issue;
  /** The old priority of the issue */
  oldPriority?: Maybe<Priority>;
  /** The new updated priority of the issue */
  newPriority?: Maybe<Priority>;
};

/** An RemovedFromComponentEvent in the timeline of an issue with a date and a creator */
export type RemovedFromComponentEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this RemovedFromComponentEvent. Every RemovedFromComponentEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the RemovedFromComponentEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the RemovedFromComponentEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this RemovedFromComponentEvent belongs to */
  issue: Issue;
  /** The component the issue was removed from, null if deleted */
  removedComponent?: Maybe<Component>;
};

/**
 * An ReferencedByOtherEvent in the timeline of an issue with a date and a creator.
 * 
 * This occures if this issue is referenced outside of an issue (e.g. pull request etc.)
 */
export type ReferencedByOtherEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this ReferencedByOtherEvent. Every ReferencedByOtherEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the ReferencedByOtherEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the ReferencedByOtherEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this ReferencedByOtherEvent belongs to */
  issue: Issue;
  /** The component from which this issue was referenced, null if deleted */
  component?: Maybe<Component>;
  /** A human readable name of the source of the reference (e.g. 'Pull request #2') */
  source?: Maybe<Scalars['String']>;
  /** An URL to where the issue was linked from */
  sourceURL?: Maybe<Scalars['String']>;
};

/** An RemovedFromLocationEvent in the timeline of an issue with a date and a creator */
export type RemovedFromLocationEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this RemovedFromLocationEvent. Every RemovedFromLocationEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the RemovedFromLocationEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the RemovedFromLocationEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this RemovedFromLocationEvent belongs to */
  issue: Issue;
  /** The location the issue was removed from, null if deleted */
  removedLocation?: Maybe<IssueLocation>;
};

/** An ReopenedEvent in the timeline of an issue with a date and a creator */
export type ReopenedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this ReopenedEvent. Every ReopenedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the ReopenedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the ReopenedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this ReopenedEvent belongs to */
  issue: Issue;
};

/** An StartDateChangedEvent in the timeline of an issue with a date and a creator */
export type StartDateChangedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this StartDateChangedEvent. Every StartDateChangedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the StartDateChangedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the StartDateChangedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this StartDateChangedEvent belongs to */
  issue: Issue;
  /** The start date set for the issue before it was changed */
  oldStartDate?: Maybe<Scalars['Date']>;
  /** The new set start date for the issue */
  newStartDate?: Maybe<Scalars['Date']>;
};

/** An RenamedTitleEvent in the timeline of an issue with a date and a creator */
export type RenamedTitleEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this RenamedTitleEvent. Every RenamedTitleEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the RenamedTitleEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the RenamedTitleEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this RenamedTitleEvent belongs to */
  issue: Issue;
  /** The title of the issue before the change */
  oldTitle: Scalars['String'];
  /** The new updated title of the issue */
  newTitle: Scalars['String'];
};

/** An UnassignedEvent in the timeline of an issue with a date and a creator */
export type UnassignedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this UnassignedEvent. Every UnassignedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the UnassignedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the UnassignedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this UnassignedEvent belongs to */
  issue: Issue;
  /** The user which was unassigned from this issue, null if deleted */
  removedAssignee?: Maybe<User>;
};

/** An UnlabelledEvent in the timeline of an issue with a date and a creator */
export type UnlabelledEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this UnlabelledEvent. Every UnlabelledEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the UnlabelledEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the UnlabelledEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this UnlabelledEvent belongs to */
  issue: Issue;
  /** The label which was removed from the issue on this event, null if deleted */
  removedLabel?: Maybe<Label>;
};

/** An WasLinkedEvent in the timeline of an issue with a date and a creator */
export type WasLinkedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this WasLinkedEvent. Every WasLinkedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the WasLinkedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the WasLinkedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this WasLinkedEvent belongs to */
  issue: Issue;
  /** The issue which this issue is linked to after this event, null if deleted */
  linkedBy?: Maybe<Issue>;
};

/** An UnmarkedAsDuplicateEvent in the timeline of an issue with a date and a creator */
export type UnmarkedAsDuplicateEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this UnmarkedAsDuplicateEvent. Every UnmarkedAsDuplicateEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the UnmarkedAsDuplicateEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the UnmarkedAsDuplicateEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this UnmarkedAsDuplicateEvent belongs to */
  issue: Issue;
};

/** An WasUnlinkedEvent in the timeline of an issue with a date and a creator */
export type WasUnlinkedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this WasUnlinkedEvent. Every WasUnlinkedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the WasUnlinkedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the WasUnlinkedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this WasUnlinkedEvent belongs to */
  issue: Issue;
  /** The issue which this issue was linked to before this event, null if deleted */
  unlinkedBy?: Maybe<Issue>;
};

/** An UnpinnedEvent in the timeline of an issue with a date and a creator */
export type UnpinnedEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this UnpinnedEvent. Every UnpinnedEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the UnpinnedEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the UnpinnedEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this UnpinnedEvent belongs to */
  issue: Issue;
  /** The component the issue was previously pinned on, null if deleted */
  component?: Maybe<Component>;
};

/** An UnlinkEvent in the timeline of an issue with a date and a creator */
export type UnlinkEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this UnlinkEvent. Every UnlinkEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the UnlinkEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the UnlinkEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this UnlinkEvent belongs to */
  issue: Issue;
  /** The issue this issue __linked to__ before this event */
  removedLinkedIssue?: Maybe<Issue>;
};

/** A user of the ccims. Can be assigned to projects, components and can have multiple ims accounts */
export type CcimsUser = Node & User & {
  /**
   * The ID of this CCIMSUser. Every CCIMSUser will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The unique username used for login */
  username: Scalars['String'];
  /** The name of the CCIMSUser to display in the GUI */
  displayName: Scalars['String'];
  /** The mail address of the CCIMSUser */
  email?: Maybe<Scalars['String']>;
  /** All Issues that this the CCIMSUser is assigned to matching (if given) `filterBy` */
  assignedToIssues?: Maybe<IssuePage>;
  /** All Issues that this the CCIMSUser is a participant of matching (if given) `filterBy` */
  participantOfIssues?: Maybe<IssuePage>;
  /** All IssueComments (not including Issues) written by this CCIMSUser */
  issueComments?: Maybe<IssueCommentPage>;
  /** All IMSUsers of this CCIMSUser which match `filterBy` */
  imsUsers?: Maybe<ImsUserPage>;
};


/** A user of the ccims. Can be assigned to projects, components and can have multiple ims accounts */
export type CcimsUserAssignedToIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user of the ccims. Can be assigned to projects, components and can have multiple ims accounts */
export type CcimsUserParticipantOfIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user of the ccims. Can be assigned to projects, components and can have multiple ims accounts */
export type CcimsUserIssueCommentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueCommentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user of the ccims. Can be assigned to projects, components and can have multiple ims accounts */
export type CcimsUserImsUsersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ImsUserFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A page of multiple IMSUsers */
export type ImsUserPage = Page & {
  /** All IMSUsers on this page */
  nodes?: Maybe<Array<Maybe<ImsUser>>>;
  /** Edges to all IMSUsers containing the cursor */
  edges?: Maybe<Array<Maybe<ImsUserEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** An edge for a IMSUserPage to link a cursor to an element */
export type ImsUserEdge = {
  /** The IMSUser linked to by this edge */
  node?: Maybe<ImsUser>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** Filter for a user of the system. All parameters given in this filter will be connected via _AND_ */
export type ImsUserFilter = {
  /** The IMSUser's username must match this given RegEx */
  username?: Maybe<Scalars['String']>;
  /** The IMSUser's display name must match this given RegEx */
  displayName?: Maybe<Scalars['String']>;
  /** The IMSUser's email must match this given RegEx */
  email?: Maybe<Scalars['String']>;
  /** The IMSUser must be assigned to at least one of the issues with the given ids */
  assignedToIssues?: Maybe<Array<Scalars['ID']>>;
  /** The IMSUser must be participant of at least one of the issues with the given ids */
  participantOfIssues?: Maybe<Array<Scalars['ID']>>;
  /** The IMSUser must have written or edited at least one of the comments (issue or comment) with the given ids */
  comments?: Maybe<Array<Scalars['ID']>>;
  /** The IMSUser must be part of one of the specified IMS with the given ids */
  ims?: Maybe<Array<Scalars['ID']>>;
};

/** A user of the ims. Can be assigned to projects, components */
export type ImsUser = Node & User & {
  /**
   * The ID of this IMSUser. Every IMSUser will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The unique username used */
  username: Scalars['String'];
  /** The name of the IMSUser to display in the GUI */
  displayName: Scalars['String'];
  /** The mail address of the IMSUser */
  email?: Maybe<Scalars['String']>;
  /** All Issues that this the IMSUser is assigned to matching (if given) `filterBy` */
  assignedToIssues?: Maybe<IssuePage>;
  /** All Issues that this the IMSUser is a participant of matching (if given) `filterBy` */
  participantOfIssues?: Maybe<IssuePage>;
  /** All IssueComments (not including Issues) written by this IMSUser */
  issueComments?: Maybe<IssueCommentPage>;
  /** The associated IMS of the user */
  ims?: Maybe<Ims>;
};


/** A user of the ims. Can be assigned to projects, components */
export type ImsUserAssignedToIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user of the ims. Can be assigned to projects, components */
export type ImsUserParticipantOfIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A user of the ims. Can be assigned to projects, components */
export type ImsUserIssueCommentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueCommentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/**
 * An issue management system. This will be an __instance__ of one of the available IMS Types.
 * 
 * E.g. a GitHub Enterprise instance, or GitHub itself.
 */
export type Ims = Node & {
  /**
   * The ID of this IMS. Every IMS will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The type/system this IMS is an instance of */
  imsType: ImsType;
  /** All IMSUsers with this IMS */
  users?: Maybe<ImsUserPage>;
  /** All IMSComponents with this IMS */
  imsComponents?: Maybe<ImsComponentPage>;
};


/**
 * An issue management system. This will be an __instance__ of one of the available IMS Types.
 * 
 * E.g. a GitHub Enterprise instance, or GitHub itself.
 */
export type ImsUsersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ImsUserFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/**
 * An issue management system. This will be an __instance__ of one of the available IMS Types.
 * 
 * E.g. a GitHub Enterprise instance, or GitHub itself.
 */
export type ImsImsComponentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ImsComponentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A page of multiple IMSs */
export type ImsPage = Page & {
  /** All IMSs on this page */
  nodes?: Maybe<Array<Maybe<Ims>>>;
  /** Edges to all IMSs containing the cursor */
  edges?: Maybe<Array<Maybe<ImsEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** An edge for a IMSPage to link a cursor to an element */
export type ImsEdge = {
  /** The IMS linked to by this edge */
  node?: Maybe<Ims>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** Filter for a IMS of the system. All parameters given in this filter will be connected via _AND_ */
export type ImsFilter = {
  /** The IMS must be used for at least one of the specified Components using any IMSComponent */
  components?: Maybe<Array<Scalars['ID']>>;
  /** The IMS must be used for at least one of the specified IMSComponents */
  imsComponents?: Maybe<Array<Scalars['ID']>>;
};

/** An component on an ims. For example a single GitHub repository */
export type ImsComponent = Node & {
  /**
   * The ID of this IMSComponent. Every IMSComponent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The IMS which is linked to the Component */
  ims?: Maybe<Ims>;
  /** The component which is linked by the IMS */
  component?: Maybe<Component>;
};

/** An edge for a IMSComponentPage to link a cursor to an element */
export type ImsComponentEdge = {
  /** The IMSComponent linked to by this edge */
  node?: Maybe<ImsComponent>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** Filter for a IMSComponent of the system. All parameters given in this filter will be connected via _AND_ */
export type ImsComponentFilter = {
  /** The IMSComponent must be used to link any IMS to at least one of the specified components */
  components?: Maybe<Array<Scalars['ID']>>;
  /** The IMSComponent must be used to link at least one of the specified ims to any component */
  ims?: Maybe<Array<Scalars['ID']>>;
};

/** A page of multiple IMSComponents */
export type ImsComponentPage = Page & {
  /** All IMSComponents on this page */
  nodes?: Maybe<Array<Maybe<ImsComponent>>>;
  /** Edges to all IMSComponents containing the cursor */
  edges?: Maybe<Array<Maybe<ImsComponentEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** An artifact assignable to issues. An artifact is per-component */
export type Artifact = Node & {
  /**
   * The ID of this Artifact. Every Artifact will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the Artifact (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the Artifact was first created on */
  createdAt: Scalars['Date'];
  /** The component this Artifact is available on */
  component?: Maybe<Component>;
  /** The URI identifying the resource */
  uri: Scalars['String'];
  /** The start (inclusive) of the lines range the Artifact refers to, optional (can only be applied to text resources) */
  lineRangeStart?: Maybe<Scalars['Int']>;
  /** The end (inclusive) of the lines range the Artifact refers to, optional (can only be applied to text resources) */
  lineRangeEnd?: Maybe<Scalars['Int']>;
  /** All issues that have the given artifact */
  issues?: Maybe<IssuePage>;
};


/** An artifact assignable to issues. An artifact is per-component */
export type ArtifactIssuesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<IssueFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** An edge for a ArtifactPage to link a cursor to an element */
export type ArtifactEdge = {
  /** The Artifact linked to by this edge */
  node?: Maybe<Artifact>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** Filters for Artifacts matching the given properties */
export type ArtifactFilter = {
  /** The id of the Artifact creating the issue must be any of the given ones */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The Artifact must have been created __after__ the given date (inclusive) */
  createdAfter?: Maybe<Scalars['Date']>;
  /** The Artifact must have been created __before__ the given date (inclusive) */
  createdBefore?: Maybe<Scalars['Date']>;
  /** The uri of the Artifact must match the given RegEx */
  uri?: Maybe<Scalars['String']>;
};

/** A page of multiple Artifacts */
export type ArtifactPage = Page & {
  /** All Artifacts on this page */
  nodes?: Maybe<Array<Maybe<Artifact>>>;
  /** Edges to all Artifacts containing the cursor */
  edges?: Maybe<Array<Maybe<ArtifactEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** A non functional constraint assignable to a specific issue. A NonFunctionalConstraint is per-issue */
export type NonFunctionalConstraint = Node & {
  /**
   * The ID of this NonFunctionalConstraint. Every NonFunctionalConstraint will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the NonFunctionalConstraint (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the NonFunctionalConstraint was first created on */
  createdAt: Scalars['Date'];
  /** The content of the constraint, defines the constraint */
  content: Scalars['String'];
  /**
   * A textual description (of the function) of this NonFunctionalConstraint.
   * 
   * Max. 65536 characters
   */
  description: Scalars['String'];
  /** True iff the NonFunctionalConstraint is currently active on the issue. */
  isActive: Scalars['Boolean'];
  /** The issue this NonFunctionalConstraint is part of (this is also provided if the NonFunctionalConstraint is not active) */
  issue: Issue;
};

/** An edge for a NonFunctionalConstraintPage to link a cursor to an element */
export type NonFunctionalConstraintEdge = {
  /** The NonFunctionalConstraint linked to by this edge */
  node?: Maybe<NonFunctionalConstraint>;
  /** The cursor for use in the pagination */
  cursor: Scalars['String'];
};

/** Filters for NonFunctionalConstraint matching the given properties */
export type NonFunctionalConstraintFilter = {
  /** The id of the NonFunctionalConstraint creating the issue must be any of the given ones */
  createdBy?: Maybe<Array<Scalars['ID']>>;
  /** The NonFunctionalConstraint must have been created __after__ the given date (inclusive) */
  createdAfter?: Maybe<Scalars['Date']>;
  /** The NonFunctionalConstraint must have been created __before__ the given date (inclusive) */
  createdBefore?: Maybe<Scalars['Date']>;
  /** If true, only NonFunctionalConstraints which are currently active are returned, if false only NonFunctionalConstraints which are NOT active are returned. All are returned if not provided */
  isActive?: Maybe<Scalars['Boolean']>;
  /** The __RegEx__ the content of the NonFunctionalConstraint needs to match */
  content?: Maybe<Scalars['String']>;
  /** The __RegEx__ the description of the NonFunctionalConstraint needs to match */
  description?: Maybe<Scalars['String']>;
};

/** A page of multiple NonFunctionalConstraints */
export type NonFunctionalConstraintPage = Page & {
  /** All NonFunctionalConstraints on this page */
  nodes?: Maybe<Array<Maybe<NonFunctionalConstraint>>>;
  /** Edges to all NonFunctionalConstraints containing the cursor */
  edges?: Maybe<Array<Maybe<NonFunctionalConstraintEdge>>>;
  /** Information about the current page (like length, first/last element) */
  pageInfo: PageInfo;
  /**
   * The total number of elements matching the filter
   * 
   * (Even ones that don't match the current page)
   */
  totalCount: Scalars['Int'];
};

/** An AddedArtifactEvent in the timeline of an issue with a date and a creator */
export type AddedArtifactEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this AddedArtifactEvent. Every AddedArtifactEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the AddedArtifactEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the AddedArtifactEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this AddedArtifactEvent belongs to */
  issue: Issue;
  /** The Artifact which was added to the Issue, null if deleted */
  artifact?: Maybe<Artifact>;
};

/** An RemovedArtifactEvent in the timeline of an issue with a date and a creator */
export type RemovedArtifactEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this RemovedArtifactEvent. Every RemovedArtifactEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the RemovedArtifactEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the RemovedArtifactEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this RemovedArtifactEvent belongs to */
  issue: Issue;
  /** The Artifact which was removed from the Issue, null if deleted */
  removedArtifact?: Maybe<Artifact>;
};

/** An AddedNonFunctionalConstraintEvent in the timeline of an issue with a date and a creator */
export type AddedNonFunctionalConstraintEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this AddedNonFunctionalConstraintEvent. Every AddedNonFunctionalConstraintEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the AddedNonFunctionalConstraintEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the AddedNonFunctionalConstraintEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this AddedNonFunctionalConstraintEvent belongs to */
  issue: Issue;
  /** The NonFunctionalConstraint which was added to the Issue, null if deleted */
  nonFunctionalConstraint?: Maybe<NonFunctionalConstraint>;
};

/** An RemovedNonFunctionalConstraintEvent in the timeline of an issue with a date and a creator */
export type RemovedNonFunctionalConstraintEvent = IssueTimelineItem & Node & {
  /**
   * The ID of this RemovedNonFunctionalConstraintEvent. Every RemovedNonFunctionalConstraintEvent will have an non-empty and non-null edge.
   * 
   * If this is ever empty or null, something went wrong.
   */
  id?: Maybe<Scalars['ID']>;
  /** The user who originally created the RemovedNonFunctionalConstraintEvent (in ccims or any ims) */
  createdBy?: Maybe<User>;
  /** The date the RemovedNonFunctionalConstraintEvent was first created on */
  createdAt: Scalars['Date'];
  /** The Issue this RemovedNonFunctionalConstraintEvent belongs to */
  issue: Issue;
  /** The NonFunctionalConstraint which was removed from the Issue, null if deleted */
  removedNonFunctionalConstraint?: Maybe<NonFunctionalConstraint>;
};

/** All queries for requesting stuff */
export type Query = {
  /** Requests an object (node) using the given ID. If the given ID is invalid an error will be returned */
  node?: Maybe<Node>;
  /** Returns the string which is given as input */
  echo?: Maybe<Scalars['String']>;
  /** Requests all projects within the current ccims instance matching the `filterBy` */
  projects?: Maybe<ProjectPage>;
  /** Requests all components within the current ccims instance matching the `filterBy` */
  components?: Maybe<ComponentPage>;
  /** Requests all IMSs within the current ccims instance matching the `filterBy` */
  imss?: Maybe<ImsPage>;
  /** Returns the user from which the PAI is currently being accessed */
  currentUser?: Maybe<User>;
  /**
   * Checks wether the given username is still available or already taken.
   * 
   * `true` is returned if the username is available and __NOT__ take
   * `false, if it __IS__ already taken and can't be used for a new user
   */
  checkUsername?: Maybe<Scalars['Boolean']>;
  /** Searches for users with a similar displayName or username, returns max 10 users */
  searchUser: Array<User>;
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
export type QueryComponentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ComponentFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** All queries for requesting stuff */
export type QueryImssArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  filterBy?: Maybe<ImsFilter>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** All queries for requesting stuff */
export type QueryCheckUsernameArgs = {
  username: Scalars['String'];
};


/** All queries for requesting stuff */
export type QuerySearchUserArgs = {
  text: Scalars['String'];
};

/** Mutations to change the data within the ccims */
export type Mutation = {
  /** Creates a new issue */
  createIssue?: Maybe<CreateIssuePayload>;
  /** Delets the specified issue */
  deleteIssue?: Maybe<DeleteIssuePayload>;
  /** Creates a new comment on an existing issue */
  addIssueComment?: Maybe<AddIssueCommentPayload>;
  /** Updates a Comment. Fields which are not provided are not updated. */
  updateComment?: Maybe<UpdateCommentPayload>;
  /**
   * Deletes an issue comment.
   * 
   * Comments don't get fully deleted but replaced by a
   * 
   * `DeletedComment` (only contains creation/deletion date/user) which is for conversation completness
   */
  deleteIssueComment?: Maybe<DeleteIssueCommentPayload>;
  /** Links an issue to another one, creating a relation. It is not possible to link an Issue to itself. */
  linkIssue?: Maybe<LinkIssuePayload>;
  /** Unlinks an issue from another one, removing a relation */
  unlinkIssue?: Maybe<UnlinkIssuePayload>;
  /** Adds a label to an issue */
  addLabelToIssue?: Maybe<AddLabelToIssuePayload>;
  /** Remove a label from an issue */
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
  /** Reopen an open issue */
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
  /** Removes an issue from a location (location or interface) */
  removeIssueFromLocation?: Maybe<RemoveIssueFromLocationPayload>;
  /** Adds an issue to a component (including creating the issue on the ims of the component) */
  addIssueToComponent?: Maybe<AddIssueToComponentPayload>;
  /** Removes an issue from a component (including creating the issue on the ims of the component) */
  removeIssueFromComponent?: Maybe<RemoveIssueFromComponentPayload>;
  /** Marks an issue as being a duplicate of another issue */
  markIssueAsDuplicate?: Maybe<MarkIssueAsDuplicatePayload>;
  /** Remove the marking on an issue that it is a duplicate of another issue */
  unmarkIssueAsDuplicate?: Maybe<UnmarkIssueAsDuplicatePayload>;
  /** Adds a reaction by the current user to a comment (issue body or issue comment) */
  addReactionToComment?: Maybe<AddReactionToCommentPayload>;
  /** Remove a reaction from a comment which was added by the current user (issue body or issue comment) */
  removeReactionFromComment?: Maybe<RemoveReactionFromCommentPayload>;
  /** Adds a artifact to an issue */
  addArtifactToIssue?: Maybe<AddArtifactToIssuePayload>;
  /** Remove a artifact from an issue */
  removeArtifactFromIssue?: Maybe<RemoveArtifactFromIssuePayload>;
  /** Adds a NonFunctionalConstraint to an issue */
  addNonFunctionalConstraintToIssue?: Maybe<AddNonFunctionalConstraintToIssuePayload>;
  /** Remove a nonFunctionalConstraint from an issue */
  removeNonFunctionalConstraintFromIssue?: Maybe<RemoveNonFunctionalConstraintFromIssuePayload>;
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
  /** Creates a new componentInterface on the given component */
  createComponentInterface?: Maybe<CreateComponentInterfacePayload>;
  /** Delets the specified componentInterface */
  deleteComponentInterface?: Maybe<DeleteComponentInterfacePayload>;
  /** Updates the specified ComponentInterface. Fields which are not provided are not updated. */
  updateComponentInterface?: Maybe<UpdateComponentInterfacePayload>;
  /** Creates a new component in the ccims and adds it to the given users */
  createComponent?: Maybe<CreateComponentPayload>;
  /** Delets the specified component */
  deleteComponent?: Maybe<DeleteComponentPayload>;
  /** Updates a Component in the ccims. Fields which are not provided are not updated. */
  updateComponent?: Maybe<UpdateComponentPayload>;
  /** Adds the specified component to the project if it is not already on the project */
  addConsumedInterface?: Maybe<AddConsumedInterfacePayload>;
  /** Removes the specified component to the project if it is not already on the project */
  removeConsumedInterface?: Maybe<RemoveConsumedInterfacePayload>;
  /** Creates a new user in the system */
  createUser?: Maybe<CreateUserPayload>;
  /** Links a user to an IMS, updating an existing IMSUser or creating a new one */
  linkUserToIMS?: Maybe<LinkUserToImsPayload>;
  /** Registers/creates a new user in the ccims system */
  registerUser?: Maybe<RegisterUserPayload>;
  /** Create a new label in the system */
  createLabel?: Maybe<CreateLabelPayload>;
  /** Delets the specified label */
  deleteLabel?: Maybe<DeleteLabelPayload>;
  /** Updates a Label in the ccims. Fields which are not provided are not updated. */
  updateLabel?: Maybe<UpdateLabelPayload>;
  /** Adds the specified label to the component if it is not already on the component */
  addLabelToComponent?: Maybe<AddLabelToComponentPayload>;
  /** Removes the specified label from the component if it is on the component */
  removeLabelFromComponent?: Maybe<RemoveLabelFromComponentPayload>;
  /** Creates a new IMS in the ccims for the specified component */
  createIMS?: Maybe<CreateImsPayload>;
  /** Creates a new IMSComponent which links the specified component to the specified IMS */
  createIMSComponent?: Maybe<CreateImsComponentPayload>;
  /** Create a new artifact in the system */
  createArtifact?: Maybe<CreateArtifactPayload>;
  /** Delets the specified artifact */
  deleteArtifact?: Maybe<DeleteArtifactPayload>;
  /** Updates a Artifact in the ccims. Fields which are not provided are not updated. */
  updateArtifact?: Maybe<UpdateArtifactPayload>;
  /** Create a new NonFunctionalConstraint in the system */
  createNonFunctionalConstraint?: Maybe<CreateNonFunctionalConstraintPayload>;
  /** Delets the specified NonFunctionalConstraint */
  deleteNonFunctionalConstraint?: Maybe<DeleteNonFunctionalConstraintPayload>;
  /** Updates a NonFunctionalConstraint in the ccims. Fields which are not provided are not updated. */
  updateNonFunctionalConstraint?: Maybe<UpdateNonFunctionalConstraintPayload>;
};


/** Mutations to change the data within the ccims */
export type MutationCreateIssueArgs = {
  input: CreateIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationDeleteIssueArgs = {
  input: DeleteIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationAddIssueCommentArgs = {
  input: AddIssueCommentInput;
};


/** Mutations to change the data within the ccims */
export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
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
  input: UnlinkIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationAddLabelToIssueArgs = {
  input: AddLabelToIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveLabelFromIssueArgs = {
  input: RemoveLabelFromIssueInput;
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
  input: ReopenIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationChangeIssuePriorityArgs = {
  input?: Maybe<ChangeIssuePriorityInput>;
};


/** Mutations to change the data within the ccims */
export type MutationChangeIssueStartDateArgs = {
  input: ChangeIssueStartDateInput;
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
  input: RemoveIssueFromLocationInput;
};


/** Mutations to change the data within the ccims */
export type MutationAddIssueToComponentArgs = {
  input: AddIssueToComponentInput;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveIssueFromComponentArgs = {
  input: RemoveIssueFromComponentInput;
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
export type MutationAddArtifactToIssueArgs = {
  input: AddArtifactToIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveArtifactFromIssueArgs = {
  input: RemoveArtifactFromIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationAddNonFunctionalConstraintToIssueArgs = {
  input: AddNonFunctionalConstraintToIssueInput;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveNonFunctionalConstraintFromIssueArgs = {
  input: RemoveNonFunctionalConstraintFromIssueInput;
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
export type MutationCreateComponentInterfaceArgs = {
  input: CreateComponentInterfaceInput;
};


/** Mutations to change the data within the ccims */
export type MutationDeleteComponentInterfaceArgs = {
  input: DeleteComponentInterfaceInput;
};


/** Mutations to change the data within the ccims */
export type MutationUpdateComponentInterfaceArgs = {
  input: UpdateComponentInterfaceInput;
};


/** Mutations to change the data within the ccims */
export type MutationCreateComponentArgs = {
  input: CreateComponentInput;
};


/** Mutations to change the data within the ccims */
export type MutationDeleteComponentArgs = {
  input: DeleteComponentInput;
};


/** Mutations to change the data within the ccims */
export type MutationUpdateComponentArgs = {
  input: UpdateComponentInput;
};


/** Mutations to change the data within the ccims */
export type MutationAddConsumedInterfaceArgs = {
  input: AddConsumedComponentInterfaceInput;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveConsumedInterfaceArgs = {
  input: RemoveConsumedComponentInterfaceInput;
};


/** Mutations to change the data within the ccims */
export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


/** Mutations to change the data within the ccims */
export type MutationLinkUserToImsArgs = {
  input: LinkUserToImsInputConfig;
};


/** Mutations to change the data within the ccims */
export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};


/** Mutations to change the data within the ccims */
export type MutationCreateLabelArgs = {
  input: CreateLabelInput;
};


/** Mutations to change the data within the ccims */
export type MutationDeleteLabelArgs = {
  input: DeleteLabelInput;
};


/** Mutations to change the data within the ccims */
export type MutationUpdateLabelArgs = {
  input: UpdateLabelInput;
};


/** Mutations to change the data within the ccims */
export type MutationAddLabelToComponentArgs = {
  input: AddLabelToComponentInput;
};


/** Mutations to change the data within the ccims */
export type MutationRemoveLabelFromComponentArgs = {
  input: RemoveLabelFromComponentInput;
};


/** Mutations to change the data within the ccims */
export type MutationCreateImsArgs = {
  input: CreateImsInput;
};


/** Mutations to change the data within the ccims */
export type MutationCreateImsComponentArgs = {
  input: CreateImsComponentInput;
};


/** Mutations to change the data within the ccims */
export type MutationCreateArtifactArgs = {
  input: CreateArtifactInput;
};


/** Mutations to change the data within the ccims */
export type MutationDeleteArtifactArgs = {
  input: DeleteArtifactInput;
};


/** Mutations to change the data within the ccims */
export type MutationUpdateArtifactArgs = {
  input: UpdateArtifactInput;
};


/** Mutations to change the data within the ccims */
export type MutationCreateNonFunctionalConstraintArgs = {
  input: CreateNonFunctionalConstraintInput;
};


/** Mutations to change the data within the ccims */
export type MutationDeleteNonFunctionalConstraintArgs = {
  input: DeleteNonFunctionalConstraintInput;
};


/** Mutations to change the data within the ccims */
export type MutationUpdateNonFunctionalConstraintArgs = {
  input: UpdateNonFunctionalConstraintInput;
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
  components: Array<Scalars['ID']>;
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
   * A list of IDs of Artifacts to add to the issue to.
   * 
   *  If `null`, none will be added.
   */
  artifacts?: Maybe<Array<Scalars['ID']>>;
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

/** The Payload/Response for the deleteIssue mutation */
export type DeleteIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
};

/** The inputs for the deleteIssue mutation */
export type DeleteIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the issue to delete */
  issue: Scalars['ID'];
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

/** The Payload/Response for the updateComment mutation */
export type UpdateCommentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The comment object that was updated. */
  comment?: Maybe<Comment>;
};

/** The inputs for the updateComment, updates only the provided fields */
export type UpdateCommentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the comment to update. May be an Issue or an IssueComment */
  comment: Scalars['ID'];
  /**
   * The body text of the comment to be updated.
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

/** The inputs for the addLabelToIssue mutation */
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

/** The inputs for the removeLabelFromIssue mutation */
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

/** The Payload/Response for the addToIssueArtifact mutation */
export type AddArtifactToIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The Artifact that was added to the issue */
  artifact?: Maybe<Artifact>;
  /** The issue to which the specified Artifact was added */
  issue?: Maybe<Issue>;
  /** The issue timeline event for adding the Artifact to the Issue */
  event?: Maybe<AddedArtifactEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the addArtifactToIssue mutation */
export type AddArtifactToIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue to which to add the artifact */
  issue: Scalars['ID'];
  /** The ID of the artifact to be added to the specified issue */
  artifact: Scalars['ID'];
};

/** The Payload/Response for the removeFromIssueArtifact mutation */
export type RemoveArtifactFromIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The Artifact that was removed from the issue */
  artifact?: Maybe<Artifact>;
  /** The issue from which the Artifact was removed */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the removal of the Artifact from the issue */
  event?: Maybe<RemovedArtifactEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the removeArtifactFromIssue mutation */
export type RemoveArtifactFromIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the issue from which to remove a artifact */
  issue: Scalars['ID'];
  /** The ID of the artifact to remove from the specified issue */
  artifact: Scalars['ID'];
};

/** The Payload/Response for the addToIssueNonFunctionalConstraint mutation */
export type AddNonFunctionalConstraintToIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The NonFunctionalConstraint that was added to the issue */
  NonFunctionalConstraint?: Maybe<NonFunctionalConstraint>;
  /** The issue to which the specified NonFunctionalConstraint was added */
  issue?: Maybe<Issue>;
  /** The issue timeline event for adding the NonFunctionalConstraint to the Issue */
  event?: Maybe<AddedNonFunctionalConstraintEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the addToIssueNonFunctionalConstraint */
export type AddNonFunctionalConstraintToIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the NonFunctionalConstraint to be added to the specified issue */
  nonFunctionalConstraint: Scalars['ID'];
};

/** The Payload/Response for the removeFromIssueNonFunctionalConstraint mutation */
export type RemoveNonFunctionalConstraintFromIssuePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The NonFunctionalConstraint that was removed from the issue */
  nonFunctionalConstraint?: Maybe<NonFunctionalConstraint>;
  /** The issue from which the NonFunctionalConstraint was removed */
  issue?: Maybe<Issue>;
  /** The issue timeline event for the removal of the NonFunctionalConstraint from the issue */
  event?: Maybe<RemovedNonFunctionalConstraintEvent>;
  /** The edge to be able to request other timeline items from this timeline item */
  timelineEdge?: Maybe<IssueTimelineItemEdge>;
};

/** The inputs for the removeNonFunctionalConstraintFromIssue mutation */
export type RemoveNonFunctionalConstraintFromIssueInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the NonFunctionalConstraint to remove from the specified issue */
  nonFunctionalConstraint: Scalars['ID'];
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
  project: Scalars['ID'];
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
  project: Scalars['ID'];
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
  project: Scalars['ID'];
  /** The id of the component to add to the project */
  component: Scalars['ID'];
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
  project: Scalars['ID'];
  /** The id of the component to remove from the project */
  component: Scalars['ID'];
};

/** The Payload/Response for the createComponentInterface mutation */
export type CreateComponentInterfacePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The componentInterface created by this mutation */
  componentInterface?: Maybe<ComponentInterface>;
};

/** The inputs for the createComponentInterface mutation */
export type CreateComponentInterfaceInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /**
   * The name of the componentInterface
   * 
   * Max. 256 characters
   */
  name: Scalars['String'];
  /**
   * The description of the componentInterface
   * 
   * Max. 65536 characters
   */
  description?: Maybe<Scalars['String']>;
  /**
   * The type of the ComponentInterface
   * 
   * Max. 65536 characters
   */
  type?: Maybe<Scalars['String']>;
  /** The id of the component on which the created interface should be */
  component: Scalars['ID'];
};

/** The Payload/Response for the deleteComponentInterface mutation */
export type DeleteComponentInterfacePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
};

/** The inputs for the deleteComponentInterface mutation */
export type DeleteComponentInterfaceInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the componentInterface to delete */
  componentInterface: Scalars['ID'];
};

/** The Payload/Response for the updateComponentInterface mutation */
export type UpdateComponentInterfacePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The componentInterface updated by this mutation */
  componentInterface?: Maybe<ComponentInterface>;
};

/** The inputs for the updateComponentInterface mutation, updates only the provided fields */
export type UpdateComponentInterfaceInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the componentinterface to update */
  componentInterface: Scalars['ID'];
  /**
   * The name of the componentinterface
   * 
   * Max. 256 characters
   */
  name?: Maybe<Scalars['String']>;
  /**
   * The description of the componentinterface
   * 
   * Max. 65536 characters
   */
  description?: Maybe<Scalars['String']>;
  /**
   * The type of the ComponentInterface
   * 
   * Max. 65536 characters
   */
  type?: Maybe<Scalars['String']>;
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
  /**
   * A textual description (of the function) of this component.
   * 
   * Max. 65536 characters. `null` equivalent to ""
   */
  description?: Maybe<Scalars['String']>;
  /**
   * The URL where the code repository of this component is located
   * 
   * Max. 65536 characters
   */
  repositoryURL?: Maybe<Scalars['String']>;
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

/** The Payload/Response for the deleteComponent mutation */
export type DeleteComponentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
};

/** The inputs for the deleteComponent mutation */
export type DeleteComponentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the component to delete */
  component: Scalars['ID'];
};

/** The Payload/Response for the updateComponent mutation */
export type UpdateComponentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The component updated by this mutation */
  component?: Maybe<Component>;
};

/** The inputs for the updateComponent mutation, updates only the provided fields */
export type UpdateComponentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the component to update */
  component: Scalars['ID'];
  /**
   * The (non unique) display name of this component
   * 
   * Max. 256 characters
   */
  name?: Maybe<Scalars['String']>;
  /**
   * A textual description (of the function) of this component.
   * 
   * Max. 65536 characters.
   */
  description?: Maybe<Scalars['String']>;
  /**
   * The URL where the code repository of this component is located
   * 
   * Max. 65536 characters
   */
  repositoryURL?: Maybe<Scalars['String']>;
};

/** The Payload/Response for the addComponentToProject mutation */
export type AddConsumedInterfacePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The component which consumes the interface */
  component?: Maybe<Component>;
  /** The componentInterface which is consumed by the component */
  interface?: Maybe<ComponentInterface>;
};

/** The inputs for the addConsumedInterface mutation */
export type AddConsumedComponentInterfaceInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the component where to add the consumed interface */
  component: Scalars['ID'];
  /** The id of the componentInterface which is consumed by the component */
  componentInterface: Scalars['ID'];
};

/** The Payload/Response for the removeComponentFromProject mutation */
export type RemoveConsumedInterfacePayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The component which consumed the interface */
  component?: Maybe<Component>;
  /** The componentInterface which was consumed by the component */
  interface?: Maybe<ComponentInterface>;
};

/** The inputs for the removeConsumedInterface mutation */
export type RemoveConsumedComponentInterfaceInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the component where to remove the interface */
  component: Scalars['ID'];
  /** The id of the componentInterface which is consumed by the component */
  componentInterface: Scalars['ID'];
};

/** The Payload/Response for the createUser mutation */
export type CreateUserPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The user created by this mutation */
  user?: Maybe<CcimsUser>;
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

/** The Payload/Response for the linkUserToIMS mutation */
export type LinkUserToImsPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The newly created or updated IMSUser that represents the user on the specified IMS */
  imsUser?: Maybe<ImsUser>;
};

/** The inputs for the linkUserToIMS mutation */
export type LinkUserToImsInputConfig = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the user which should be linked to the specified IMS */
  user?: Maybe<Scalars['String']>;
  /** The id of the IMS which the user is linked to */
  ims?: Maybe<Scalars['String']>;
  /** Any other data that is necessary to link the user to the IMS, for example a username, id, authorization token etc., this depends on the type of IMS */
  imsData?: Maybe<Scalars['JSON']>;
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

/** The Payload/Response for the deleteLabel mutation */
export type DeleteLabelPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
};

/** The inputs for the deleteLabel mutation */
export type DeleteLabelInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the label to delete */
  label: Scalars['ID'];
};

/** The Payload/Response for the updateLabel mutation */
export type UpdateLabelPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The Label updated by this mutation */
  label?: Maybe<Label>;
};

/** The inputs for the updateLabel mutation, updates only the provided fields */
export type UpdateLabelInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the label to update */
  label: Scalars['ID'];
  /**
   * The name of the label which to show in the GUI.
   * 
   * Max. 256 characters.
   */
  name?: Maybe<Scalars['String']>;
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
  color?: Maybe<Scalars['Color']>;
};

/** The Payload/Response for the addComponentToProject mutation */
export type AddLabelToComponentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The component which to which the label is added */
  component?: Maybe<Component>;
  /** The Label which is added to the Component */
  label?: Maybe<Label>;
};

/** The inputs for the addLabelToComponent mutation */
export type AddLabelToComponentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the component to which to add the label */
  component: Scalars['ID'];
  /** The ID of the label to be added to the specified component */
  label: Scalars['ID'];
};

/** The Payload/Response for the removeComponentFromProject mutation */
export type RemoveLabelFromComponentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The component which from which the label is removeed */
  component?: Maybe<Component>;
  /** The Label which is removed from the Component */
  label?: Maybe<Label>;
};

/** The inputs for the removeLabelFromComponent mutation */
export type RemoveLabelFromComponentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The ID of the component from which to remove a label */
  component: Scalars['ID'];
  /** The ID of the label to remove from the specified component */
  label: Scalars['ID'];
};

/** The Payload/Response for the createIMS mutation */
export type CreateImsPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The IMS created by this mutation */
  ims?: Maybe<Ims>;
};

/** The inputs for the createIMS mutation */
export type CreateImsInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The type/system the IMS of this component is an instance of */
  imsType: ImsType;
  /**
   * Data needed for the connection to the IMS API.
   * 
   * See the documentation for the IMS extensions for information which keys are expected.
   * This must be a valid JSON-string
   */
  imsData?: Maybe<Scalars['JSON']>;
};

/** The Payload/Response for the createIMS mutation */
export type CreateImsComponentPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The IMSComponent created by this mutation */
  imsComponent?: Maybe<ImsComponent>;
};

/** The inputs for the createIMS mutation */
export type CreateImsComponentInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The component which the IMS is linked to */
  component: Scalars['ID'];
  /** The IMS which is linked to the component */
  ims: Scalars['ID'];
  /**
   * Data needed for the connection to the IMS API to this specific component.
   * 
   * See the documentation for the IMS extensions for information which keys are expected.
   * This must be a valid JSON-string
   */
  imsData?: Maybe<Scalars['JSON']>;
};

/** The Payload/Response for the createArtifact mutation */
export type CreateArtifactPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The Artifact created by this mutation */
  artifact?: Maybe<Artifact>;
};

/** The inputs for the createArtifact mutation */
export type CreateArtifactInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The location of the resource. This should be a valid URL in most cases */
  uri: Scalars['String'];
  /** The start of the line range. This can only be applied to text documents. Optional */
  lineRangeStart?: Maybe<Scalars['Int']>;
  /** The end of the line range. This can only be applied to text documents. Optional */
  lineRangeEnd?: Maybe<Scalars['Int']>;
  /** The id of the component on which the Artifact is created on */
  component: Scalars['ID'];
};

/** The Payload/Response for the deleteArtifact mutation */
export type DeleteArtifactPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
};

/** The inputs for the deleteArtifact mutation */
export type DeleteArtifactInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the Artifact to delete */
  artifact: Scalars['ID'];
};

/** The Payload/Response for the updateArtifact mutation */
export type UpdateArtifactPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The Artifact updated by this mutation */
  Artifact?: Maybe<Artifact>;
};

/** The inputs for the updateArtifact mutation, updates only the provided fields */
export type UpdateArtifactInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the artifact to update */
  artifact: Scalars['ID'];
  /** The location of the resource. This should be a valid URL in most cases */
  uri?: Maybe<Scalars['String']>;
  /** The start of the line range. This can only be applied to text documents. If null is provided, the value is unset */
  lineRangeStart?: Maybe<Scalars['Int']>;
  /** The end of the line range. This can only be applied to text documents. If null is provided, the value is unset */
  lineRangeEnd?: Maybe<Scalars['Int']>;
};

/** The Payload/Response for the createNonFunctionalConstraint mutation */
export type CreateNonFunctionalConstraintPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The NonFunctionalConstraint created by this mutation */
  nonFunctionalConstraint?: Maybe<NonFunctionalConstraint>;
  /** The event for adding the NonFunctionalConstraint to the Issue */
  addedEvent?: Maybe<AddedNonFunctionalConstraintEvent>;
};

/** The inputs for the createNonFunctionalConstraint mutation */
export type CreateNonFunctionalConstraintInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /**
   * The name of the NonFunctionalConstraint which to show in the GUI.
   * 
   * Max. 256 characters.
   */
  content: Scalars['String'];
  /**
   * The description text for the NonFunctionalConstraint.
   * 
   * Max. 65536 characters.
   */
  description?: Maybe<Scalars['String']>;
  /** The id of the issue where the NonFunctionalConstraint is created on. */
  issue: Scalars['ID'];
};

/** The Payload/Response for the deleteNonFunctionalConstraint mutation */
export type DeleteNonFunctionalConstraintPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
};

/** The inputs for the deleteNonFunctionalConstraint mutation */
export type DeleteNonFunctionalConstraintInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the NonFunctionalConstraint to delete */
  nonFunctionalConstraint: Scalars['ID'];
};

/** The Payload/Response for the updateNonFunctionalConstraint mutation */
export type UpdateNonFunctionalConstraintPayload = {
  /** The string provided by the client on sending the mutation */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The NonFunctionalConstraint updated by this mutation */
  NonFunctionalConstraint?: Maybe<NonFunctionalConstraint>;
};

/** The inputs for the updateNonFunctionalConstraint mutation, updates only the provided fields */
export type UpdateNonFunctionalConstraintInput = {
  /** An arbitraty string to return together with the mutation result */
  clientMutationID?: Maybe<Scalars['String']>;
  /** The id of the NonFunctionalConstraint to update */
  nonFunctionalConstraint: Scalars['ID'];
  /**
   * The name of the NonFunctionalConstraint which to show in the GUI.
   * 
   * Max. 256 characters.
   */
  content?: Maybe<Scalars['String']>;
  /**
   * The description text for the NonFunctionalConstraint.
   * 
   * Max. 65536 characters.
   */
  description?: Maybe<Scalars['String']>;
};

export type CreateComponentMutationVariables = Exact<{
  input: CreateComponentInput;
}>;


export type CreateComponentMutation = { createComponent?: Maybe<{ component?: Maybe<Pick<Component, 'id'>> }> };

export type AddConsumedInterfaceMutationVariables = Exact<{
  input: AddConsumedComponentInterfaceInput;
}>;


export type AddConsumedInterfaceMutation = { addConsumedInterface?: Maybe<{ component?: Maybe<Pick<Component, 'id'>>, interface?: Maybe<Pick<ComponentInterface, 'id'>> }> };

export type RemoveConsumedInterfaceMutationVariables = Exact<{
  input: RemoveConsumedComponentInterfaceInput;
}>;


export type RemoveConsumedInterfaceMutation = { removeConsumedInterface?: Maybe<{ component?: Maybe<Pick<Component, 'id'>>, interface?: Maybe<Pick<ComponentInterface, 'id'>> }> };

export type GetComponentLabelsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetComponentLabelsQuery = { node?: Maybe<{ labels?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Label, 'id' | 'createdAt' | 'name' | 'description' | 'color'>>>> }> }> };

export type GetBasicComponentQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetBasicComponentQuery = { node?: Maybe<(
    Pick<Component, 'id' | 'name' | 'description' | 'repositoryURL'>
    & { imsComponents?: Maybe<{ nodes?: Maybe<Array<Maybe<{ ims?: Maybe<Pick<Ims, 'imsType'>> }>>> }> }
  )> };

export type GetComponentInterfacesQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetComponentInterfacesQuery = { node?: Maybe<(
    Pick<Component, 'id'>
    & { interfaces?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<ComponentInterface, 'id' | 'name'>
        & { consumedBy?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id' | 'name'>>>> }> }
      )>>> }> }
  )> };

export type GetComponentQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetComponentQuery = { node?: Maybe<(
    Pick<Component, 'id' | 'name' | 'description'>
    & { createdBy?: Maybe<Pick<CcimsUser, 'displayName' | 'username' | 'id'> | Pick<ImsUser, 'displayName' | 'username' | 'id'>>, labels?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Label, 'name' | 'id' | 'color'>>>> }>, imsComponents?: Maybe<{ edges?: Maybe<Array<Maybe<{ node?: Maybe<{ ims?: Maybe<Pick<Ims, 'imsType'>> }> }>>> }>, issues?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<Issue, 'id' | 'title' | 'isOpen' | 'category' | 'body'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>, labels?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Label, 'name' | 'id' | 'color'>>>> }>, assignees?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>>> }> }
      )>>> }>, interfaces?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<ComponentInterface, 'name' | 'id'>>>> }>, consumedInterfaces?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<ComponentInterface, 'name'>>>> }> }
  )> };

export type DeleteComponentMutationVariables = Exact<{
  input: DeleteComponentInput;
}>;


export type DeleteComponentMutation = { deleteComponent?: Maybe<Pick<DeleteComponentPayload, 'clientMutationID'>> };

export type UpdateComponentMutationVariables = Exact<{
  input: UpdateComponentInput;
}>;


export type UpdateComponentMutation = { updateComponent?: Maybe<Pick<UpdateComponentPayload, 'clientMutationID'>> };

export type CreateComponentInterfaceMutationVariables = Exact<{
  input: CreateComponentInterfaceInput;
}>;


export type CreateComponentInterfaceMutation = { createComponentInterface?: Maybe<{ componentInterface?: Maybe<(
      Pick<ComponentInterface, 'id' | 'name'>
      & { component?: Maybe<Pick<Component, 'id'>> }
    )> }> };

export type UpdateComponentInterfaceMutationVariables = Exact<{
  input: UpdateComponentInterfaceInput;
}>;


export type UpdateComponentInterfaceMutation = { updateComponentInterface?: Maybe<{ componentInterface?: Maybe<Pick<ComponentInterface, 'id' | 'name'>> }> };

export type DeleteComponentInterfaceMutationVariables = Exact<{
  input: DeleteComponentInterfaceInput;
}>;


export type DeleteComponentInterfaceMutation = { deleteComponentInterface?: Maybe<Pick<DeleteComponentInterfacePayload, 'clientMutationID'>> };

export type GetConsumingComponentsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetConsumingComponentsQuery = { node?: Maybe<(
    Pick<ComponentInterface, 'id' | 'name' | 'description'>
    & { component?: Maybe<Pick<Component, 'name'>>, consumedBy?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id' | 'name'>>>> }> }
  )> };

export type GetInterfaceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetInterfaceQuery = { node?: Maybe<(
    Pick<ComponentInterface, 'id' | 'name' | 'description'>
    & { component?: Maybe<Pick<Component, 'id'>>, issuesOnLocation?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<Issue, 'id' | 'title' | 'isOpen' | 'category' | 'body'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>, labels?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Label, 'name' | 'id' | 'color'>>>> }>, assignees?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>>> }> }
      )>>> }> }
  )> };

export type GetIssueGraphDataQueryVariables = Exact<{
  projectId: Scalars['ID'];
  activeCategories?: Maybe<Array<IssueCategory>>;
}>;


export type GetIssueGraphDataQuery = { node?: Maybe<{ components?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<Component, 'name' | 'id'>
        & { bugs?: Maybe<Pick<IssuePage, 'totalCount'>>, featureRequests?: Maybe<Pick<IssuePage, 'totalCount'>>, unclassified?: Maybe<Pick<IssuePage, 'totalCount'>> }
      )>>> }>, interfaces?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<ComponentInterface, 'id' | 'name'>
        & { component?: Maybe<Pick<Component, 'id'>>, bugs?: Maybe<Pick<IssuePage, 'totalCount'>>, featureRequests?: Maybe<Pick<IssuePage, 'totalCount'>>, unclassified?: Maybe<Pick<IssuePage, 'totalCount'>>, consumedBy?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id'>>>> }> }
      )>>> }>, linkingIssues?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<Issue, 'id' | 'category'>
        & { locations?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>>>> }>, linksToIssues?: Maybe<{ nodes?: Maybe<Array<Maybe<(
            Pick<Issue, 'id' | 'category'>
            & { locations?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>>>> }> }
          )>>> }> }
      )>>> }> }> };

export type GetIssueGraphDataForSearchQueryVariables = Exact<{
  projectId: Scalars['ID'];
  activeCategories?: Maybe<Array<IssueCategory>>;
  selectedLabels?: Maybe<Array<Scalars['ID']>>;
  issueRegex?: Maybe<Scalars['String']>;
}>;


export type GetIssueGraphDataForSearchQuery = { node?: Maybe<{ components?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<Component, 'name' | 'id'>
        & { bugs?: Maybe<Pick<IssuePage, 'totalCount'>>, featureRequests?: Maybe<Pick<IssuePage, 'totalCount'>>, unclassified?: Maybe<Pick<IssuePage, 'totalCount'>> }
      )>>> }>, interfaces?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<ComponentInterface, 'id' | 'name'>
        & { component?: Maybe<Pick<Component, 'id'>>, bugs?: Maybe<Pick<IssuePage, 'totalCount'>>, featureRequests?: Maybe<Pick<IssuePage, 'totalCount'>>, unclassified?: Maybe<Pick<IssuePage, 'totalCount'>>, consumedBy?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id'>>>> }> }
      )>>> }>, linkingIssues?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<Issue, 'id' | 'category'>
        & { locations?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>>>> }>, linksToIssues?: Maybe<{ nodes?: Maybe<Array<Maybe<(
            Pick<Issue, 'id' | 'category'>
            & { locations?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id'> | Pick<ComponentInterface, 'id'>>>> }> }
          )>>> }> }
      )>>> }> }> };

export type CreateIssueMutationVariables = Exact<{
  input: CreateIssueInput;
}>;


export type CreateIssueMutation = { createIssue?: Maybe<{ issue?: Maybe<Pick<Issue, 'id' | 'title'>> }> };

export type LinkIssueMutationVariables = Exact<{
  input: LinkIssueInput;
}>;


export type LinkIssueMutation = { linkIssue?: Maybe<{ issue?: Maybe<Pick<Issue, 'id'>> }> };

export type UnlinkIssueMutationVariables = Exact<{
  input: UnlinkIssueInput;
}>;


export type UnlinkIssueMutation = { unlinkIssue?: Maybe<{ issue?: Maybe<Pick<Issue, 'id'>> }> };

export type GetIssueQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetIssueQuery = { node?: Maybe<(
    Pick<Issue, 'id' | 'title' | 'body' | 'bodyRendered' | 'isOpen' | 'createdAt'>
    & { locations?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Component, 'id' | 'name'> | Pick<ComponentInterface, 'id' | 'name'>>>> }>, linkedByIssues?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Issue, 'id' | 'title'>>>> }>, linksToIssues?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Issue, 'title' | 'id' | 'body'>>>> }>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'displayName' | 'username'> | Pick<ImsUser, 'id' | 'displayName' | 'username'>>, issueComments?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<IssueComment, 'id' | 'body' | 'bodyRendered' | 'createdAt'>
        & { issue: Pick<Issue, 'id'>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      )>>> }>, labels?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Label, 'name' | 'id' | 'color'>>>> }>, assignees?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>>> }> }
  )> };

export type CommentIssueMutationVariables = Exact<{
  input: AddIssueCommentInput;
}>;


export type CommentIssueMutation = { addIssueComment?: Maybe<{ comment?: Maybe<(
      Pick<IssueComment, 'id' | 'body' | 'createdAt'>
      & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
    )> }> };

export type DeleteIssueCommentMutationVariables = Exact<{
  input: DeleteIssueCommentInput;
}>;


export type DeleteIssueCommentMutation = { deleteIssueComment?: Maybe<{ deletedComment?: Maybe<(
      Pick<DeletedIssueComment, 'id' | 'createdAt'>
      & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
    )> }> };

export type CloseIssueMutationVariables = Exact<{
  input: CloseIssueInput;
}>;


export type CloseIssueMutation = { closeIssue?: Maybe<Pick<CloseIssuePayload, 'clientMutationID'>> };

export type ReopenIssueMutationVariables = Exact<{
  input: ReopenIssueInput;
}>;


export type ReopenIssueMutation = { reopenIssue?: Maybe<Pick<ReopenIssuePayload, 'clientMutationID'>> };

export type RenameIssueTitleMutationVariables = Exact<{
  input: RenameIssueTitleInput;
}>;


export type RenameIssueTitleMutation = { renameIssueTitle?: Maybe<Pick<RenameIssueTitlePayload, 'clientMutationID'>> };

export type RemoveIssueFromLocationMutationVariables = Exact<{
  input: RemoveIssueFromLocationInput;
}>;


export type RemoveIssueFromLocationMutation = { removeIssueFromLocation?: Maybe<Pick<RemoveIssueFromLocationPayload, 'clientMutationID'>> };

export type AddIssueToLocationMutationVariables = Exact<{
  input: AddIssueToLocationInput;
}>;


export type AddIssueToLocationMutation = { addIssueToLocation?: Maybe<Pick<AddIssueToLocationPayload, 'clientMutationID'>> };

export type UpdateCommentMutationVariables = Exact<{
  input: UpdateCommentInput;
}>;


export type UpdateCommentMutation = { updateComment?: Maybe<(
    Pick<UpdateCommentPayload, 'clientMutationID'>
    & { comment?: Maybe<(
      Pick<Issue, 'id' | 'createdAt' | 'body' | 'lastEditedAt'>
      & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>, editedBy?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>>> }> }
    ) | (
      Pick<IssueComment, 'id' | 'createdAt' | 'body' | 'lastEditedAt'>
      & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>, editedBy?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>>> }> }
    )> }
  )> };

export type GetAllTimelineItemsQueryVariables = Exact<{
  input: Scalars['ID'];
}>;


export type GetAllTimelineItemsQuery = { node?: Maybe<{ timeline?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        { __typename: 'AddedToComponentEvent' }
        & Pick<AddedToComponentEvent, 'id' | 'createdAt'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>>, component?: Maybe<Pick<Component, 'id' | 'name'>> }
      ) | (
        { __typename: 'AddedToLocationEvent' }
        & Pick<AddedToLocationEvent, 'id' | 'createdAt'>
        & { location?: Maybe<Pick<Component, 'id' | 'name'> | Pick<ComponentInterface, 'id' | 'name'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'ClosedEvent' }
        & Pick<ClosedEvent, 'id' | 'createdAt'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'AssignedEvent' }
        & Pick<AssignedEvent, 'id' | 'createdAt'>
        & { assignee?: Maybe<Pick<CcimsUser, 'id'> | Pick<ImsUser, 'id'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'CategoryChangedEvent' }
        & Pick<CategoryChangedEvent, 'oldCategory' | 'newCategory' | 'id' | 'createdAt'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'DueDateChangedEvent' }
        & Pick<DueDateChangedEvent, 'oldDueDate' | 'newDueDate' | 'id' | 'createdAt'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'DeletedIssueComment' }
        & Pick<DeletedIssueComment, 'deletedAt' | 'id' | 'createdAt'>
        & { deletedBy?: Maybe<Pick<CcimsUser, 'id'> | Pick<ImsUser, 'id'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'EstimatedTimeChangedEvent' }
        & Pick<EstimatedTimeChangedEvent, 'oldEstimatedTime' | 'newEstimatedTime' | 'id' | 'createdAt'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'LabelledEvent' }
        & Pick<LabelledEvent, 'id' | 'createdAt'>
        & { label?: Maybe<Pick<Label, 'id' | 'name' | 'color'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'IssueComment' }
        & Pick<IssueComment, 'body' | 'lastEditedAt' | 'id' | 'createdAt'>
        & { editedBy?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>>>> }>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'MarkedAsDuplicateEvent' }
        & Pick<MarkedAsDuplicateEvent, 'id' | 'createdAt'>
        & { originalIssue?: Maybe<Pick<Issue, 'id' | 'title'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'LinkEvent' }
        & Pick<LinkEvent, 'id' | 'createdAt'>
        & { linkedIssue?: Maybe<Pick<Issue, 'id' | 'title'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'PinnedEvent' }
        & Pick<PinnedEvent, 'id' | 'createdAt'>
        & { component?: Maybe<Pick<Component, 'id' | 'name'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'ReferencedByIssueEvent' }
        & Pick<ReferencedByIssueEvent, 'id' | 'createdAt'>
        & { mentionedAt?: Maybe<Pick<Issue, 'id' | 'title'>>, mentionedInComment?: Maybe<Pick<IssueComment, 'id'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'PriorityChangedEvent' }
        & Pick<PriorityChangedEvent, 'oldPriority' | 'newPriority' | 'id' | 'createdAt'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'RemovedFromComponentEvent' }
        & Pick<RemovedFromComponentEvent, 'id' | 'createdAt'>
        & { removedComponent?: Maybe<Pick<Component, 'id' | 'name'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'ReferencedByOtherEvent' }
        & Pick<ReferencedByOtherEvent, 'source' | 'sourceURL' | 'id' | 'createdAt'>
        & { component?: Maybe<Pick<Component, 'id' | 'name'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'RemovedFromLocationEvent' }
        & Pick<RemovedFromLocationEvent, 'id' | 'createdAt'>
        & { removedLocation?: Maybe<Pick<Component, 'id' | 'name'> | Pick<ComponentInterface, 'id' | 'name'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'ReopenedEvent' }
        & Pick<ReopenedEvent, 'id' | 'createdAt'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'StartDateChangedEvent' }
        & Pick<StartDateChangedEvent, 'oldStartDate' | 'newStartDate' | 'id' | 'createdAt'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'RenamedTitleEvent' }
        & Pick<RenamedTitleEvent, 'oldTitle' | 'newTitle' | 'id' | 'createdAt'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'UnassignedEvent' }
        & Pick<UnassignedEvent, 'id' | 'createdAt'>
        & { removedAssignee?: Maybe<Pick<CcimsUser, 'id'> | Pick<ImsUser, 'id'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'UnlabelledEvent' }
        & Pick<UnlabelledEvent, 'id' | 'createdAt'>
        & { removedLabel?: Maybe<Pick<Label, 'id'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'WasLinkedEvent' }
        & Pick<WasLinkedEvent, 'id' | 'createdAt'>
        & { linkedBy?: Maybe<Pick<Issue, 'id' | 'title'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'UnmarkedAsDuplicateEvent' }
        & Pick<UnmarkedAsDuplicateEvent, 'id' | 'createdAt'>
        & { issue: Pick<Issue, 'id' | 'title'>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'WasUnlinkedEvent' }
        & Pick<WasUnlinkedEvent, 'id' | 'createdAt'>
        & { unlinkedBy?: Maybe<Pick<Issue, 'id' | 'title'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'UnpinnedEvent' }
        & Pick<UnpinnedEvent, 'id' | 'createdAt'>
        & { component?: Maybe<Pick<Component, 'id' | 'name'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'UnlinkEvent' }
        & Pick<UnlinkEvent, 'id' | 'createdAt'>
        & { removedLinkedIssue?: Maybe<Pick<Issue, 'id' | 'title'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'AddedArtifactEvent' }
        & Pick<AddedArtifactEvent, 'id' | 'createdAt'>
        & { artifact?: Maybe<Pick<Artifact, 'id'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'RemovedArtifactEvent' }
        & Pick<RemovedArtifactEvent, 'id' | 'createdAt'>
        & { removedArtifact?: Maybe<Pick<Artifact, 'id'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'AddedNonFunctionalConstraintEvent' }
        & Pick<AddedNonFunctionalConstraintEvent, 'id' | 'createdAt'>
        & { nonFunctionalConstraint?: Maybe<Pick<NonFunctionalConstraint, 'id'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      ) | (
        { __typename: 'RemovedNonFunctionalConstraintEvent' }
        & Pick<RemovedNonFunctionalConstraintEvent, 'id' | 'createdAt'>
        & { removedNonFunctionalConstraint?: Maybe<Pick<NonFunctionalConstraint, 'id'>>, createdBy?: Maybe<Pick<CcimsUser, 'id' | 'username' | 'displayName'> | Pick<ImsUser, 'id' | 'username' | 'displayName'>> }
      )>>> }> }> };

export type GetLabelsQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;


export type GetLabelsQuery = { node?: Maybe<{ labels?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Label, 'id' | 'name' | 'color'>>>> }> }> };

export type CreateLabelMutationVariables = Exact<{
  input: CreateLabelInput;
}>;


export type CreateLabelMutation = { createLabel?: Maybe<{ label?: Maybe<Pick<Label, 'id' | 'color' | 'name'>> }> };

export type AddLabelToIssueMutationVariables = Exact<{
  input: AddLabelToIssueInput;
}>;


export type AddLabelToIssueMutation = { addLabelToIssue?: Maybe<{ label?: Maybe<Pick<Label, 'id'>> }> };

export type RemoveLabelFromIssueMutationVariables = Exact<{
  input: RemoveLabelFromIssueInput;
}>;


export type RemoveLabelFromIssueMutation = { removeLabelFromIssue?: Maybe<{ issue?: Maybe<Pick<Issue, 'title'>> }> };

export type GetAllProjectsQueryVariables = Exact<{
  filter?: Maybe<ProjectFilter>;
}>;


export type GetAllProjectsQuery = { projects?: Maybe<{ edges?: Maybe<Array<Maybe<{ node?: Maybe<Pick<Project, 'id' | 'name'>> }>>> }> };

export type GetBasicProjectQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetBasicProjectQuery = { node?: Maybe<Pick<Project, 'id' | 'name' | 'description'>> };

export type GetFullProjectQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetFullProjectQuery = { node?: Maybe<(
    Pick<Project, 'id' | 'name' | 'description'>
    & { components?: Maybe<{ edges?: Maybe<Array<Maybe<{ node?: Maybe<(
          Pick<Component, 'id' | 'name'>
          & { issues?: Maybe<{ nodes?: Maybe<Array<Maybe<(
              Pick<Issue, 'id' | 'title' | 'category'>
              & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>, labels?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Label, 'id' | 'name' | 'color'>>>> }>, assignees?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>>> }> }
            )>>> }> }
        )> }>>> }>, interfaces?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<ComponentInterface, 'name' | 'id'>
        & { issuesOnLocation?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Issue, 'id' | 'title'>>>> }> }
      )>>> }>, issues?: Maybe<{ nodes?: Maybe<Array<Maybe<(
        Pick<Issue, 'id' | 'title' | 'category'>
        & { createdBy?: Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>, labels?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Label, 'id' | 'name' | 'color'>>>> }>, assignees?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<CcimsUser, 'id' | 'displayName'> | Pick<ImsUser, 'id' | 'displayName'>>>> }> }
      )>>> }> }
  )> };

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
export const AddConsumedInterfaceDocument = gql`
    mutation AddConsumedInterface($input: AddConsumedComponentInterfaceInput!) {
  addConsumedInterface(input: $input) {
    component {
      id
    }
    interface {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddConsumedInterfaceGQL extends Apollo.Mutation<AddConsumedInterfaceMutation, AddConsumedInterfaceMutationVariables> {
    document = AddConsumedInterfaceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveConsumedInterfaceDocument = gql`
    mutation RemoveConsumedInterface($input: RemoveConsumedComponentInterfaceInput!) {
  removeConsumedInterface(input: $input) {
    component {
      id
    }
    interface {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveConsumedInterfaceGQL extends Apollo.Mutation<RemoveConsumedInterfaceMutation, RemoveConsumedInterfaceMutationVariables> {
    document = RemoveConsumedInterfaceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetComponentLabelsDocument = gql`
    query GetComponentLabels($id: ID!) {
  node(id: $id) {
    ... on Component {
      labels {
        nodes {
          id
          createdAt
          name
          description
          color
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetComponentLabelsGQL extends Apollo.Query<GetComponentLabelsQuery, GetComponentLabelsQueryVariables> {
    document = GetComponentLabelsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetBasicComponentDocument = gql`
    query GetBasicComponent($id: ID!) {
  node(id: $id) {
    ... on Component {
      id
      name
      description
      repositoryURL
      imsComponents {
        nodes {
          ims {
            imsType
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
  export class GetBasicComponentGQL extends Apollo.Query<GetBasicComponentQuery, GetBasicComponentQueryVariables> {
    document = GetBasicComponentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetComponentInterfacesDocument = gql`
    query GetComponentInterfaces($id: ID!) {
  node(id: $id) {
    ... on Component {
      id
      interfaces {
        nodes {
          id
          name
          consumedBy {
            nodes {
              id
              name
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
  export class GetComponentInterfacesGQL extends Apollo.Query<GetComponentInterfacesQuery, GetComponentInterfacesQueryVariables> {
    document = GetComponentInterfacesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetComponentDocument = gql`
    query GetComponent($id: ID!) {
  node(id: $id) {
    ... on Component {
      id
      name
      createdBy {
        displayName
        username
        id
      }
      description
      labels {
        nodes {
          name
          id
          color
        }
      }
      imsComponents {
        edges {
          node {
            ims {
              imsType
            }
          }
        }
      }
      issues {
        nodes {
          id
          title
          isOpen
          category
          createdBy {
            id
            displayName
          }
          labels {
            nodes {
              name
              id
              color
            }
          }
          assignees {
            nodes {
              id
              displayName
            }
          }
          body
        }
      }
      interfaces {
        nodes {
          name
          id
        }
      }
      consumedInterfaces {
        nodes {
          name
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetComponentGQL extends Apollo.Query<GetComponentQuery, GetComponentQueryVariables> {
    document = GetComponentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteComponentDocument = gql`
    mutation DeleteComponent($input: DeleteComponentInput!) {
  deleteComponent(input: $input) {
    clientMutationID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteComponentGQL extends Apollo.Mutation<DeleteComponentMutation, DeleteComponentMutationVariables> {
    document = DeleteComponentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateComponentDocument = gql`
    mutation UpdateComponent($input: UpdateComponentInput!) {
  updateComponent(input: $input) {
    clientMutationID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateComponentGQL extends Apollo.Mutation<UpdateComponentMutation, UpdateComponentMutationVariables> {
    document = UpdateComponentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateComponentInterfaceDocument = gql`
    mutation CreateComponentInterface($input: CreateComponentInterfaceInput!) {
  createComponentInterface(input: $input) {
    componentInterface {
      id
      name
      component {
        id
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateComponentInterfaceGQL extends Apollo.Mutation<CreateComponentInterfaceMutation, CreateComponentInterfaceMutationVariables> {
    document = CreateComponentInterfaceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateComponentInterfaceDocument = gql`
    mutation UpdateComponentInterface($input: UpdateComponentInterfaceInput!) {
  updateComponentInterface(input: $input) {
    componentInterface {
      id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateComponentInterfaceGQL extends Apollo.Mutation<UpdateComponentInterfaceMutation, UpdateComponentInterfaceMutationVariables> {
    document = UpdateComponentInterfaceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteComponentInterfaceDocument = gql`
    mutation DeleteComponentInterface($input: DeleteComponentInterfaceInput!) {
  deleteComponentInterface(input: $input) {
    clientMutationID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteComponentInterfaceGQL extends Apollo.Mutation<DeleteComponentInterfaceMutation, DeleteComponentInterfaceMutationVariables> {
    document = DeleteComponentInterfaceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetConsumingComponentsDocument = gql`
    query GetConsumingComponents($id: ID!) {
  node(id: $id) {
    ... on ComponentInterface {
      id
      name
      description
      component {
        name
      }
      consumedBy {
        nodes {
          id
          name
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetConsumingComponentsGQL extends Apollo.Query<GetConsumingComponentsQuery, GetConsumingComponentsQueryVariables> {
    document = GetConsumingComponentsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetInterfaceDocument = gql`
    query GetInterface($id: ID!) {
  node(id: $id) {
    ... on ComponentInterface {
      id
      name
      description
      component {
        id
      }
      issuesOnLocation {
        nodes {
          id
          title
          isOpen
          category
          createdBy {
            id
            displayName
          }
          labels {
            nodes {
              name
              id
              color
            }
          }
          assignees {
            nodes {
              id
              displayName
            }
          }
          body
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetInterfaceGQL extends Apollo.Query<GetInterfaceQuery, GetInterfaceQueryVariables> {
    document = GetInterfaceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetIssueGraphDataDocument = gql`
    query GetIssueGraphData($projectId: ID!, $activeCategories: [IssueCategory!]) {
  node(id: $projectId) {
    ... on Project {
      components {
        nodes {
          name
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
          name
          component {
            id
          }
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
      linkingIssues: issues(filterBy: {linksIssues: true, category: $activeCategories}) {
        nodes {
          id
          category
          locations {
            nodes {
              id
            }
          }
          linksToIssues(filterBy: {category: $activeCategories}) {
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
export const GetIssueGraphDataForSearchDocument = gql`
    query GetIssueGraphDataForSearch($projectId: ID!, $activeCategories: [IssueCategory!], $selectedLabels: [ID!], $issueRegex: String) {
  node(id: $projectId) {
    ... on Project {
      components {
        nodes {
          name
          id
          bugs: issuesOnLocation(filterBy: {category: BUG, fullSearch: {text: $issueRegex, labels: $selectedLabels}}) {
            totalCount
          }
          featureRequests: issuesOnLocation(filterBy: {category: FEATURE_REQUEST, fullSearch: {text: $issueRegex, labels: $selectedLabels}}) {
            totalCount
          }
          unclassified: issuesOnLocation(filterBy: {category: UNCLASSIFIED, fullSearch: {text: $issueRegex, labels: $selectedLabels}}) {
            totalCount
          }
        }
      }
      interfaces {
        nodes {
          id
          name
          component {
            id
          }
          bugs: issuesOnLocation(filterBy: {category: BUG, fullSearch: {text: $issueRegex, labels: $selectedLabels}}) {
            totalCount
          }
          featureRequests: issuesOnLocation(filterBy: {category: FEATURE_REQUEST, fullSearch: {text: $issueRegex, labels: $selectedLabels}}) {
            totalCount
          }
          unclassified: issuesOnLocation(filterBy: {category: UNCLASSIFIED, fullSearch: {text: $issueRegex, labels: $selectedLabels}}) {
            totalCount
          }
          consumedBy {
            nodes {
              id
            }
          }
        }
      }
      linkingIssues: issues(filterBy: {category: $activeCategories, fullSearch: {text: $issueRegex, labels: $selectedLabels}}) {
        nodes {
          id
          category
          locations {
            nodes {
              id
            }
          }
          linksToIssues(filterBy: {category: $activeCategories, fullSearch: {text: $issueRegex, labels: $selectedLabels}}) {
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
  export class GetIssueGraphDataForSearchGQL extends Apollo.Query<GetIssueGraphDataForSearchQuery, GetIssueGraphDataForSearchQueryVariables> {
    document = GetIssueGraphDataForSearchDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateIssueDocument = gql`
    mutation CreateIssue($input: CreateIssueInput!) {
  createIssue(input: $input) {
    issue {
      id
      title
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateIssueGQL extends Apollo.Mutation<CreateIssueMutation, CreateIssueMutationVariables> {
    document = CreateIssueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LinkIssueDocument = gql`
    mutation LinkIssue($input: LinkIssueInput!) {
  linkIssue(input: $input) {
    issue {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LinkIssueGQL extends Apollo.Mutation<LinkIssueMutation, LinkIssueMutationVariables> {
    document = LinkIssueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UnlinkIssueDocument = gql`
    mutation UnlinkIssue($input: UnlinkIssueInput!) {
  unlinkIssue(input: $input) {
    issue {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UnlinkIssueGQL extends Apollo.Mutation<UnlinkIssueMutation, UnlinkIssueMutationVariables> {
    document = UnlinkIssueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetIssueDocument = gql`
    query GetIssue($id: ID!) {
  node(id: $id) {
    ... on Issue {
      id
      title
      body
      bodyRendered
      isOpen
      createdAt
      locations {
        nodes {
          id
          name
        }
      }
      linkedByIssues {
        nodes {
          id
          title
        }
      }
      linksToIssues {
        nodes {
          title
          id
          body
        }
      }
      createdBy {
        id
        displayName
        username
      }
      issueComments {
        nodes {
          id
          issue {
            id
          }
          body
          bodyRendered
          createdBy {
            id
            username
            displayName
          }
          createdAt
        }
      }
      labels {
        nodes {
          name
          id
          color
        }
      }
      assignees {
        nodes {
          id
          displayName
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetIssueGQL extends Apollo.Query<GetIssueQuery, GetIssueQueryVariables> {
    document = GetIssueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CommentIssueDocument = gql`
    mutation CommentIssue($input: AddIssueCommentInput!) {
  addIssueComment(input: $input) {
    comment {
      id
      body
      createdBy {
        id
        username
        displayName
      }
      createdAt
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CommentIssueGQL extends Apollo.Mutation<CommentIssueMutation, CommentIssueMutationVariables> {
    document = CommentIssueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteIssueCommentDocument = gql`
    mutation DeleteIssueComment($input: DeleteIssueCommentInput!) {
  deleteIssueComment(input: $input) {
    deletedComment {
      id
      createdBy {
        id
        username
        displayName
      }
      createdAt
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteIssueCommentGQL extends Apollo.Mutation<DeleteIssueCommentMutation, DeleteIssueCommentMutationVariables> {
    document = DeleteIssueCommentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CloseIssueDocument = gql`
    mutation CloseIssue($input: CloseIssueInput!) {
  closeIssue(input: $input) {
    clientMutationID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CloseIssueGQL extends Apollo.Mutation<CloseIssueMutation, CloseIssueMutationVariables> {
    document = CloseIssueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ReopenIssueDocument = gql`
    mutation ReopenIssue($input: ReopenIssueInput!) {
  reopenIssue(input: $input) {
    clientMutationID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ReopenIssueGQL extends Apollo.Mutation<ReopenIssueMutation, ReopenIssueMutationVariables> {
    document = ReopenIssueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RenameIssueTitleDocument = gql`
    mutation RenameIssueTitle($input: RenameIssueTitleInput!) {
  renameIssueTitle(input: $input) {
    clientMutationID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RenameIssueTitleGQL extends Apollo.Mutation<RenameIssueTitleMutation, RenameIssueTitleMutationVariables> {
    document = RenameIssueTitleDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveIssueFromLocationDocument = gql`
    mutation RemoveIssueFromLocation($input: RemoveIssueFromLocationInput!) {
  removeIssueFromLocation(input: $input) {
    clientMutationID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveIssueFromLocationGQL extends Apollo.Mutation<RemoveIssueFromLocationMutation, RemoveIssueFromLocationMutationVariables> {
    document = RemoveIssueFromLocationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddIssueToLocationDocument = gql`
    mutation AddIssueToLocation($input: AddIssueToLocationInput!) {
  addIssueToLocation(input: $input) {
    clientMutationID
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddIssueToLocationGQL extends Apollo.Mutation<AddIssueToLocationMutation, AddIssueToLocationMutationVariables> {
    document = AddIssueToLocationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateCommentDocument = gql`
    mutation UpdateComment($input: UpdateCommentInput!) {
  updateComment(input: $input) {
    clientMutationID
    comment {
      id
      createdBy {
        id
        displayName
      }
      createdAt
      body
      lastEditedAt
      editedBy {
        nodes {
          id
          displayName
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateCommentGQL extends Apollo.Mutation<UpdateCommentMutation, UpdateCommentMutationVariables> {
    document = UpdateCommentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAllTimelineItemsDocument = gql`
    query getAllTimelineItems($input: ID!) {
  node(id: $input) {
    ... on Issue {
      timeline {
        nodes {
          __typename
          ... on IssueTimelineItem {
            id
            createdBy {
              id
              username
              displayName
            }
            createdAt
            ... on AddedToComponentEvent {
              component {
                id
                name
              }
            }
            ... on AddedToLocationEvent {
              location {
                id
                name
              }
            }
            ... on AssignedEvent {
              assignee {
                id
              }
            }
            ... on CategoryChangedEvent {
              oldCategory
              newCategory
            }
            ... on DueDateChangedEvent {
              oldDueDate
              newDueDate
            }
            ... on DeletedIssueComment {
              deletedBy {
                id
              }
              deletedAt
            }
            ... on EstimatedTimeChangedEvent {
              oldEstimatedTime
              newEstimatedTime
            }
            ... on LabelledEvent {
              label {
                id
                name
                color
              }
            }
            ... on IssueComment {
              body
              lastEditedAt
              editedBy {
                nodes {
                  id
                  username
                  displayName
                }
              }
            }
            ... on MarkedAsDuplicateEvent {
              originalIssue {
                id
                title
              }
            }
            ... on LinkEvent {
              linkedIssue {
                id
                title
              }
            }
            ... on PinnedEvent {
              component {
                id
                name
              }
            }
            ... on ReferencedByIssueEvent {
              mentionedAt {
                id
                title
              }
              mentionedInComment {
                id
              }
            }
            ... on PriorityChangedEvent {
              oldPriority
              newPriority
            }
            ... on RemovedFromComponentEvent {
              removedComponent {
                id
                name
              }
            }
            ... on ReferencedByOtherEvent {
              component {
                id
                name
              }
              source
              sourceURL
            }
            ... on RemovedFromLocationEvent {
              removedLocation {
                id
                name
              }
            }
            ... on StartDateChangedEvent {
              oldStartDate
              newStartDate
            }
            ... on RenamedTitleEvent {
              oldTitle
              newTitle
            }
            ... on UnassignedEvent {
              removedAssignee {
                id
              }
            }
            ... on UnlabelledEvent {
              removedLabel {
                id
              }
            }
            ... on WasLinkedEvent {
              linkedBy {
                id
                title
              }
            }
            ... on UnmarkedAsDuplicateEvent {
              issue {
                id
                title
              }
            }
            ... on WasUnlinkedEvent {
              unlinkedBy {
                id
                title
              }
            }
            ... on UnpinnedEvent {
              component {
                id
                name
              }
            }
            ... on UnlinkEvent {
              removedLinkedIssue {
                id
                title
              }
            }
            ... on AddedArtifactEvent {
              artifact {
                id
              }
            }
            ... on RemovedArtifactEvent {
              removedArtifact {
                id
              }
            }
            ... on AddedNonFunctionalConstraintEvent {
              nonFunctionalConstraint {
                id
              }
            }
            ... on RemovedNonFunctionalConstraintEvent {
              removedNonFunctionalConstraint {
                id
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
  export class GetAllTimelineItemsGQL extends Apollo.Query<GetAllTimelineItemsQuery, GetAllTimelineItemsQueryVariables> {
    document = GetAllTimelineItemsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetLabelsDocument = gql`
    query GetLabels($projectId: ID!) {
  node(id: $projectId) {
    ... on Project {
      labels {
        nodes {
          id
          name
          color
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetLabelsGQL extends Apollo.Query<GetLabelsQuery, GetLabelsQueryVariables> {
    document = GetLabelsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateLabelDocument = gql`
    mutation CreateLabel($input: CreateLabelInput!) {
  createLabel(input: $input) {
    label {
      id
      color
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateLabelGQL extends Apollo.Mutation<CreateLabelMutation, CreateLabelMutationVariables> {
    document = CreateLabelDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddLabelToIssueDocument = gql`
    mutation AddLabelToIssue($input: AddLabelToIssueInput!) {
  addLabelToIssue(input: $input) {
    label {
      id
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddLabelToIssueGQL extends Apollo.Mutation<AddLabelToIssueMutation, AddLabelToIssueMutationVariables> {
    document = AddLabelToIssueDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveLabelFromIssueDocument = gql`
    mutation RemoveLabelFromIssue($input: RemoveLabelFromIssueInput!) {
  removeLabelFromIssue(input: $input) {
    issue {
      title
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveLabelFromIssueGQL extends Apollo.Mutation<RemoveLabelFromIssueMutation, RemoveLabelFromIssueMutationVariables> {
    document = RemoveLabelFromIssueDocument;
    
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
export const GetBasicProjectDocument = gql`
    query GetBasicProject($id: ID!) {
  node(id: $id) {
    ... on Project {
      id
      name
      description
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetBasicProjectGQL extends Apollo.Query<GetBasicProjectQuery, GetBasicProjectQueryVariables> {
    document = GetBasicProjectDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetFullProjectDocument = gql`
    query GetFullProject($id: ID!) {
  node(id: $id) {
    ... on Project {
      id
      name
      description
      components {
        edges {
          node {
            id
            name
            issues {
              nodes {
                id
                title
                createdBy {
                  id
                  displayName
                }
                labels {
                  nodes {
                    id
                    name
                    color
                  }
                }
                assignees {
                  nodes {
                    id
                    displayName
                  }
                }
                category
              }
            }
          }
        }
      }
      interfaces {
        nodes {
          name
          id
          issuesOnLocation {
            nodes {
              id
              title
            }
          }
        }
      }
      issues {
        nodes {
          id
          title
          createdBy {
            id
            displayName
          }
          labels {
            nodes {
              id
              name
              color
            }
          }
          assignees {
            nodes {
              id
              displayName
            }
          }
          category
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetFullProjectGQL extends Apollo.Query<GetFullProjectQuery, GetFullProjectQueryVariables> {
    document = GetFullProjectDocument;
    
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