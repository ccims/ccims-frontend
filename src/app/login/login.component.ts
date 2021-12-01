import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../auth/authentication.service';
import {HttpErrorResponse} from '@angular/common/http';

/**
 * This component is responsible for the login screen. It gather username and password
 * and tries to login the user via the AuthenticationService.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  returnUrl: string;
  isLoading = false;
  invalidCredentials = false;
  unknownError = false;

  /**
   * Gather username and password from form and try login via AuthenticationService.
   * If successfull redirect to root url or to the redirectUrl the user originally wanted to access.
   * If login fails, set this.invalidCredentials so that gui shows error.
   */
  submitForm(): void {
    Object.keys(this.validateForm.controls).forEach((controlKey) => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });
    this.isLoading = true;
    this.authService
      .login(this.validateForm.controls.userName.value, this.validateForm.controls.password.value)
      .pipe(first())
      .subscribe(
        () => {
          this.validateForm.controls.password.reset();
          this.isLoading = false;
          this.router.navigate([this.returnUrl]);
        },
        (error: HttpErrorResponse) => {
          this.validateForm.controls.password.reset();
          this.isLoading = false;
          this.invalidCredentials = error.status === 401;
          this.unknownError = error.status === 0;
        }
      );
  }

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthenticationService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }
}
