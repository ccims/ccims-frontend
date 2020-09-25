import { Component, Input } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable, Observer } from 'rxjs';
import { environment } from '@environments/environment';
import { InMemoryCache } from '@apollo/client/core';
import { RegisterUserGQL } from 'src/generated/graphql';
import { RegisterUserInput } from 'src/generated/public-graphql';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',

  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  validateForm: FormGroup;
  isLoading = false;
  graphqlClientName = environment.registerClientName;

  constructor(private fb: FormBuilder, private apollo: Apollo, private registerUserMutation: RegisterUserGQL) {
    apollo.createNamed(this.graphqlClientName, {uri: environment.signUpUrl, cache: new InMemoryCache()});
    this.registerUserMutation.client = this.graphqlClientName;
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required], [this.userNameAsyncValidator]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],
    });
  }

  submitForm(value: { username: string; email: string; password: string; confirm: string}): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    const input: RegisterUserInput = {
      username: value.username,
      displayName: value.username,
      password: value.password,
      email: value.email
    };

    this.registerUserMutation.mutate().subscribe(({ data }) => {
      console.log('got data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });

  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    })

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }


}
