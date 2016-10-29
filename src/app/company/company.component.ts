import {Component, Input, OnInit} from "@angular/core";
import {User} from "../models/user";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/pluck";
import "rxjs/add/operator/filter";
import {AuthService} from "../services/auth.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {IsEqual, matchingPasswords} from "../validators";
import {CompanyService} from "../services/company.service";
import {Company} from "../models/company";
import {BehaviorSubject} from "rxjs";

@Component({
  templateUrl: 'company.component.html'
})
export class CompanyComponent implements OnInit {
  selectedCompany: Company;
  companyForm: FormGroup;
  loading: boolean = false;
  companies: Company[];

  error: string = '';

  constructor(private companyService: CompanyService,
              private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute,
              private fb: FormBuilder) {

    this.companyForm = this.fb.group({
      name: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.loading = true;

    this.loadCompanies();
    this.route.params.subscribe((params: Params) => {
      let id = params['id'];

      if (typeof id != "undefined") {
        this.loadCompany(id);
      }
    });
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe(
      resp => {
        if(typeof resp[Symbol.iterator] === 'function') {
          this.companies = resp;
        } else {
          this.companies = [];
        }
      },
      err => {
        console.log(err.message);
      }
    );
  }

  onSelect(company: Company): void {
    this.selectedCompany = company;
  }


  loadCompany(id: string): void {
    this.companyService.getCompany(id).subscribe(
      company => {
        this.selectedCompany = company;
        this.companyForm.setValue({
          name: company.name,
        });
      },
      err => {
        console.log(err.message);
      }
    );
  }

  onModify(event): void {
    event.preventDefault();

    if( typeof this.selectedCompany.id == "undefined" || this.selectedCompany.id == "") {
      this.create();
    } else {
      this.update();
    }
  }

  create(): void {
    this.companyService.createCompany(this.selectedCompany).subscribe(
      resp => {
        this.selectedCompany.id = resp.id;
        this.companies.push(this.selectedCompany);
      },
      err => {
        console.error(err);
      }
    );
  }
  update(): void {
    this.companyService.updateCompany(this.selectedCompany).subscribe(
      resp => {
        let index = this.companies.findIndex(user => { return user.id === this.selectedCompany.id});
        if(index != -1 ){
          this.companies[index] = this.selectedCompany;
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  onRemove(): void {
    this.companyService.deleteCompany(this.selectedCompany.id).subscribe(
      resp => {
        this.companies = this.companies.filter(item => {return item.id === this.selectedCompany.id});
        delete(this.selectedCompany);
        this.router.navigate(['companies']);
      },
      err => {
        console.log(err.message);
      }
    );
  }

  onShowCreate(event): void {
    event.preventDefault();
    this.selectedCompany = new Company;
    this.selectedCompany.name =  "New company name";
  }
}
