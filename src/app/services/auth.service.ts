import {Injectable, Injector} from "@angular/core";
import {Http, Response} from "@angular/http";
import {JwtHelper, tokenNotExpired} from "angular2-jwt";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import {BaseService} from "./base.service";

@Injectable()
export class AuthService extends BaseService {

  public token: string;

  constructor(protected injector: Injector,
              private http: Http) {
    super(injector);

    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  getCurrentUserName(): string {
    let jwtHelper = new JwtHelper();
    let token = localStorage.getItem("token");

    return jwtHelper.decodeToken(token).name;
  }

  getCurrentUserId(): string {
    let jwtHelper = new JwtHelper();
    let token = localStorage.getItem("token");

    return jwtHelper.decodeToken(token).user_id;
  }

  getCurrentUserCompanyId(): string {
    let jwtHelper = new JwtHelper();
    let token = localStorage.getItem("token");

    return jwtHelper.decodeToken(token).company_id;
  }

  getHttp(): Http {
    return this.http
  }

  loggedIn() {
    return tokenNotExpired("token");
  }

  isCompanyUser(): boolean {
    let jwtHelper = new JwtHelper();
    let token = localStorage.getItem("token");

    if (! this.loggedIn()) {
      return false;
    }

    return jwtHelper.decodeToken(token).company_id != "";
  }

  isAdmin(): boolean {
    let jwtHelper = new JwtHelper();
    let token = localStorage.getItem("token");

    if (! this.loggedIn()) {
      return false;
    }

    return jwtHelper.decodeToken(token).admin;
  }
}
