import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {
  CreateProjectGQL,
  CreateProjectInput,
  DeleteProjectGQL,
  DeleteProjectInput,
  GetAllProjectsGQL,
  GetBasicProjectGQL,
  GetBasicProjectQuery,
  GetFullProjectGQL,
  GetFullProjectQuery,
  Project,
  ProjectFilter
} from 'src/generated/graphql';
import {Observable} from 'rxjs';
import {AuthenticationService} from '@app/auth/authentication.service';

/**
 * This service provides get, create and delete operations for projects
 * With the get-method only the id and name of one project, specified by the id, will be fetched
 * The getFulProject method fetches all the information of a project the database provides
 * The getAll method fetches the name and id for all projects. This is used to reduce
 * transfered data while showing the projects list
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectStoreService {

  constructor(private authService: AuthenticationService, private getAllQuery: GetAllProjectsGQL,
              private getBasicProjectQuery: GetBasicProjectGQL, private getFullQuery: GetFullProjectGQL,
              private createProject: CreateProjectGQL, private deleteProject: DeleteProjectGQL) {
  }

  create(name: string, description: string) {
    const input: CreateProjectInput = {
      name,
      description
    };
    return this.createProject.mutate({input});
  }

  delete(id: string) {
    const input: DeleteProjectInput = {
      project: id
    };
    return this.deleteProject.mutate({input});
  }

  getBasicProject(id: string): Observable<GetBasicProjectQuery> {
    return this.getBasicProjectQuery.fetch({id}).pipe(map(({data}) => data));
  }

  getFullProject(id: string): Observable<GetFullProjectQuery> {
    return this.getFullQuery.fetch({id}).pipe(map(({data}) => data));
  }

  getAll(): Observable<Pick<Project, 'id' | 'name'>[]> {
    const filter: ProjectFilter = {};
    return this.getAllQuery.fetch({filter}).pipe(
      map(({data}) => data.projects.edges.map(edge => edge.node))
    );
  }
}
