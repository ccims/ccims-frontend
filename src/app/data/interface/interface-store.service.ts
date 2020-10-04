import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';
import { CreateComponentInterfaceGQL, CreateComponentInterfaceInput } from '../../../generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class InterfaceStoreService {

  constructor(private authService: AuthenticationService, private createInterfaceMutation: CreateComponentInterfaceGQL) { }

  public create(name: string, offeringComponentId: string, description?: string) {
    const input: CreateComponentInterfaceInput  = {
      name,
      description,
      component: "5d3d476dd0b1f004"
    };

    return this.createInterfaceMutation.mutate({input});
  }

}
