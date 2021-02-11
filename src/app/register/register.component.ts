import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable, Observer } from 'rxjs';
import { environment } from '@environments/environment';
import { CheckUsernameGQL, RegisterUserGQL, RegisterUserInput } from 'src/generated/public-graphql';
import { Router } from '@angular/router';

/**
 * Allows a user to register for an account with Gropius
 */
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

  /**
   * Given data needed for account creation, carries out creation by issuing a mutation
   * to the backend. If successfull the user is redirected to /login
   * @param value data from register form
   */
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

  /**
   * Resets form fields and marks all controls as pristine
   * @param e event effecting form reset
   */
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key of Object.keys(this.validateForm.controls)) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  /**
   * Recalculate value and validation status of password confirmation field.
   * This is triggered whenever the user changes the password in the register form.
   */
  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  /**
   * Checks with backend to make sure username entered is valid.
   * A username is invalid when its taken or contains ssymbols like '*'
   * @param control whoose value is to be a valid username.
   * @returns observable emitting values indicating error when string entered in
   * control is not a valid username. Emits null when username is valid
   */
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

  /**
   * Checks that password in "Confirm Password" field matches password in other
   * password field.
   * @param control whooses value is to match the other password form fields value
   */
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }


}
