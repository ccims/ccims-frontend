import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { CreateProjectGQL, CreateProjectInput, GetAllProjectsGQL, Project, ProjectFilter } from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStoreService {

  constructor(private authService: AuthenticationService, private getAllQuery: GetAllProjectsGQL, private createProject: CreateProjectGQL) {
  }

  create(name: string) {
    const input: CreateProjectInput = {
      name,
      owner: this.authService.currentUserValue.id
    };
    return this.createProject.mutate({input});
  }

    /*
    this.apollo.mutate({
      mutation: this.CREATE
    }).subscribe(({ data }) => {
      console.log('got data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
    */

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
  delete(projectId: string) {

  }
  */

}
