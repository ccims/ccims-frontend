import { Injectable } from '@angular/core';
import { exampleGraph } from 'src/app/model/graph-state';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { GetIssueGraphDataGQL, IssueCategory } from 'src/generated/graphql';
import { StateService } from '@app/state.service';
import { GraphData, GraphDataFactory } from './graph-data';
import { map, switchMap, tap, filter, shareReplay } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueGraphStoreService {

  public state$: BehaviorSubject<GraphData>;

  constructor(private getIssueGraphDataQuery: GetIssueGraphDataGQL, private ss: StateService) {
    this.state$ = new BehaviorSubject({components: new Map(), interfaces: new Map()});
  }

  graphDataForFilter(filter$: BehaviorSubject<string>): Observable<GraphData>{
    const state$: BehaviorSubject<GraphData> = new BehaviorSubject({components: new Map(), interfaces: new Map()});
    return combineLatest(this.ss.state$, filter$).pipe(
      filter(([appState, _]) => appState.project?.id != null),
      switchMap(([appState, filterString]) => this.loadIssueGraphData(appState.project.id)),
      shareReplay(1)
    );
  }

  loadIssueGraphData(projectId: string): Observable<GraphData> {
      return this.getIssueGraphDataQuery.fetch({projectId}).pipe(
        map(result => GraphDataFactory.graphDataFromGQL(result.data)),
      );
    }

  mockedLoadIssueGraphData(): Observable<GraphData> {
    return of(GraphDataFactory.graphDataFromMock());
  }
}
