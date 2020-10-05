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

  constructor(private getIssueGraphDataQuery: GetIssueGraphDataGQL) {
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
