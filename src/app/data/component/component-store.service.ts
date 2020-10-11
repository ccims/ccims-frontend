import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/auth/authentication.service';
import { Component, ComponentInterface, GetComponentGQL, GetComponentQuery, Ims, Issue, Maybe, User } from 'src/generated/graphql';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComponentStoreService {

  constructor(private authService: AuthenticationService, private getFullComponentQuery: GetComponentGQL) { }

  getFullComponent(id: string): Observable<GetComponentQuery> {
    return this.getFullComponentQuery.fetch({ id }).pipe(
      map(({ data }) => data)
    );
  }

  deleteComponent(id: string) {
    /*
    const input: DeleteComponentInput = {
      projectId: id
    };
    return this.deleteProject.mutate({input});
    */
  }
}
