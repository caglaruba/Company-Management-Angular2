import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/pluck";
import "rxjs/add/operator/filter";
import {AuthService} from "../services/auth.service";
import {CompanyService} from "../services/company.service";
import {Company} from "../models/company";

@Component({
  selector: 'company-selector',
  templateUrl: 'company-selector.component.html',
  styleUrls: ['company-selector.component.css'],
})
export class CompanySelectorComponent implements OnInit {
  @Input() selectedCompany: any;
  @Output() valueUpdated = new EventEmitter();

  active: any;
  loading: boolean = false;
  items: Company[];
  error: string = '';

  constructor(private companyService: CompanyService,
              private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // this.loading = true;
    this.loadCompanies();
  }

  getSelectedCompany() {

    if (typeof this.items != "undefined" && typeof this.selectedCompany.company_id != "undefined") {
      let active = this.items.findIndex(item => {
        if(item.id == this.selectedCompany.company_id) {
          return true;
        }

        return false;
      });

      return [this.items[active]];
    }
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe(
      resp => {
        if (typeof resp[Symbol.iterator] === 'function') {
          this.items = resp.map(item => {
            return {
              "id": item.id,
              "text": item.name,
            };
          });
        } else {
          this.items = [];
        }
      },
      err => {
        console.log(err.message);
      }
    );
  }

  private value: any = {};
  private _disabledV: string = '0';
  private disabled: boolean = false;

  private get disabledV(): string {
    return this._disabledV;
  }

  private set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value: any): void {
  }

  public removed(value: any): void {
  }

  public typed(value: any): void {
  }

  public refreshValue(value: any): void {
    this.valueUpdated.emit(value);
  }
}
