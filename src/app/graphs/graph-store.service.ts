import { Injectable } from '@angular/core';
import { GraphComponent, IssuesState, IssueType, IssueRelationType } from 'src/app/model/state';
import { exampleGraph } from 'src/app/model/graph-state';
import { BehaviorSubject } from 'rxjs';
import { GraphApiService } from './graph-api.service';

@Injectable({
  providedIn: 'root'
})
export class GraphStoreService {

  private state: GraphComponent[] = exampleGraph;
  state$ = new BehaviorSubject<GraphComponent[]>(this.state);

  constructor(private graphApi: GraphApiService) {
  }

  addComponent(component: GraphComponent) {
    this.graphApi.addComponent(component).subscribe(this.state$);
  }
}
