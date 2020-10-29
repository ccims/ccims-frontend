import { CreateLabelGQL, CreateLabelInput } from "src/generated/graphql";

import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LabelStoreService {

  constructor(private authService: AuthenticationService, private CreateLabelMutation: CreateLabelGQL ) {}

  public CreateLabel(input: CreateLabelInput){
    console.log("MUTAAAAAAAAATION");

    return this.CreateLabelMutation.mutate({input});
  }

}
