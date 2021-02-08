import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeleteComponentGQL, DeleteComponentInput, GetComponentGQL,
  GetComponentQuery, UpdateComponentGQL, UpdateComponentInput } from 'src/generated/graphql';
import { map } from 'rxjs/operators';

/**
 * Provides updating, deleting and retrieving components from the backend.
 * Objects like updateComponentMutation are injected and were created by a codegenerator based on
 * the mutation UpdateComponent in the component.graphql file in this folder. The same hold for the
 * other mutation and query objects.
 */
@Injectable({
  providedIn: 'root'
})
export class ComponentStoreService {

  constructor(private updateComponentMutation: UpdateComponentGQL, private deleteComponentMutation: DeleteComponentGQL,
              private getFullComponentQuery: GetComponentGQL) { }

  getFullComponent(id: string): Observable<GetComponentQuery> {
    return this.getFullComponentQuery.fetch({ id }).pipe(
      map(({ data }) => data)
    );
  }

  deleteComponent(id: string) {
    const input: DeleteComponentInput = {
      componentId: id
    };
    return this.deleteComponentMutation.mutate({input});
  }

  updateComponent(input: UpdateComponentInput) {
    return this.updateComponentMutation.mutate({input});
  }
}
