import {Injectable, Injector} from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { AuthService } from './index';
import { Company } from '../models/index';
import {ApiHttpService} from "./http.service";
import {BaseService} from "./base.service";

@Injectable()
export class CompanyService extends BaseService{
  constructor(
    protected  injector: Injector,
    private http: Http,
    private api: ApiHttpService,) {
    super(injector)
  }

  getCompanies(): Observable<any> {
    return this.api.get(this.url('v1/company'));
  }

  getCompany(id: string): Observable<any> {
    return this.api.get(this.url('v1/company/' + id));
  }

  updateCompany(company: Company): Observable<any> {
    return this.api.post(this.url('v1/company/' + company.id), JSON.stringify(company));
  }

  deleteCompany(id: string): Observable<any> {
    return this.api.delete(this.url('v1/company/' + id));
  }

  createCompany(company: Company): Observable<any> {
    return this.api.post(this.url('v1/company'), JSON.stringify(company));
  }

  getCompanyDetail(companyId: string): Observable<any> {
    return Observable.throw("123");
    // get users from api
    // return this.http.post('/api/company', JSON.stringify({ id: companyId }), options)
    //   .map((response: Response) => response.json());
  }
}
