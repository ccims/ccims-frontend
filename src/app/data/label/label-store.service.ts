import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GetLabelsGQL, GetLabelsQueryVariables, Label } from '../../../generated/graphql';
import { StateService } from '../../state.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelStoreService {

  constructor(private getLabelsGQL: GetLabelsGQL, private ss: StateService) { }

  private getAll(projectId: string): Observable<Pick<Label, "id" | "name" | "color" | "description">[]> {
    return this.getLabelsGQL.fetch({ projectId }).pipe(
      map(({ data }) => data.node.labels.nodes)
    );
  }
}
