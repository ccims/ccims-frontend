import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/auth/authentication.service';
import { Component, ComponentInterface, GetComponentGQL, GetComponentQuery, Ims, Issue, Maybe, User} from 'src/generated/graphql';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComponentStoreService {

  constructor(private authService: AuthenticationService, private getFullComponentQuery: GetComponentGQL) { }

  getFullComponent(id: string): Observable<Pick<Component, 'id' | 'name' | 'description'>
  & { owner?: Maybe<Pick<User, 'displayName' | 'username' | 'id'>>, ims?: Maybe<Pick<Ims,
   'imsType'>>, issues?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<Issue,
     'title' | 'isOpen' | 'category'>>>> }>, interfaces?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<ComponentInterface,
       'name'>>>> }>, consumedInterfaces?: Maybe<{ nodes?: Maybe<Array<Maybe<Pick<ComponentInterface, 'name'>>>> }> }>
{
    return this.getFullComponentQuery.fetch({id}).pipe(
      map(({ data}) => data.node)
    );
  }
}
