import { Injectable } from '@angular/core';
import { GraphComponent, IssuesState, IssueType, IssueRelationType } from 'src/app/model/state';
import { exampleGraph } from 'src/app/model/graph-state';
import { BehaviorSubject } from 'rxjs';
import { GetIssueGraphDataGQL } from 'src/generated/graphql';
import { StateService } from '@app/state.service';
import { GraphDataFactory } from './graph-data';

@Injectable({
  providedIn: 'root'
})
export class IssueGraphStoreService {

  private state: GraphComponent[] = exampleGraph;
  state$ = new BehaviorSubject<GraphComponent[]>(this.state);

  constructor(private getIssueGraphDataQuery: GetIssueGraphDataGQL, private ss: StateService) {
  }

  getIssueGraphData() {
    this.getIssueGraphDataQuery.fetch({projectId: this.ss.state.project.id}).subscribe(result => {
      console.log(result.data);
      GraphDataFactory.graphDataFromGQL(result.data);
    });
  }
}
