import { NgModule }    from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormBuilder, FormsModule, ReactiveFormsModule}  from '@angular/forms';
import {Http, HttpModule, RequestOptions} from '@angular/http';

// used to create fake backend
import { BaseRequestOptions } from '@angular/http';
import {NgbDatepickerConfig, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent }  from './app.component';
import {AppRoutingModule}    from './app-routing.module';

import { AuthService, UserService, CompanyService } from './services/index';
import { LoginComponent } from './login/index';
import { HomeComponent } from './home/index';
import { CompanyUserComponent } from './profile/index';
import { CompanyDetailComponent } from './company-detail/index';
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {AuthGuard} from "./guards/auth.guard";
import {UserComponent} from "./user/user.component";
import {AdminGuard} from "./guards/admin.guard";
import {ApiHttpService} from "./services/http.service";
import {CompanyComponent} from "./company/company.component";
import {ConfirmEmailComponent} from "./confirm-email/confirm-email.component";
import {NotificationsService, SimpleNotificationsModule} from "angular2-notifications";
import {CompanySelectorComponent} from "./company-selector/company-selector.component";
import {SelectModule} from "ng2-select";
import {AddressComponent} from "./address/address.component";
import {EntityComponent} from "./entity/entity.component";
import {EntityService} from "./services/entity.service";
import {EntityHistoryComponent} from "./entity-history/entity-history.component";
import {MomentModule} from "angular2-moment";
import {EntitySelectorComponent} from "./entity-selector/entity-selector.component";

export function apiHttpServiceFactory(http: Http, auth: AuthService) {
  return new ApiHttpService(auth, new AuthConfig({tokenName: "token" }), http);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    SimpleNotificationsModule,
    NgbModule.forRoot(),
    SelectModule,
    MomentModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AddressComponent,
    CompanyComponent,
    EntityComponent,
    EntityHistoryComponent,
    EntitySelectorComponent,
    CompanyUserComponent,
    CompanyDetailComponent,
    CompanySelectorComponent,
    UserComponent,
    ConfirmEmailComponent,
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    AuthService,
    UserService,
    CompanyService,
    EntityService,
    NotificationsService,
    NgbDatepickerConfig,
    {
      provide: ApiHttpService,
      useFactory: apiHttpServiceFactory,
      deps: [Http, AuthService]
    },
    BaseRequestOptions,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
