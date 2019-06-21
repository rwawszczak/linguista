import {Role} from "./role";

export class User {
  email: string;
  temporaryPassword: string;
  temporary: boolean;
  roles: Role[];
}
