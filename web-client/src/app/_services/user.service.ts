import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Login} from '../_models';
import {Create} from "../_models/create";
import {User} from "../_models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {
  }

  create(user: Create) {
    return this.http.post<Login>(this.apiUrl + '/users/create', user);
  }

  getAll() {
    return this.http.get<User[]>(this.apiUrl + '/users/getAll');
  }

}
