import { Injectable } from '@angular/core';
import { GraphComponent } from '../model/state';
import { Observable, of } from 'rxjs';
import { exampleGraph } from '../model/graph-state';

@Injectable({
  providedIn: 'root'
})
export class GraphApiService {

  private state: GraphComponent[] = exampleGraph;

  constructor() { }
  addComponent(component: GraphComponent): Observable<GraphComponent[]> {
    return of(exampleGraph);
  }
}
