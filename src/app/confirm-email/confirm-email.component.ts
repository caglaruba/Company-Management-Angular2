import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {AuthService} from "../services/index";
import {UserService} from "../services/user.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../models/user";
import {matchingPasswords} from "../validators";

@Component({
  templateUrl: 'confirm-email.component.html'
})

export class ConfirmEmailComponent implements OnInit {
  userForm: FormGroup;
  selectedUser: User;
  model: any = {};
  loading: boolean = false;
  error: string = '';
  smsCodeError: string = '';
  waitingSMSCode: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private userService: UserService,
              private modalService: NgbModal,
              private fb: FormBuilder) {
    this.userForm = this.fb.group({
        confirmpassword: ['', Validators.compose([Validators.required])],
        newpassword: ['', Validators.compose([Validators.required])],
        phone: ['', Validators.required],
      },
      {validator: matchingPasswords('newpassword', 'confirmpassword')}
    );

  }

  ngOnInit() {
    this.selectedUser = new User;
  }

  onConfirm(event, content: string, c) {
    event.preventDefault();

    let smsCode = this.model.smsCode;
    let emailCode = this.route.snapshot.params["code"];

    this.userService.confirmEmail(this.userForm.value.phone, this.userForm.value.newpassword, smsCode, emailCode).subscribe(
      result => {
        if (typeof result.meta != "undefined" && result.meta.status_code == 428) {
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
          this.router.navigate(['/login']);
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
