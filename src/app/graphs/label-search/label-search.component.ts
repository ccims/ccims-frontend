import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { concat, of, Subject, Observable, BehaviorSubject } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { FilterLabel, isFilterLabel, LabelStoreService } from '../../data/label/label-store.service';
import { StateService } from '../../state.service';

/**
 * This component is responsible for the display of the search bar above the graph.
 * It allows for filtering issues by multiple labels and text fragments.
 */
@Component({
  selector: 'app-label-search',
  templateUrl: './label-search.component.html',
  styleUrls: ['./label-search.component.scss']
})
export class LabelSearchComponent implements OnInit {
  public filterSelection$ = new BehaviorSubject<FilterSelection>({labels: [], texts: []});

  labels$: Observable<FilterLabel[]>;
  labelsLoading = false;
  labelsInput$ = new Subject<string>();
  selectedLabels: FilterElement[] = [];

  constructor(private labelStore: LabelStoreService, private ss: StateService) {
  }

  ngOnInit() {
      this.loadLabels();
  }

  trackByFn(item: FilterLabel) {
      return item.id;
  }

  /**
   * Emit value representing label and text fragments in the search bar via this.filterSelection$
   */
  emitSelectedLabels() {
    const selection: FilterSelection = {texts: [], labels: []};
    // find out which elements in search bar correspond to an existing label on the backend and which to a text fragment
    selection.texts = this.selectedLabels.filter(item => !isFilterLabel(item)).map(item => item.name);
    selection.labels = this.selectedLabels.filter(label => isFilterLabel(label)) as FilterLabel[];
    this.filterSelection$.next(selection);
  }

  /**
   * Load all labels from backend that match the currently typed in ng-select element
   */
  private loadLabels() {
      this.labels$ = concat(
          of([]), // default items
          this.labelsInput$.pipe(
              distinctUntilChanged(),
              tap(() => this.labelsLoading = true),
              switchMap(term => this.labelStore.getMatchingLabels(this.ss.state.project.id, term).pipe(
                  catchError(() => of([])), // empty list on error
                  tap(() => this.labelsLoading = false)
              ))
          )
      );
  }

}


/**
 * The bar can contain elements standing for labels and elements for text fragments.
 */
type FilterElement = TextFragment | FilterLabel;

interface TextFragment {
  name: string;
}

export interface FilterSelection {
  texts: string[];
  labels: FilterLabel[];
}

