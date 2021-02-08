import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { StateService } from '@app/state.service';
import { GraphData } from './graph-data';
import { switchMap, filter, shareReplay, takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { IssueGraphApiService } from './issue-graph-api.service';
import { FilterState } from '@app/graphs/shared';

@Injectable({
  providedIn: 'root'
})
export class IssueGraphStateService {

  state$: Observable<GraphData>;

  constructor(private apiService: IssueGraphApiService, private ss: StateService) {
  }

  /**
   * Maps an observable of the state of the graph filters (toggles and queries in search bar) onto an observable
   * emitting graph state for these filters retrieved from the backend.
   * @param filter$ an observable emitting a sequence of values describing the state of the filter bar above the graph
   * @param reload$ an observable emitting irrelevant values to signal a reload is required, after a manipulation of graph data
   * @param destroy$ used to signal that the caller is no longer interested. On emission the returned observable finishes.
   * @returns observable emitting sequence of graph states containing e.g. components and interfaces. It will emit new values when
   * the filter$ or reload$ observables emit a value.
   */
  graphDataForFilter(filter$: BehaviorSubject<FilterState>, reload$: BehaviorSubject<void>,
                     destroy$: ReplaySubject<void>): Observable<GraphData> {
    // Whenever a new value arrives from reload$, loadIssueGraphData is executed
    this.state$ = combineLatest([this.ss.state$, filter$, reload$]).pipe(
      takeUntil(destroy$),
      filter(([appState, _]) => appState.project?.id != null),
      switchMap(([appState, filterState]) => this.apiService.loadIssueGraphData(appState.project.id,
        filterState.selectedCategories, filterState.selectedFilter.labels, filterState.selectedFilter.texts)),
      shareReplay(1)
    );
    return this.state$;
  }

  /**
   * Make the interface with interfaceId a consumed interface of the component with id componentId
   * @param componentId
   * @param interfaceId
   */
  addConsumedInterface(componentId: string, interfaceId: string) {
    return this.apiService.addConsumedInterface(componentId, interfaceId);
  }

/**
 * Remove the interface with interfaceId from consumed interfaces of the component with id componentId
 * @param componentId
 * @param interfaceId
 */
  removeConsumedInterface(componentId: string, interfaceId: string) {
    return this.apiService.removeConsumedInterface(componentId, interfaceId);
  }
}
