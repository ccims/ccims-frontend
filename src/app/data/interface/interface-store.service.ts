import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { CreateComponentInterfaceGQL, CreateComponentInterfaceInput, GetInterfaceGQL, GetInterfaceQuery } from '../../../generated/graphql';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterfaceStoreService {

  constructor(private authService: AuthenticationService, private createInterfaceMutation: CreateComponentInterfaceGQL,
              private getInterfaceQuery: GetInterfaceGQL) { }

  public create(name: string, offeringComponentId: string, description?: string) {
    const input: CreateComponentInterfaceInput  = {
      name,
      description,
      component: offeringComponentId
    };

    return this.createInterfaceMutation.mutate({input});
  }
  public getInterface(id: string): Observable<GetInterfaceQuery>{
    return this.getInterfaceQuery.fetch({ id }).pipe(
      map(({ data }) => data)
    );

  }
}
