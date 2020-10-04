import { Injectable } from '@angular/core';
import { GraphComponent, IssuesState, IssueType, IssueRelationType } from 'src/app/model/state';
import { exampleGraph } from 'src/app/model/graph-state';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { GetIssueGraphDataGQL } from 'src/generated/graphql';
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

  reloadIssueGraphData(): void{
    this.getIssueGraphDataQuery.fetch({projectId: this.ss.state.project.id}).pipe(
      tap(result => console.log(result.data)),
      map(result => GraphDataFactory.graphDataFromGQL(result.data))
    ).subscribe(this.graphData$);
  }
}
