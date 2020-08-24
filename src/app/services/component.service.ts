import { Injectable } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  allComponentsQuery = {
    query: gql`
    query{
      viewer {
        name
         repositories(last: 10) {
           nodes {
             name
           }
         }
       }
    }
    `
  };
  constructor(private apollo: Apollo) { }

  getAllComponents() {
    return this.apollo.query(
      this.allComponentsQuery
    );
  }
}
