import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Login} from '../_models';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {
  }

  getRoles() {
    return this.http.get<any>(this.apiUrl + `/roles/getAvailable`)
      .pipe(map(roles => {
        return roles;
      }));
  }

}
