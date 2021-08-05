import { Injectable } from '@angular/core';
import {
  ComponentFilter,
  GetComponentGQL,
  ListProjectComponentsGQL,
} from 'src/generated/graphql-dgql';
import { promisifyApolloFetch, QueryListParams } from '@app/data-dgql/queries/util';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {
  constructor(
    private qListProjectComponents: ListProjectComponentsGQL,
    private qGetComponent: GetComponentGQL,
  ) {}

  listProjectComponents(project: string, list: QueryListParams<ComponentFilter>) {
    return promisifyApolloFetch(this.qListProjectComponents.fetch({ project, ...list }));
  }

  getComponent(id: string) {
    return promisifyApolloFetch(this.qGetComponent.fetch({ id }));
  }
}
