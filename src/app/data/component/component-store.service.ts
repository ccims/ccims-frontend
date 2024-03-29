import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  CreateComponentGQL,
  CreateComponentInput,
  DeleteComponentGQL,
  DeleteComponentInput,
  GetBasicComponentGQL,
  GetBasicComponentQuery,
  GetComponentGQL,
  GetComponentInterfacesGQL,
  GetComponentInterfacesQuery,
  GetComponentLabelsGQL,
  GetComponentLabelsQuery,
  GetComponentQuery,
  UpdateComponentGQL,
  UpdateComponentInput
} from 'src/generated/graphql';
import {map} from 'rxjs/operators';

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
  constructor(
    private updateComponentMutation: UpdateComponentGQL,
    private deleteComponentMutation: DeleteComponentGQL,
    private getFullComponentQuery: GetComponentGQL,
    private createComponentMutation: CreateComponentGQL,
    private getLabelsQuery: GetComponentLabelsGQL,
    private getBasicComponentQuery: GetBasicComponentGQL,
    private getComponentInterfacesQuery: GetComponentInterfacesGQL
  ) {}

  getComponentLabels(id: string): Observable<GetComponentLabelsQuery> {
    return this.getLabelsQuery.fetch({id}).pipe(map(({data}) => data));
  }

  getBasicComponent(id: string): Observable<GetBasicComponentQuery> {
    return this.getBasicComponentQuery.fetch({id}).pipe(map(({data}) => data));
  }

  getFullComponent(id: string): Observable<GetComponentQuery> {
    return this.getFullComponentQuery.fetch({id}).pipe(map(({data}) => data));
  }

  getComponentInterfaces(id: string): Observable<GetComponentInterfacesQuery> {
    return this.getComponentInterfacesQuery.fetch({id}).pipe(map(({data}) => data));
  }

  deleteComponent(id: string): Observable<any> {
    const input: DeleteComponentInput = {
      component: id
    };
    return this.deleteComponentMutation.mutate({input});
  }

  createComponent(input: CreateComponentInput): Observable<any> {
    return this.createComponentMutation.mutate({input});
  }

  updateComponent(input: UpdateComponentInput): Observable<any> {
    return this.updateComponentMutation.mutate({input});
  }
}
