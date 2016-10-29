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
const index_1 = require("../services/index");
let CompanyDetailComponent = class CompanyDetailComponent {
    constructor(companyService, authenticationService) {
        this.companyService = companyService;
        this.authenticationService = authenticationService;
        this.company = {};
        this.loading = false;
        this.error = '';
    }
    ngOnInit() {
        // reset login status
        let companyId = this.authenticationService.getCurrentUserComapnyId();
        this.loading = true;
        this.companyService.getCompanyDetail(companyId)
            .subscribe(company => {
            this.loading = false;
            if (company) {
                this.company = company;
                return;
            }
            this.error = 'There is no company detail.';
        });
    }
    get userCompany() {
        return this.company;
    }
};
CompanyDetailComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'detail.component.html'
    }),
    __metadata("design:paramtypes", [index_1.CompanyService,
        index_1.AuthenticationService])
], CompanyDetailComponent);
exports.CompanyDetailComponent = CompanyDetailComponent;
//# sourceMappingURL=detail.component.js.map