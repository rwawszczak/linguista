import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, ValidatorFn, Validators} from "@angular/forms";
import {AuthenticationService} from "../_services";
import {MatSnackBar} from "@angular/material";
import {PassChange} from "../_models/passChange";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  error = '';

  oldPasswordFormControl: FormControl = new FormControl('', [
    Validators.required,
  ]);

  newPasswordFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(20),
  ]);
  passwordConfirmFormControl: FormControl = new FormControl('', [
    Validators.required,
    this.matchingPasswordValidator()
  ]);

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
  }

  changePassword(): void {
    if (this.isFormInvalid()) {
      return;
    }
    let passChange = new PassChange();
    passChange.oldPassword = this.oldPasswordFormControl.value;
    passChange.newPassword = this.newPasswordFormControl.value;
    this.authenticationService.changePassword(passChange)
      .subscribe(
        () => {
          this.authenticationService.logout();
          this.router.navigate(['login']);
          this.snackBar.open("Hasło zostało zmienione.", null, {
            duration: 5000,
            panelClass: ['info-snackbar']
          });
        },
        error => {
          this.cleanFields();
          this.error = error;
          this.snackBar.open("Stare hasło jest niepoprawne.", null, {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        });

  }

  private cleanFields() {
    this.oldPasswordFormControl.reset();
    this.newPasswordFormControl.reset();
    this.passwordConfirmFormControl.reset();
  }

  matchingPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const notMatchingPassword = control.value !== this.newPasswordFormControl.value;
      return notMatchingPassword ? {'notMatchingPassword': {value: control.value}} : null;
    };
  }

  isFormInvalid() {
    return this.newPasswordFormControl.invalid || this.passwordConfirmFormControl.invalid;
  }

}
