import {Component, OnInit} from "@angular/core";
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

@Component({
  templateUrl: 'company.component.html'
})
export class CompanyComponent implements OnInit {
  companyForm: FormGroup;
  loading: boolean = false;
  companies: Company[];
  selectedCompany: Company;

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
        this.companies = resp;
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
        this.companyForm.setValue(company);
      },
      err => {
        console.log(err.message);
      }
    );
  }


  onRemove(): void {
    this.companyService.deleteCompany(this.selectedCompany.id).subscribe(
      resp => {
        delete(this.selectedCompany);
        this.router.navigate(['companies']);
      },
      err => {
        console.log(err.message);
      }
    );
  }

  /*
  createUser(event): void {
    event.preventDefault();
    this.userService.createUser(JSON.stringify(this.userForm.value)).subscribe(
      resp => {
        this.router.navigate(['users']);
      },
      err => {
        console.log(err.message);
      }
    );
  }*/
}
