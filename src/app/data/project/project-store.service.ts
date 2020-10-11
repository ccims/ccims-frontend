import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GetFullProjectQuery, CreateProjectGQL, CreateProjectInput, DeleteProjectGQL, DeleteProjectInput, GetAllProjectsGQL, GetProjectGQL, Project, ProjectFilter, GetFullProjectGQL, User, Maybe, Issue, Component } from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStoreService {

  constructor(private authService: AuthenticationService, private getAllQuery: GetAllProjectsGQL,
     private getQuery: GetProjectGQL, private fullProjectQuery: GetFullProjectGQL,
              private createProject: CreateProjectGQL, private deleteProject: DeleteProjectGQL) {}

  create(name: string) {
    const input: CreateProjectInput = {
      name,
      owner: this.authService.currentUserValue.id
    };
    return this.createProject.mutate({input});
  }

  delete(id: string) {
    const input: DeleteProjectInput = {
      projectId: id
    };
    return this.deleteProject.mutate({input});
  }

  get(id: string): Observable<Pick<Project, 'id' | 'name'>>{
    return this.getQuery.fetch({id}).pipe(
      map(({ data}) => data.node)
    );
  }

  getFullProject(id: string): Observable<GetFullProjectQuery>{
    return this.fullProjectQuery.fetch({id}).pipe(
      map(({data}) => data)
    );
  }

  getAll(): Observable<Pick<Project, 'id' | 'name'>[]>{
    const filter: ProjectFilter = {
      owner: [this.authService.currentUserValue.id]
    };
    return this.getAllQuery.fetch({filter}).pipe(
      map(({ data}) => data.projects.edges.map(edge => edge.node))
    );
  }

  /*
  getSingle(id: number): Project {
    return this.projects.find(project => project.id === id);
  }
  */
}
