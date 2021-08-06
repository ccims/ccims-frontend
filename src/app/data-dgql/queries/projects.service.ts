import { Injectable } from '@angular/core';
import {
  GetProjectGQL,
  ListProjectsGQL,
  ProjectFilter,
} from 'src/generated/graphql-dgql';
import { promisifyApolloFetch, QueryListParams } from '@app/data-dgql/queries/util';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  constructor(
    private qListProjects: ListProjectsGQL,
    private qGetProject: GetProjectGQL,
  ) {}

  listProjects(list: QueryListParams<ProjectFilter>) {
    return promisifyApolloFetch(this.qListProjects.fetch({ ...list }));
  }

  getProject(id: string) {
    return promisifyApolloFetch(this.qGetProject.fetch({ id }));
  }
}
