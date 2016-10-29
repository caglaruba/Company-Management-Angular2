import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

import {AuthService} from "../services/index";
import {UserService} from "../services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationsService} from "angular2-notifications";

@Component({
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading: boolean = false;
  error: string = '';
  smsCodeError: string = '';
  waitingSMSCode: boolean = false;

  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private modalService: NgbModal,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    // reset login status
    this.authService.logout();
  }

  login(content: string, c: any) {
    this.loading = true;

    this.userService.login(this.model.emailaddress, this.model.password, this.model.smsCode)
      .subscribe(result => {
          if (result.meta.status_code == 428) {
            this.waitingSMSCode = true;

            this.modalService.open(content).result.then((result) => {
              console.log(`Closed with: ${ result }`);
            }, (reason) => {
              location.reload();
            });
          } else {
            this.waitingSMSCode = false;
            this.loading = false;
            c('ok');
            this.authService.setToken(result.token);
            this.router.navigate(['/']);
          }
        },
        error => {
          if (this.waitingSMSCode) {
            this.smsCodeError = 'SMS code is incorrect';
          } else {
            this.error = 'Email Address or password is incorrect';
            this.loading = false;
          }
        }
      );
  }
}
