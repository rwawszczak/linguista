import {Component, OnInit} from '@angular/core';
import {Login} from "../_models/";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {first} from "rxjs/operators";
import {AuthenticationService} from "../_services";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  emailFormControl: FormControl = new FormControl('', [
    Validators.required,
  ]);
  passwordFormControl: FormControl = new FormControl('', [
    Validators.required,
  ]);

  loginForm: FormGroup;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  loginUser() {
    if (this.isFormInvalid()) {
      return;
    }
    let login = new Login();
    login.email = this.emailFormControl.value;
    login.password = this.passwordFormControl.value;
    this.authenticationService.login(login)
      .pipe(first())
      .subscribe(
        userWithToken => {
          this.snackBar.dismiss();
          if (!userWithToken.temporary) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.router.navigate(['changePassword']);
            this.snackBar.open('Logujesz się za pomocą hasła tymczasowego, aby w pełni aktywować konto zmień hasło.', null, {
              duration: 10000,
              panelClass: ['warn-snackbar']
            });
          }
        },
        error => {
          this.error = error;
          this.snackBar.open('Email i/lub hasło są niepoprawne.', null, {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        });
  }

  isFormInvalid() {
    return this.emailFormControl.invalid || this.passwordFormControl.invalid;
  }

}
