import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../auth/authentication.service';

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

  submitForm(): void {
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });
    this.isLoading = true;
    this.authService.login(this.validateForm.controls.userName.value, this.validateForm.controls.password.value).pipe(
      first(),
      )
      .subscribe(
        data => {
          this.isLoading = false;
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.isLoading = false;
          this.invalidCredentials = true;
        });
  }
  constructor(private route: ActivatedRoute, private router: Router,
              private authService: AuthenticationService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

}
