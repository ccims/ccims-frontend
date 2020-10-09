import { Injectable } from '@angular/core';
import { exampleGraph } from 'src/app/model/graph-state';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { GetIssueGraphDataGQL, IssueCategory } from 'src/generated/graphql';
import { StateService } from '@app/state.service';
import { GraphData, GraphDataFactory } from './graph-data';
import { map, switchMap, tap, filter, shareReplay } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { IssueGraphApiService } from './issue-graph-api.service';
import { state } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class IssueGraphStateService {


  constructor(private apiService: IssueGraphApiService, private ss: StateService,) {
  }
  state$: Observable<GraphData>;
  reload$: BehaviorSubject<void> = new BehaviorSubject(null);

  graphDataForFilter(filter$: BehaviorSubject<string>): Observable<GraphData> {
    this.state$ = combineLatest(this.ss.state$, filter$, this.reload$).pipe(
      filter(([appState, _]) => appState.project?.id != null),
      switchMap(([appState, filterString]) => this.apiService.loadIssueGraphData(appState.project.id)),
      shareReplay(1)
    );
    return this.state$;
  }

  mockedLoadIssueGraphData(): Observable<GraphData> {
    return of(GraphDataFactory.graphDataMock());
  }

  addConsumedInterface(componentId: string, interfaceId: string) {
    this.apiService.addConsumedInterface(componentId, interfaceId).
      subscribe(result => this.reload$.next());
  }

  removeConsumedInterface(componentId: string, interfaceId: string) {
    this.apiService.removeConsumedInterface(componentId, interfaceId).
      subscribe(result => this.reload$.next());
  }

}
