import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Login} from '../_models';
import {PassChange} from "../_models/passChange";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {
  }

  login(login: Login) {
    return this.http.post<any>(this.apiUrl + `/auth/signin`, login)
      .pipe(map(userWithToken => {
        if (userWithToken && userWithToken.accessToken) {
          localStorage.setItem('currentUser', JSON.stringify(userWithToken));
        }
        return userWithToken;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
  register(user: Login) {
    return this.http.post<Login>(this.apiUrl + '/auth/signup', user);
  }
  changePassword(user: PassChange) {
    return this.http.post<PassChange>(this.apiUrl + '/auth/changePassword', user);
  }

}
