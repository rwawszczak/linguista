import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {AuthenticationService} from '../_services';
import {AbstractControl, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Login} from "../_models";

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: Login = new Login();
  error = '';
  emailFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(20),
  ]);
  passwordConfirmFormControl: FormControl = new FormControl('', [
    Validators.required,
    this.matchingPasswordValidator()
  ]);
  passwordConfirm: String;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private snackBar: MatSnackBar) {
  }


  ngOnInit() {
    this.authenticationService.logout();
  }

  registerUser(): void {
    if (this.isFormInvalid()) {
      return;
    }
    this.authenticationService.register(this.user)
      .subscribe(
        () => {
          this.snackBar.dismiss();
          this.router.navigate(['login']);
        },
        error => {
          this.error = error;
          this.snackBar.open(error, null, {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        });

  }
  matchingPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const notMatchingPassword = control.value !== this.user.password;
      return notMatchingPassword ? {'notMatchingPassword': {value: control.value}} : null;
    };
  }

  isFormInvalid() {
    return this.emailFormControl.invalid ||
      this.passwordFormControl.invalid || this.passwordConfirmFormControl.invalid;
  }

}
