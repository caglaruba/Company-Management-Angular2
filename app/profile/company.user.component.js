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
const router_1 = require("@angular/router");
const index_1 = require("../models/index");
const index_2 = require("../services/index");
const ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
let CompanyUserComponent = class CompanyUserComponent {
    constructor(router, userService, authenticationService, modalService) {
        this.router = router;
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.modalService = modalService;
        this.user = {};
        this.loading = false;
        this.error = '';
    }
    ngOnInit() {
        // reset login status
        let currentUserId = this.authenticationService.getCurrentUserId();
        this.userService.getCompanyUser(currentUserId)
            .subscribe(user => {
            this.user = user;
            this.user.confirmPassword = user.password;
        });
    }
    sendAuthCodeRequest(content) {
        if (this.user.password != this.user.confirmPassword)
            return false;
        let authCode = new index_1.AuthSmsCode();
        authCode.userId = this.user.id;
        authCode.phoneNumber = this.user.phoneNumber;
        authCode.smsCode = '';
        this.userService.sendSmsRequest(authCode)
            .subscribe(result => {
            if (result === true) {
                console.log('sms request has been sent successfully!');
            }
            else {
                console.log('sms request is failed.');
            }
        });
        this.openModal(content);
    }
    sendSms(smsCode, c) {
        console.log(`SMS code : ${smsCode}`);
        c('ok');
        let authCode = new index_1.AuthSmsCode();
        authCode.userId = this.user.id;
        authCode.phoneNumber = this.user.phoneNumber;
        authCode.smsCode = smsCode;
        this.userService.sendSmsCode(authCode)
            .subscribe(result => {
            if (result === true) {
                this.saveUserProfile();
            }
            else {
                console.log('sms auth is failed.');
                this.error = 'sms code is invalid.';
            }
        });
    }
    openModal(content) {
        console.log('show verification dialog');
        this.modalService.open(content).result.then((result) => {
            console.log(`Closed with: ${result}`);
        }, (reason) => {
            this.router.navigate(['/']);
            console.log(`Dismissed ${reason}`);
        });
    }
    saveUserProfile() {
        let saveUser = new index_1.CompanyUser();
        saveUser.id = this.user.id;
        saveUser.companyId = this.user.companyId;
        saveUser.name = this.user.name;
        saveUser.password = this.user.password;
        saveUser.emailAddress = this.user.emailAddress;
        saveUser.phoneNumber = this.user.phoneNumber;
        saveUser.isEnabled = this.user.isEnabled;
        this.loading = true;
        this.userService.setCompanyUserProfile(saveUser)
            .subscribe(result => {
            if (result === true) {
                this.router.navigate(['/']);
            }
            else {
                this.error = 'Profile can be saved.';
                this.loading = false;
            }
        });
    }
};
CompanyUserComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'company.user.component.html'
    }),
    __metadata("design:paramtypes", [router_1.Router,
        index_2.UserService,
        index_2.AuthenticationService,
        ng_bootstrap_1.NgbModal])
], CompanyUserComponent);
exports.CompanyUserComponent = CompanyUserComponent;
//# sourceMappingURL=company.user.component.js.map