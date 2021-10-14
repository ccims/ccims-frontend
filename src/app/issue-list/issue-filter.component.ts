import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IssueFilter, LabelFilter } from '../../generated/graphql-dgql';
import { decodeNodeId, ListId } from '@app/data-dgql/id';

const PREDICATES = {
  isOpen: { type: 'bool', label: 'Is open' },
  isDuplicate: { type: 'bool', label: 'Is duplicate' },
  labels: { type: 'labels', label: 'Labels' },
};

function getDefaultForType(type: string) {
  switch (type) {
    case 'bool':
      return true;
    case 'labels':
      return [];
    default:
      throw new Error(`unknown type ${type}`);
  }
}

function convertValueForFilter(type: string, value: any) {
  switch (type) {
    case 'labels':
      return value.map(item => decodeNodeId(item).id);
    default:
      return value;
  }
}

@Component({
  selector: 'app-issue-filter',
  templateUrl: './issue-filter.component.html',
  styleUrls: ['./issue-filter.component.scss']
})
export class IssueFilterComponent {
  @Input() allLabelsList: ListId;
  @Output() filterChange = new EventEmitter<IssueFilter>();

  // constants as class properties because angular
  predicates = PREDICATES;
  predicateCount = Object.keys(PREDICATES).length;

  activePredicates: string[] = [];
  predicateValues: { [key: string]: any } = {};
  searchQuery = '';

  /**
   * Returns all types of predicates that were not taken in previous items.
   * @param index index in activePredicates
   */
  getRemainingTypes(index: number): string[] {
    const previousItems = this.activePredicates.slice(0, index);
    return Object.keys(PREDICATES).filter(id => !previousItems.includes(id));
  }

  /**
   * Sets the type of the predicate at index in activePredicates.
   * @param index index in activePredicates
   * @param type new type (must be unique!)
   */
  setPredicateType(index: number, type: string) {
    this.activePredicates[index] = type;
    this.predicateValues[type] = getDefaultForType(PREDICATES[type].type);
    this.update();
  }

  /**
   * Removes the predicate at the given index in activePredicates.
   * @param index index in activePredicates
   */
  removePredicateAt(index: number) {
    const type = this.activePredicates.splice(index, 1)[0];
    delete this.predicateValues[type];
    this.update();
  }

  /**
   * Adds a new predicate after the given index in activePredicates.
   * @param index index in activePredicates
   */
  addPredicateAfter(index: number) {
    const type = this.getRemainingTypes(index + 1)[0];
    this.activePredicates.splice(index + 1, 0, type);
    this.predicateValues[type] = getDefaultForType(PREDICATES[type].type);
    this.update();
  }

  applyLabelsChangeset = async (added, removed) => {
    for (const item of added) {
      this.predicateValues.labels.push(item);
    }
    for (const item of removed) {
      this.predicateValues.labels.splice(this.predicateValues.labels.indexOf(item), 1);
    }
    this.update();
  }
  makeLabelFilter(search): LabelFilter {
    return { name: search };
  }

  buildFilter(): IssueFilter {
    const filter: IssueFilter = {};
    if (this.searchQuery.trim()) {
      filter.fullSearch = { text: this.searchQuery.trim() };
    }
    for (const id of this.activePredicates) {
      filter[id] = convertValueForFilter(PREDICATES[id].type, this.predicateValues[id]);
    }
    console.log('[DBG] built filter', filter);
    return filter;
  }

  update() {
    this.filterChange.emit(this.buildFilter());
  }
}
