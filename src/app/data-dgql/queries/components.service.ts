import { Injectable } from '@angular/core';
import {
  ComponentFilter, ComponentInterfaceFilter,
  GetComponentGQL,
  ListProjectComponentsGQL, ListProjectInterfacesGQL,
} from 'src/generated/graphql-dgql';
import { promisifyApolloFetch, QueryListParams } from '@app/data-dgql/queries/util';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {
  constructor(
    private qListProjectComponents: ListProjectComponentsGQL,
    private qListProjectInterfaces: ListProjectInterfacesGQL,
    private qGetComponent: GetComponentGQL,
  ) {}

  listProjectComponents(project: string, list: QueryListParams<ComponentFilter>) {
    return promisifyApolloFetch(this.qListProjectComponents.fetch({ project, ...list }));
  }

  listProjectInterfaces(project: string, list: QueryListParams<ComponentInterfaceFilter>) {
    return promisifyApolloFetch(this.qListProjectInterfaces.fetch({ project, ...list }));
  }

  getComponent(id: string) {
    return promisifyApolloFetch(this.qGetComponent.fetch({ id }));
  }
}
