import {Role} from "./role";

export class User {
  name: string;
  phoneNumber: string;
  email: string;
  temporaryPassword: string;
  temporary: boolean;
  created: Date;
  roles: Role[];
}
