import { Component, OnInit } from '@angular/core';

import { CompanyUser } from '../models/index';
import { UserService } from '../services/index';

@Component({
  templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
  users: CompanyUser[] = [];

  constructor(
    private userService: UserService) {
  }

  ngOnInit() {
    // this.userService.getUsers()
    //   .subscribe( users => {
    //     this.users = users;
    //   });
  }

}
