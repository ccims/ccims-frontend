import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Observable, Observer } from 'rxjs';
import { environment } from '@environments/environment';
import { CheckUsernameGQL, RegisterUserGQL, RegisterUserInput } from 'src/generated/public-graphql';
import { Router } from '@angular/router';
import { UserNotifyService } from '@app/user-notify/user-notify.service';

/**
 * Allows the user to register for a Gropius account.
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

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router,
    private registerUserMutation: RegisterUserGQL,
    private userAvailablyQuery: CheckUsernameGQL,
    private notify: UserNotifyService
  ) {
    this.registerUserMutation.client = this.publicClientName;
    this.userAvailablyQuery.client = this.publicClientName;
    this.validateForm = this.fb.group({
      username: ['', [Validators.required], [this.userNameAsyncValidator]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]]
    });
  }

  /**
   * Checks with backend to ensure that entered username is valid.
   * A username is invalid when its taken or contains symbols like '*', etc.
   * @param control - Username that is handled.
   * @returns Observable emitting values indicating error when string entered in
   * control is not a valid username. Emits null when username is valid
   */
  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      this.userAvailablyQuery.fetch({ username: control.value }).subscribe(
        ({ data }) => {
          // case: username already taken
          // => marks event as error
          if (!data.checkUsername) {
            // returns `{error: true}` to mark event as an error
            observer.next({ error: true, duplicated: true });
          } else {
            observer.next(null);
          }
          observer.complete();
        },
        (error) => {
          this.notify.notifyError('Failed to verify user name!', error);
        }
      );
    });

  /**
   * Checks that the password in the Confirm Password field
   * matches the password in the Password field.
   * @param control Password that is handled.
   */
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    // case: no password given
    if (!control.value) {
      return { error: true, required: true };
    }

    // case: password does not match
    else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  /**
   * Recalculates the value and validation status of the password confirmation field.
   * This is triggered whenever the user changes the password in the register form.
   */
  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  /**
   * Given data needed for account creation
   * and carries out the creation by issuing a mutation to the backend.
   * If successfull, the user is redirected to the Login page.
   * @param value - Data (from the register form) that is handled.
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

    this.registerUserMutation.mutate({ input }).subscribe(
      ({ data }) => {
        this.router.navigate(['login']);
      },
      (error) => {
        this.notify.notifyError('Failed to register the user!', error);
      }
    );
  }

  /**
   * Resets form fields and marks all controls as pristine.
   * @param e - Event affecting the form reset.
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
   * Loads the login page.
   * @param e - Event affecting the form reset.
   */
  backToLogin(e: MouseEvent): void {
    e.preventDefault();
    this.router.navigate(['login']);
  }
}
