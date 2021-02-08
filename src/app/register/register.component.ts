import { Component } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable, Observer } from 'rxjs';
import { environment } from '@environments/environment';
import { CheckUsernameGQL, RegisterUserGQL, RegisterUserInput } from 'src/generated/public-graphql';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',

  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  validateForm: FormGroup;
  isLoading = false;
  publicClientName = environment.publicClientName;

  constructor(private fb: FormBuilder, private apollo: Apollo, private router: Router,
              private registerUserMutation: RegisterUserGQL, private userAvailablyQuery: CheckUsernameGQL) {
    this.registerUserMutation.client = this.publicClientName;
    this.userAvailablyQuery.client = this.publicClientName;
    this.validateForm = this.fb.group({
      username: ['', [Validators.required], [this.userNameAsyncValidator]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],
    });
  }

  submitForm(value: { username: string; email: string; password: string; confirm: string }): void {
    for (const key of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    const input: RegisterUserInput = {
      username: value.username,
      displayName: value.username,
      password: value.password,
      email: value.email
    };

    this.registerUserMutation.mutate({ input }).subscribe(({ data }) => {
      this.router.navigate(['login']);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });

  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      this.userAvailablyQuery.fetch({ username: control.value }).subscribe(({ data }) => {
        if (!data.checkUsername) {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, (error) => {
        console.log('there was an error sending the query', error);
      });
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
