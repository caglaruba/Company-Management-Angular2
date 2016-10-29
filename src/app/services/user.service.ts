import {Injectable, Injector} from "@angular/core";
import {Headers, Http, RequestOptions, Response} from "@angular/http";
import {Observable} from "rxjs";
import "rxjs/add/operator/map";

import {AuthService} from "./index";
import {AuthSmsCode, CompanyUser} from "../models/index";
import {BaseService} from "./base.service";
import {User} from "../models/user";
import {ApiHttpService} from "./http.service";

@Injectable()
export class UserService extends BaseService {
  constructor(protected injector: Injector,
              private http: Http,
              private api: ApiHttpService,
              private authService: AuthService,) {
    super(injector);
  }

  login(email: string, password: string, code: string): Observable<any> {
    return this.api.post(this.url('v1/login'), JSON.stringify({email: email, password: password, sms_code: code}));
  }

  confirmEmail(phone: string, password: string, smsCode: string, emailCode: string): Observable<any> {
    return this.api.post(this.url('v1/confirm-email/' + emailCode), JSON.stringify({phone: phone, password: password, sms_code: smsCode}));
  }

  getUsers(): Observable<any> {
    return this.api.get(this.url('v1/user'));
  }

  getUser(id: string): Observable<User> {
    return this.api.get(this.url('v1/user/' + id));
  }

  deleteUser(id: string): Observable<any> {
    return this.api.delete(this.url('v1/user/' + id));
  }

  createUser(user: User): Observable<any> {
    return this.api.post(this.url('v1/user'), JSON.stringify(user));
  }
  updateUser(user: User): Observable<any> {
    return this.api.post(this.url('v1/user/' + user.id), JSON.stringify(user));
  }

  getCompanyUser(userId: string): Observable<CompanyUser> {
    // add authorization header with token
    let headers = new Headers({'Authorization': 'FirmQ ' + this.authService.token});
    let options = new RequestOptions({headers: headers});

    // get users from api
    return this.http.post('/api/user', JSON.stringify({id: userId}), options)
      .map((response: Response) => response.json());
  }

  sendSmsRequest(auth: AuthSmsCode): Observable<boolean> {

    // add authorization header with token
    let headers = new Headers({'Authorization': 'FirmQ ' + this.authService.token});
    let options = new RequestOptions({headers: headers});

    return this.http.post('/api/request_sms_code', JSON.stringify(auth), options)
      .map((response: Response) => {
        // login successful if there's a token in the response
        let responseJson = response.json();
        if (responseJson) {
          let userId = responseJson.userId;
          if (userId) {

            // return true to indicate successful login
            return true;
          }
        }
        // return false to indicate failed login
        return false;
      });
  }

  sendSmsCode(auth: AuthSmsCode): Observable<boolean> {

    // add authorization header with token
    let headers = new Headers({'Authorization': 'FirmQ ' + this.authService.token});
    let options = new RequestOptions({headers: headers});

    return this.http.post('/api/send_sms_code', JSON.stringify(auth), options)
      .map((response: Response) => {
        // login successful if there's a token in the response
        let responseJson = response.json();
        if (responseJson) {
          let userId = responseJson.userId;
          if (userId) {

            // return true to indicate successful login
            return true;
          }
        }
        // return false to indicate failed login
        return false;
      });
  }

  setCompanyUserProfile(user: CompanyUser): Observable<boolean> {

    // add authorization header with token
    let headers = new Headers({'Authorization': 'FirmQ ' + this.authService.token});
    let options = new RequestOptions({headers: headers});

    return this.authService.getHttp().post('/api/company_user_profile', JSON.stringify(user), options)
      .map((response: Response) => {
        // login successful if there's a token in the response
        let responseJson = response.json();
        if (responseJson) {
          let token = responseJson.token;
          if (token) {

            // store username and token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(responseJson));

            // return true to indicate successful login
            return true;
          }
        }
        // return false to indicate failed login
        return false;
      });
  }
}
