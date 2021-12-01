import {Injectable} from '@angular/core';
import {
  ComponentFilter,
  ComponentInterfaceFilter,
  GetComponentGQL,
  GetComponentQuery,
  GetInterfaceGQL,
  GetInterfaceQuery,
  ListProjectComponentsGQL,
  ListProjectComponentsQuery,
  ListProjectInterfacesGQL,
  ListProjectInterfacesQuery
} from 'src/generated/graphql-dgql';
import {promisifyApolloFetch, QueryListParams} from '@app/data-dgql/queries/util';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {
  constructor(
    private qListProjectComponents: ListProjectComponentsGQL,
    private qListProjectInterfaces: ListProjectInterfacesGQL,
    private qGetComponent: GetComponentGQL,
    private qGetInterface: GetInterfaceGQL
  ) {}

  listProjectComponents(project: string, list: QueryListParams<ComponentFilter>): Promise<ListProjectComponentsQuery> {
    return promisifyApolloFetch(this.qListProjectComponents.fetch({project, ...list}));
  }

  listProjectInterfaces(project: string, list: QueryListParams<ComponentInterfaceFilter>): Promise<ListProjectInterfacesQuery> {
    return promisifyApolloFetch(this.qListProjectInterfaces.fetch({project, ...list}));
  }

  getComponent(id: string): Promise<GetComponentQuery> {
    return promisifyApolloFetch(this.qGetComponent.fetch({id}));
  }

  getInterface(id: string): Promise<GetInterfaceQuery> {
    return promisifyApolloFetch(this.qGetInterface.fetch({id}));
  }
}
