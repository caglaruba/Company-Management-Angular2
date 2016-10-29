"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
require("rxjs/add/operator/map");
const index_1 = require("./index");
let UserService = class UserService {
    constructor(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
    }
    getUsers() {
        // add authorization header with token
        let headers = new http_1.Headers({ 'Authorization': 'FirmQ ' + this.authenticationService.token });
        let options = new http_1.RequestOptions({ headers: headers });
        // get users from api
        return this.http.get('/api/users', options)
            .map((response) => response.json());
    }
    getCompanyUser(userId) {
        // add authorization header with token
        let headers = new http_1.Headers({ 'Authorization': 'FirmQ ' + this.authenticationService.token });
        let options = new http_1.RequestOptions({ headers: headers });
        // get users from api
        return this.http.post('/api/user', JSON.stringify({ id: userId }), options)
            .map((response) => response.json());
    }
    sendSmsRequest(auth) {
        // add authorization header with token
        let headers = new http_1.Headers({ 'Authorization': 'FirmQ ' + this.authenticationService.token });
        let options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/request_sms_code', JSON.stringify(auth), options)
            .map((response) => {
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
    sendSmsCode(auth) {
        // add authorization header with token
        let headers = new http_1.Headers({ 'Authorization': 'FirmQ ' + this.authenticationService.token });
        let options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/send_sms_code', JSON.stringify(auth), options)
            .map((response) => {
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
    setCompanyUserProfile(user) {
        // add authorization header with token
        let headers = new http_1.Headers({ 'Authorization': 'FirmQ ' + this.authenticationService.token });
        let options = new http_1.RequestOptions({ headers: headers });
        return this.http.post('/api/company_user_profile', JSON.stringify(user), options)
            .map((response) => {
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
};
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        index_1.AuthenticationService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map