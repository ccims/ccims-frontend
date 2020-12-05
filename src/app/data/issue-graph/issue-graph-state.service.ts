import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { StateService } from '@app/state.service';
import { GraphData, GraphDataFactory } from './graph-data';
import { map, switchMap, tap, filter, shareReplay, takeUntil } from 'rxjs/operators';
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

  mockedLoadIssueGraphData(): Observable<GraphData> {
    return of(GraphDataFactory.graphDataMock());
  }

  addConsumedInterface(componentId: string, interfaceId: string) {
    return this.apiService.addConsumedInterface(componentId, interfaceId);
  }

  removeConsumedInterface(componentId: string, interfaceId: string) {
    return this.apiService.removeConsumedInterface(componentId, interfaceId);
  }
}
