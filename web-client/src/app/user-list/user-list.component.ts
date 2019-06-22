import {Component, OnInit, ViewChild} from '@angular/core';
import {first} from "rxjs/operators";
import {UserService} from "../_services";
import {User} from "../_models/user";
import {RoleUtil} from "../_util/roleUtil";
import {Role} from "../_models/role";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['icon', 'email', 'roles', 'created', 'stateText', 'tempPassword'];
  dataSource: MatTableDataSource<any>;


  constructor(
    private userService: UserService
  ) {
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
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
