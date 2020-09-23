import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { Project } from './project';

@Injectable({
  providedIn: 'root'
})
export class ProjectStoreService {

  readonly CREATE = gql`
  mutation Create{
  createProject(input: {
    name: "Testes"
    owner:"5d2f0ecf5477f001"
    description:"Blah"
  }){
    project {
      id
    }
  }
}`;


  constructor(private apollo: Apollo) {
  }
  create() {
    this.apollo.mutate({
      mutation: this.CREATE
    }).subscribe(({ data }) => {
      console.log('got data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  /*
  getAll(): Project[] {
    return this.projects;
  }

  getSingle(id: number): Project {
    return this.projects.find(project => project.id === id);
  }
  delete(projectId: string) {

  }
  */

}
