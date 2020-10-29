import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { CreateLabelGQL, CreateLabelInput, GetLabelsGQL, Label } from '../../../generated/graphql';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelStoreService {

  constructor(private getLabelsGQL: GetLabelsGQL, private CreateLabelMutation: CreateLabelGQL) { }


  getMatchingLabels(projectId: string, term: string = null): Observable<FilterLabel[]> {
    this.getAllFilter(projectId).pipe(tap(items => console.log("labels: ", items)));
    if (!term) {
      return this.getAllFilter(projectId);
    }
    return this.getAllFilter(projectId).pipe(
      map(items => items.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1))
    );
  }

  private getAllFilter(projectId: string): Observable<FilterLabel[]> {
    return this.getLabelsGQL.fetch({ projectId }).pipe(
      map(({ data }) => data.node.labels.nodes)
    );
  }


  public createLabel(input: CreateLabelInput) {
    return this.CreateLabelMutation.mutate({ input });
  }
}

export type FilterLabel = Pick<Label, 'id' | 'name' | 'color'>;
