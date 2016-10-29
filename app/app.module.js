"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const forms_1 = require("@angular/forms");
const http_1 = require("@angular/http");
// used to create fake backend
const index_1 = require("./helpers/index");
const testing_1 = require("@angular/http/testing");
const http_2 = require("@angular/http");
const ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
const app_component_1 = require("./app.component");
const app_routing_1 = require("./app.routing");
const index_2 = require("./guards/index");
const index_3 = require("./services/index");
const index_4 = require("./login/index");
const index_5 = require("./home/index");
const index_6 = require("./profile/index");
const index_7 = require("./company/index");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            ng_bootstrap_1.NgbModule.forRoot(),
            app_routing_1.routing
        ],
        declarations: [
            app_component_1.AppComponent,
            index_4.LoginComponent,
            index_5.HomeComponent,
            index_6.CompanyUserComponent,
            index_7.CompanyDetailComponent,
        ],
        providers: [
            index_2.AuthGuard,
            index_3.AuthenticationService,
            index_3.UserService,
            index_3.CompanyService,
            // providers used to create fake backend
            index_1.fakeBackendProvider,
            testing_1.MockBackend,
            http_2.BaseRequestOptions,
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map