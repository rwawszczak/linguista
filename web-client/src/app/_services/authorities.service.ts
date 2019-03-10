import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthoritiesService {

  isAdmin() {
    return this.isLogged() ? JSON.parse(localStorage.getItem('currentUser')).authorities.includes('ROLE_ADMIN') : false;
  }

  isStudent() {
    return this.isLogged() ? JSON.parse(localStorage.getItem('currentUser')).authorities.includes('ROLE_STUDENT') : false;
  }

  isLecturer() {
    return this.isLogged() ? JSON.parse(localStorage.getItem('currentUser')).authorities.includes('ROLE_LECTURER') : false;
  }

  isLogged() {
    return !!localStorage.getItem('currentUser');
  }

}
