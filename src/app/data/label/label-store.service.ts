import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CreateLabelGQL, CreateLabelInput, GetLabelsGQL, Label } from '../../../generated/graphql';
import { StateService } from '../../state.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabelStoreService {

  constructor(private getLabelsGQL: GetLabelsGQL, private CreateLabelMutation: CreateLabelGQL) { }

  private getAll(projectId: string): Observable<Pick<Label, 'id' | 'name' | 'color' | 'description'>[]> {
    return this.getLabelsGQL.fetch({ projectId }).pipe(
      map(({ data }) => data.node.labels.nodes)
    );
  }

  public createLabel(input: CreateLabelInput){
    console.log('MUTAAAAAAAAATION');
    return this.CreateLabelMutation.mutate({input});
  }
}
