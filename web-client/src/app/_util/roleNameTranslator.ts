import {Role} from "../_models/role";

export class RoleNameTranslator {
  private static translator = new RoleNameTranslator();

  private displayNames = {
    ROLE_STUDENT: "Uczeń",
    ROLE_LECTURER: "Lektor",
    ROLE_ADMIN: "Administrator"
  };

   translate(role: Role) {
    let displayName = this.displayNames[role.name];
    return displayName ? displayName : role.name;
  }

  static getInstance(){
     return RoleNameTranslator.translator;
  }

}
