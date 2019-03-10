import {Component, OnInit} from '@angular/core';
import {RolesService, UserService} from "../_services";
import {first} from 'rxjs/operators';
import {FormControl, Validators} from "@angular/forms";
import {Create} from "../_models/create";
import {MatSnackBar} from "@angular/material";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  roles: Object[];
  error = '';
  displayNames = {
    ROLE_STUDENT: "Uczeń",
    ROLE_LECTURER: "Lektor"
  };
  emailFormControl: FormControl = new FormControl('', [
    Validators.required,
  ]);
  roleFormControl: FormControl = new FormControl('', [
    Validators.required,
  ]);

  constructor(
    private rolesService: RolesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.rolesService.getRoles().pipe(first()).subscribe(roles => {
      this.roles = roles;
    });
  }

  getRoleDisplayName(role: string) {
    let displayName = this.displayNames[role];
    return displayName ? displayName : role;
  }

  createUser() {
    if (this.isFormInvalid()) {
      return;
    }
    let create = new Create();
    create.email = this.emailFormControl.value;
    create.roleId = this.roleFormControl.value;
    this.userService.create(create)
      .pipe(first())
      .subscribe(
        () => {
          this.snackBar.dismiss();
          this.router.navigate(['']);
        },
        error => {
          this.error = error;
          this.snackBar.open('Email lub typ użytkownika jest niepoprawny.', null, {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        });
  }

  isFormInvalid() {
    return this.emailFormControl.invalid || this.roleFormControl.invalid;
  }

}
