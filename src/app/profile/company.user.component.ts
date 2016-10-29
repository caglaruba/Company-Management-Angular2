import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthSmsCode} from "../models/index";
import {AuthService, UserService} from "../services/index";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {matchingPasswords} from "../validators";

@Component({
  templateUrl: 'company.user.component.html'
})

export class CompanyUserComponent implements OnInit {
  userForm: FormGroup;
  user: any = {};
  smsCodeError: string = "";
  waitingSMSCode: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(private router: Router,
              private userService: UserService,
              private authenticationService: AuthService,
              private fb: FormBuilder,
              private modalService: NgbModal) {
    this.userForm = this.fb.group({
        name: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required])],
        confirmpassword: ['', []],
        newpassword: ['', []],
        phone: ['', Validators.required],
      },
      {validator: matchingPasswords('newpassword', 'confirmpassword')}
    );
  }

  ngOnInit() {
    // reset login status
    let currentUserId: string = this.authenticationService.getCurrentUserId();


    this.userService.getUser(currentUserId)
      .subscribe(user => {
        this.user = user;
      });
  }

  onConfirm(event, content: string, c) {
    event.preventDefault();

    if(this.user.newpassword != "") {
      this.user.password = this.user.newpassword;
    }

    this.userService.updateUser(this.user).subscribe(
      result => {
        if (typeof result.meta != "undefined" && result.meta.status_code == 428) {
          this.waitingSMSCode = true;

          this.modalService.open(content).result.then((result) => {
            console.log(`Closed with: ${ result }`);
          }, (reason) => {
            location.reload();
          });
        } else {
          if (this.waitingSMSCode == true) {
            this.waitingSMSCode = false;
            // this.loading = false;
            c('ok');
          }

          this.user = result;
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


  sendAuthCodeRequest(content: any) {

    if (this.user.password != this.user.confirmPassword)
      return false;

    let authCode: AuthSmsCode = new AuthSmsCode();
    authCode.userId = this.user.id;
    authCode.phoneNumber = this.user.phoneNumber;
    authCode.smsCode = '';

    this.userService.sendSmsRequest(authCode)
      .subscribe(result => {
        if (result === true) {
          console.log('sms request has been sent successfully!');
        } else {
          console.log('sms request is failed.');
        }
      });

    this.openModal(content);
  }

  sendSms(smsCode: string, c: any) {

    console.log(`SMS code : ${ smsCode }`);
    c('ok');

    let authCode: AuthSmsCode = new AuthSmsCode();
    authCode.userId = this.user.id;
    authCode.phoneNumber = this.user.phoneNumber;
    authCode.smsCode = smsCode;

    this.userService.sendSmsCode(authCode)
      .subscribe(result => {
        if (result === true) {
          // this.saveUserProfile();
        } else {
          console.log('sms auth is failed.');
          this.error = 'sms code is invalid.';
        }
      });
  }

  openModal(content: any) {
    console.log('show verification dialog');

    this.modalService.open(content).result.then((result) => {

      console.log(`Closed with: ${ result }`);
    }, (reason) => {
      this.router.navigate(['/']);
      console.log(`Dismissed ${ reason }`);
    });
  }

  save() {
    console.log(this.user)

    // let saveUser: CompanyUser = new CompanyUser();
    // saveUser.id = this.user.id;
    // saveUser.companyId = this.user.companyId;
    // saveUser.name = this.user.name;
    // saveUser.password = this.user.password;
    // saveUser.emailAddress = this.user.emailaddress;
    // saveUser.phoneNumber = this.user.phoneNumber;
    // saveUser.isEnabled = this.user.isEnabled;
    //
    // this.loading = true;
    // this.userService.setCompanyUserProfile(saveUser)
    //   .subscribe(result => {
    //     if (result === true) {
    //       this.router.navigate(['/']);
    //     } else {
    //       this.error = 'Profile can be saved.';
    //       this.loading = false;
    //     }
    //   });
  }
}
