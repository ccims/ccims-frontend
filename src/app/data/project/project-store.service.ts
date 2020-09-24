import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { CreateProjectGQL, GetAllProjectsGQL, Project } from 'src/generated/graphql';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectStoreService {

  constructor(private getAllQuery: GetAllProjectsGQL, private createProject: CreateProjectGQL) {
  }

  create() {
    this.createProject.mutate().subscribe(({ data}) => {
      console.log('got data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });

    /*
    this.apollo.mutate({
      mutation: this.CREATE
    }).subscribe(({ data }) => {
      console.log('got data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
    */
  }

  getAll(): Observable<Pick<Project, 'id' | 'name'>[]>{
    return this.getAllQuery.fetch().pipe(
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
