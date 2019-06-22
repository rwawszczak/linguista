import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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

  resetPassword(user: User) {
    let httpParams = new HttpParams()
      .append("email", user.email);
    return this.http.post(this.apiUrl + '/users/resetPassword', null, {
      params: httpParams
    });
  }

}
