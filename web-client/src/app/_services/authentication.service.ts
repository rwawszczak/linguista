import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Login} from '../_models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userUrl = '/api';

  constructor(private http: HttpClient) {
  }

  login(login: Login) {
    return this.http.post<any>(this.userUrl + `/auth/signin`, login)
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
    return this.http.post<Login>(this.userUrl + '/auth/signup', user);
  }

}
