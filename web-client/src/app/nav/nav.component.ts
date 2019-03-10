import {Component, OnInit} from '@angular/core';
import {AuthoritiesService} from "../_services";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(
    private authoritiesService: AuthoritiesService
  ) {
  }

  ngOnInit() {
  }

  isAdmin() {
    return this.authoritiesService.isAdmin();
  }

  isLogged() {
    return this.authoritiesService.isLogged();
  }

}
