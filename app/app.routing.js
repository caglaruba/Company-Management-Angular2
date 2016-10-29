"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@angular/router");
const index_1 = require("./login/index");
const index_2 = require("./home/index");
const index_3 = require("./profile/index");
const index_4 = require("./company/index");
const index_5 = require("./guards/index");
const appRoutes = [
    { path: 'login', component: index_1.LoginComponent },
    { path: 'profile', component: index_3.CompanyUserComponent },
    { path: 'comapny-detail', component: index_4.CompanyDetailComponent },
    { path: '', component: index_2.HomeComponent, canActivate: [index_5.AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map