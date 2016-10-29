import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {LoginComponent} from "./login/index";
import {HomeComponent} from "./home/index";
import {CompanyUserComponent} from "./profile/index";
import {CompanyDetailComponent} from "./company-detail/index";
import {AuthGuard} from "./guards/auth.guard";
import {AdminGuard} from "./guards/admin.guard";
import {UserComponent} from "./user/user.component";
import {CompanyComponent} from "./company/company.component";
import {ConfirmEmailComponent} from "./confirm-email/confirm-email.component";
import {EntityComponent} from "./entity/entity.component";
import {EntityHistoryComponent} from "./entity-history/entity-history.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'confirm-email/:code', component: ConfirmEmailComponent},
  {path: '', component: HomeComponent, canActivate: [AuthGuard],pathMatch: 'full'},
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {path: 'users', component: UserComponent},
      {path: 'user/:id', component: UserComponent},
      {path: 'companies', component: CompanyComponent},
      {path: 'company/:id', component: CompanyComponent},
    ]
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {path: 'profile', component: CompanyUserComponent},
      {path: 'company-detail', component: CompanyDetailComponent},
      {path: 'entities', component: EntityComponent},
      {path: 'entity/:id/history/:time', component: EntityHistoryComponent},
      {path: 'entity/:id/history', component: EntityHistoryComponent},
      {path: 'entity/:id', component: EntityComponent},
    ]
  },

];


@NgModule({
  // imports: [RouterModule.forRoot(routes,{enableTracing: true})],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
