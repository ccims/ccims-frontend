import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GetIssueGraphDataGQL } from 'src/generated/graphql';
import { GraphData, GraphDataFactory } from './graph-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueGraphApiService {

  constructor(private getIssueGraphDataQuery: GetIssueGraphDataGQL) { }
  loadIssueGraphData(projectId: string): Observable<GraphData> {
    return this.getIssueGraphDataQuery.fetch({projectId}).pipe(
      map(result => GraphDataFactory.graphDataFromGQL(result.data)),
    );
  }
}
