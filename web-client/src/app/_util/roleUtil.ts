import {Role} from "../_models/role";

export class RoleUtil {
  private static translator = new RoleUtil();

  private roleData = {
    ROLE_ADMIN: {priority: 1, name: "Administrator", icon: "account_circle"},
    ROLE_LECTURER: {priority: 2, name: "Lektor", icon: "face"},
    ROLE_STUDENT: {priority: 3, name: "Uczeń", icon: "mood"}
  };

  translate(role: Role) {
    let display = this.roleData[role.name];
    return display ? display.name : role.name;
  }

  getRoleIcon(role: Role) {
    let display = this.roleData[role.name];
    return display ? display.icon : role.name;
  }

  getMostImportant(roles: Role[]){
    return roles.sort((r1,r2) => this.roleData[r1.name].priority - this.roleData[r2.name].priority)[0];
  }

  static getInstance(){
     return RoleUtil.translator;
  }

}
