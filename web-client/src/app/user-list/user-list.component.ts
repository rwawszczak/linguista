import {Component, OnInit, ViewChild} from '@angular/core';
import {first} from "rxjs/operators";
import {UserService} from "../_services";
import {User} from "../_models/user";
import {RoleNameTranslator} from "../_util/roleNameTranslator";
import {Role} from "../_models/role";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['email', 'roles', 'stateText', 'tempPassword'];
  dataSource: MatTableDataSource<any>;


  constructor(
    private userService: UserService
  ) {
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      let displayUsers = users.map(function (user: User) {
        let roles = UserListComponent.getRoles(user.roles);
        let stateText = user.temporary ? 'Utworzony' : 'Aktywny';
        return {
          email: user.email,
          roles: roles,
          stateText: stateText,
          tempPassword: user.temporary ? user.temporaryPassword : '--'
        }
      });
      this.dataSource = new MatTableDataSource(displayUsers);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  static getRoles(roles: Role[]) {
    let translator = RoleNameTranslator.getInstance();
    let names = roles.map(function (role) {
      return translator.translate(role);
    });
    return names.join(', ');
  }

}
