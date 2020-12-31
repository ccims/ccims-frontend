import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { CreateComponentInterfaceGQL, CreateComponentInterfaceInput, DeleteComponentInterfaceGQL, DeleteComponentInterfaceInput, GetInterfaceGQL, GetInterfaceQuery, UpdateComponentInterfaceGQL, UpdateComponentInterfaceInput } from '../../../generated/graphql';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterfaceStoreService {

  constructor(private authService: AuthenticationService, private createInterfaceMutation: CreateComponentInterfaceGQL,
    private updateInterfaceMutation: UpdateComponentInterfaceGQL, private deleteInterfaceMutation: DeleteComponentInterfaceGQL,
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
  public update(input:UpdateComponentInterfaceInput) {


    return this.updateInterfaceMutation.mutate({input});
  }
  public delete(id :string) {
    const input:DeleteComponentInterfaceInput={
      componentInterfaceId: id
    }
    return this.deleteInterfaceMutation.mutate({input});
  }

}
