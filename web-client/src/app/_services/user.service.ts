import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Login} from '../_models';
import {Create} from "../_models/create";

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

}
