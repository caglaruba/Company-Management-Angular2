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
let AuthenticationService = class AuthenticationService {
    constructor(http) {
        this.http = http;
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }
    login(email, password) {
        return this.http.post('/api/authenticate', JSON.stringify({ email: email, password: password }))
            .map((response) => {
            // login successful if there's a token in the response
            let responseJson = response.json();
            if (responseJson) {
                let token = responseJson.token;
                if (token) {
                    // set token property
                    this.token = token;
                    // store user info and token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(responseJson));
                    // return true to indicate successful login
                    return true;
                }
            }
            // return false to indicate failed login
            return false;
        });
    }
    logout() {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
    getCurrentUserName() {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser && currentUser.name;
    }
    getCurrentUserId() {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser && currentUser.id;
    }
    getCurrentUserComapnyId() {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser && currentUser.companyId;
    }
};
AuthenticationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map