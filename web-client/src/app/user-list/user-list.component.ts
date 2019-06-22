import {Component, OnInit, ViewChild} from '@angular/core';
import {first} from "rxjs/operators";
import {UserService} from "../_services";
import {User} from "../_models/user";
import {RoleUtil} from "../_util/roleUtil";
import {Role} from "../_models/role";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatSnackBar, MatSort} from "@angular/material";
import {DatePipe} from "@angular/common";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {Router} from "@angular/router";
import {CopyUtil} from "../_util/copyUtil";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['icon', 'email', 'roles', 'created', 'stateText', 'tempPassword', 'copyTempPassword', 'resetPassword'];
  dataSource: MatTableDataSource<any>;


  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    let pipe = new DatePipe('pl');
    this.userService.getAll().pipe(first()).subscribe(users => {
      let displayUsers = users.map(function (user: User) {
        let stateText = user.temporary ? 'Utworzony' : 'Aktywny';
        return {
          icon: UserListComponent.getIcon(user.roles),
          email: user.email,
          roles: UserListComponent.getRoles(user.roles),
          created: pipe.transform(user.created, 'longDate'),
          stateText: stateText,
          tempPassword: user.temporary ? user.temporaryPassword : '--',
          isTemporary: user.temporary
        }
      });
      this.dataSource = new MatTableDataSource(displayUsers);
      this.dataSource.sort = this.sort;
    });
  }

  resetPassword(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Potwierdź zresetowanie hasła",
        text: "Czy napewno chcesz zresetować hasło dla użytkownika " + user.email,
        confirmColor: "warn"
      },
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(isConfirmed => {
      if (isConfirmed) {
        this.userService.resetPassword(user).pipe(first()).subscribe(
          () => {
            this.loadData();
            this.snackBar.open('Pomyślnie zresetowano hasło dla użytkownika '+user.email+'.', null, {
              duration: 5000,
              panelClass: ['info-snackbar']
            });
          },
          error => {
            console.warn(error);
            this.snackBar.open('Resetowanie hasła dla użytkownika '+user.email+' nie powiodło się.', null, {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          });
      }
    });
  }

  copyTempPasswordToClipboard(user: any){
    CopyUtil.copyToClipboard(user.tempPassword)
    this.snackBar.open('Hasło dla użytkownika '+user.email+' zostalo skopiowane do schowka.', null, {
      duration: 5000,
      panelClass: ['info-snackbar']
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  static getRoles(roles: Role[]) {
    let roleUtil = RoleUtil.getInstance();
    let names = roles.map(function (role) {
      return roleUtil.translate(role);
    });
    return names.join(', ');
  }

  static getIcon(roles: Role[]) {
    let roleUtil = RoleUtil.getInstance();
    return roleUtil.getRoleIcon(roleUtil.getMostImportant(roles));
  }

}
