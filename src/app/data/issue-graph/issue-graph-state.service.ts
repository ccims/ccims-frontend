import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { StateService } from '@app/state.service';
import { GraphData, GraphDataFactory } from './graph-data';
import { map, switchMap, tap, filter, shareReplay } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { IssueGraphApiService } from './issue-graph-api.service';
import { FilterState } from '@app/graphs/shared';

@Injectable({
  providedIn: 'root'
})
export class IssueGraphStateService {


  constructor(private apiService: IssueGraphApiService, private ss: StateService, ) {
  }
  state$: Observable<GraphData>;
  reload$: BehaviorSubject<void> = new BehaviorSubject(null);

  graphDataForFilter(filter$: BehaviorSubject<FilterState>, reload$: BehaviorSubject<void>): Observable<GraphData> {
    // reload$ appears to be unused. Not true. Whenever a new value arrives from it, loadIssueGraphData is executed
    this.state$ = combineLatest([this.ss.state$, filter$, reload$]).pipe(
      filter(([appState, _]) => appState.project?.id != null),
      switchMap(([appState, filterState]) => this.apiService.loadIssueGraphData(appState.project.id, filterState.selectedCategories)),
      shareReplay(1)
    );
    return this.state$;
  }

  mockedLoadIssueGraphData(): Observable<GraphData> {
    return of(GraphDataFactory.graphDataMock());
  }

  addConsumedInterface(componentId: string, interfaceId: string) {
    this.apiService.addConsumedInterface(componentId, interfaceId);
  }

  removeConsumedInterface(componentId: string, interfaceId: string) {
    this.apiService.removeConsumedInterface(componentId, interfaceId);
  }

}
