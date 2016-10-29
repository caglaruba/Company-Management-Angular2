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
let CompanyService = class CompanyService {
    constructor(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
    }
    getCompanyDetail(companyId) {
        // add authorization header with token
        let headers = new http_1.Headers({ 'Authorization': 'FirmQ ' + this.authenticationService.token });
        let options = new http_1.RequestOptions({ headers: headers });
        // get users from api
        return this.http.post('/api/company', JSON.stringify({ id: companyId }), options)
            .map((response) => response.json());
    }
};
CompanyService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        index_1.AuthenticationService])
], CompanyService);
exports.CompanyService = CompanyService;
//# sourceMappingURL=company.service.js.map