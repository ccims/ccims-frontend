import { Injectable } from '@angular/core';
import { exampleGraph } from 'src/app/model/graph-state';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { GetIssueGraphDataGQL, IssueCategory } from 'src/generated/graphql';
import { StateService } from '@app/state.service';
import { GraphData, GraphDataFactory } from './graph-data';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IssueGraphStoreService {

  graphData$ = new ReplaySubject<GraphData>(1);

  constructor(private getIssueGraphDataQuery: GetIssueGraphDataGQL, private ss: StateService) {
  }

  loadIssueGraphData(projectId: string) {
      this.getIssueGraphDataQuery.fetch({projectId}).pipe(
        tap(result => console.log(result.data)),
        map(result => GraphDataFactory.graphDataFromGQL(result.data))
      ).subscribe(this.graphData$);
    }

  mockedLoadIssueGraphData(): Observable<GraphData> {
    return of(GraphDataFactory.graphDataFromMock());
  }
}
