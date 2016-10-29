import { Component, OnInit } from '@angular/core';
import { Company } from '../models/index';
import { CompanyService, AuthService } from '../services/index';

@Component({
  templateUrl: 'detail.component.html'
})

export class CompanyDetailComponent implements OnInit {

  company: any = {};
  loading: boolean = false;
  error: string = '';

  constructor(
    private companyService: CompanyService,
    private authenticationService: AuthService) {
 }

  ngOnInit() {
    // reset login status
   let companyId: string = this.authenticationService.getCurrentUserCompanyId();

   this.loading = true;
   this.companyService.getCompanyDetail(companyId)
      .subscribe( company => {

        this.loading = false;
        if (company) {
          this.company = company;
          return;
        }
        this.error = 'There is no company detail.';
      });
  }

  get userCompany(): Company {
    return this.company;
  }
}
