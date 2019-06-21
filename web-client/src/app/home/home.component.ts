import { Component, OnInit } from '@angular/core';
import {AuthoritiesService} from "../_services";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private authoritiesService: AuthoritiesService
  ) {
  }

  ngOnInit() {
  }

  isAdmin() {
    return this.authoritiesService.isAdmin();
  }

  isStudent() {
    return this.authoritiesService.isStudent();
  }

  isLecturer() {
    return this.authoritiesService.isLecturer();
  }

}
