import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IssueCategory, IssueFilter} from '../../generated/graphql-dgql';
import {ListId, ListType, NodeType, ROOT_NODE} from '@app/data-dgql/id';

/** Returns the ListId for listing all project issues. */
const listAllIssues = (self: IssueFilterComponent): {node: {id: string; type: NodeType}; type: ListType} => ({
  node: {type: NodeType.Project, id: self.projectId},
  type: ListType.Issues
});

/**
 * List of all possible issue filter predicates.
 *
 * Keyed by their name, each predicate has a type, label,
 * and possibly additional options depending on their type.
 */
const PREDICATES = {
  isOpen: {type: 'bool', label: 'Is open'},
  isDuplicate: {type: 'bool', label: 'Is duplicate'},
  category: {
    type: 'enum',
    label: 'Category',
    options: [
      [IssueCategory.Unclassified, 'Unclassified'],
      [IssueCategory.Bug, 'Bug'],
      [IssueCategory.FeatureRequest, 'Feature Request']
    ]
  },
  labels: {
    type: 'ids',
    label: 'Labels',
    dataType: 'label',
    scoreKeys: ['name'],
    listAll: (self: IssueFilterComponent): ListId => self.allLabelsList,
    makeFilter: (query: string): {name: string} => ({name: query}),
    ifEmpty: 'No labels selected'
  },
  linksIssues: {type: 'bool', label: 'Has linked issues'},
  linkedIssues: {
    type: 'ids',
    label: 'Linked issues',
    dataType: 'issue',
    scoreKeys: ['title'],
    listAll: listAllIssues,
    makeFilter: (query: string): {title: string} => ({title: query}),
    ifEmpty: 'No issues selected'
  },
  isLinkedByIssues: {type: 'bool', label: 'Is linked by issues'},
  linkedByIssues: {
    type: 'ids',
    label: 'Linked by issues',
    dataType: 'issue',
    scoreKeys: ['title'],
    listAll: listAllIssues,
    makeFilter: (query: string): {title: string} => ({title: query}),
    ifEmpty: 'No issues selected'
  },
  participants: {
    type: 'ids',
    label: 'Participants',
    dataType: 'user',
    scoreKeys: ['username', 'displayName'],
    listAll: (): {node: {id: string; type: NodeType}; type: ListType} => ({node: ROOT_NODE, type: ListType.SearchUsers}),
    makeFilter: (query: string): {username: string} => ({username: query}),
    ifEmpty: 'No users selected'
  },
  locations: {
    type: 'ids',
    label: 'Locations',
    dataType: 'location',
    scoreKeys: ['name'],
    listAll: (
      self: IssueFilterComponent
    ): {
      staticSources: ({node: {id: string; type: NodeType}; type: ListType} | {node: {id: string; type: NodeType}; type: ListType})[];
    } => ({
      staticSources: [
        {
          node: {type: NodeType.Project, id: self.projectId},
          type: ListType.Components
        },
        {
          node: {type: NodeType.Project, id: self.projectId},
          type: ListType.ComponentInterfaces
        }
      ]
    }),
    makeFilter: (query: string): {title: string} => ({title: query}),
    ifEmpty: 'No locations selected'
  }
};

/** Returns the default value for a predicate type. */
function getDefaultForType(type: string) {
  switch (type) {
    case 'bool':
      return true;
    case 'enum':
    case 'ids':
      return [];
    default:
      throw new Error(`unknown type ${type}`);
  }
}

/** Converts a predicate value into the backend representation for use in the filter. */
function convertValueForFilter(type: string, value: any) {
  switch (type) {
    case 'ids':
      return value.map((item) => item.id);
    default:
      return value;
  }
}

/**
 * Edits an IssueFilter object.
 */
@Component({
  selector: 'app-issue-filter',
  templateUrl: './issue-filter.component.html',
  styleUrls: ['./issue-filter.component.scss']
})
export class IssueFilterComponent {
  /** Raw project ID. */
  @Input() projectId: string;
  /** The list from which to source labels in the label picker. */
  @Input() allLabelsList: ListId;
  /** Emitted every time the filter is changed. */
  @Output() filterChange = new EventEmitter<IssueFilter>();

  // constants as class properties because angular
  predicates = PREDICATES;
  predicateCount = Object.keys(PREDICATES).length;

  /** The names of currently active predicates. */
  activePredicates: string[] = [];
  /** The values of currently active predicates. */
  predicateValues: {[key: string]: any} = {};
  /** Current search query. */
  searchQuery = '';

  /**
   * Returns all types of predicates that were not taken in previous items.
   * @param index index in activePredicates
   */
  getRemainingTypes(index: number): string[] {
    const previousItems = this.activePredicates.slice(0, index);
    return Object.keys(PREDICATES).filter((id) => !previousItems.includes(id));
  }

  /**
   * Sets the type of the predicate at index in activePredicates.
   * @param index index in activePredicates
   * @param type new type (must be unique!)
   */
  setPredicateType(index: number, type: string): void {
    this.activePredicates[index] = type;
    this.predicateValues[type] = getDefaultForType(PREDICATES[type].type);
    this.update();
  }

  /**
   * Removes the predicate at the given index in activePredicates.
   * @param index index in activePredicates
   */
  removePredicateAt(index: number): void {
    const type = this.activePredicates.splice(index, 1)[0];
    delete this.predicateValues[type];
    this.update();
  }

  /**
   * Adds a new predicate after the given index in activePredicates.
   * @param index index in activePredicates
   */
  addPredicateAfter(index: number): void {
    const type = this.getRemainingTypes(index + 1)[0];
    this.activePredicates.splice(index + 1, 0, type);
    this.predicateValues[type] = getDefaultForType(PREDICATES[type].type);
    this.update();
  }

  /**
   * Sets the presence of a value in an array of enum variants.
   * @param array the array to mutate
   * @param item the enum variant
   * @param inArray whether or not it should be in the array
   */
  setInEnumArray(array, item, inArray): void {
    if (inArray && !array.includes(item)) {
      array.push(item);
    }
    if (!inArray && array.includes(item)) {
      array.splice(array.indexOf(item), 1);
    }
    this.update();
  }

  /**
   * Returns a function that can be passed to an app-set-editor to apply the changeset to the
   * value of the id predicate.
   * @param id predicate name
   */
  applyIdChangeset(id: string): (added: any, removed: any) => Promise<void> {
    return async (added, removed) => {
      for (const item of added) {
        this.predicateValues[id].push(item);
      }
      for (const item of removed) {
        this.predicateValues[id].splice(this.predicateValues[id].indexOf(item), 1);
      }
      this.update();
    };
  }

  /**
   * Builds an IssueFilter from the search query and selected filters.
   */
  buildFilter(): IssueFilter {
    const filter: IssueFilter = {};
    if (this.searchQuery.trim()) {
      filter.fullSearch = {text: this.searchQuery.trim()};
    }
    for (const id of this.activePredicates) {
      filter[id] = convertValueForFilter(PREDICATES[id].type, this.predicateValues[id]);
    }
    return filter;
  }

  /** Emits a change event. */
  update(): void {
    this.filterChange.emit(this.buildFilter());
  }
}
