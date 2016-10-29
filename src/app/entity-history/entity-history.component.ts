import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/pluck";
import "rxjs/add/operator/filter";
import {AuthService} from "../services/auth.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Entity} from "../models/entity";
import {EntityService} from "../services/entity.service";

@Component({
  templateUrl: 'entity-history.component.html'
})
export class EntityHistoryComponent implements OnInit {
  selectedEntity: any;
  entityForm: FormGroup;
  loading: boolean = false;
  entities: Entity[];

  error: string = '';

  constructor(private entityService: EntityService,
              private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute,
              private fb: FormBuilder) {

    this.entityForm = this.fb.group({
      common_name: new FormControl({value: '', disabled: true}),
      type: new FormControl({value: '', disabled: true}),
      given_name: new FormControl({value: '', disabled: true}),
      middle_name: new FormControl({value: '', disabled: true}),
      family_name: new FormControl({value: '', disabled: true}),
      name_prefix: new FormControl({value: '', disabled: true}),
      name_suffix: new FormControl({value: '', disabled: true}),
      gender: new FormControl({value: '', disabled: true}),
      birthday: new FormControl({value: '', disabled: true}),
      birthplace: new FormControl({value: '', disabled: true}),
      birthcountry: new FormControl({value: '', disabled: true}),
      nationality: new FormControl({value: '', disabled: true}),
      residential_address: this.fb.group({
        address_line_1: new FormControl({value: '', disabled: true}),
        address_line_2: new FormControl({value: '', disabled: true}),
        city: new FormControl({value: '', disabled: true}),
        region: new FormControl({value: '', disabled: true}),
        postal_code: new FormControl({value: '', disabled: true}),
        country: new FormControl({value: '', disabled: true}),
      }),
      visiting_address: this.fb.group({
        address_line_1: new FormControl({value: '', disabled: true}),
        address_line_2: new FormControl({value: '', disabled: true}),
        city: new FormControl({value: '', disabled: true}),
        region: new FormControl({value: '', disabled: true}),
        postal_code: new FormControl({value: '', disabled: true}),
        country: new FormControl({value: '', disabled: true}),
      }),
      registered_address: this.fb.group({
        address_line_1: new FormControl({value: '', disabled: true}),
        address_line_2: new FormControl({value: '', disabled: true}),
        city: new FormControl({value: '', disabled: true}),
        region: new FormControl({value: '', disabled: true}),
        postal_code: new FormControl({value: '', disabled: true}),
        country: new FormControl({value: '', disabled: true}),
      }),
      kvk: new FormControl({value: '', disabled: true}),
      legal_form: new FormControl({value: '', disabled: true}),
      registered_name: new FormControl({value: '', disabled: true}),
      registered_office: new FormControl({value: '', disabled: true}),
      date_of_registration: new FormControl({value: '', disabled: true}),
      date_of_establishment: new FormControl({value: '', disabled: true}),
      trade_name: new FormControl({value: '', disabled: true}),
      rsin: new FormControl({value: '', disabled: true}),
      issued_capital: new FormControl({value: '', disabled: true}),
      paidup_capital: new FormControl({value: '', disabled: true}),
      is_bfi: new FormControl({value: '', disabled: true}),
      bfi_number: new FormControl({value: '', disabled: true}),
      directors: this.fb.group({
        entity_id: new FormControl({value: '', disabled: true}),
        amount: new FormControl({value: '', disabled: true}),
      }),
      proxyholders: this.fb.group({
        entity_id: new FormControl({value: '', disabled: true}),
        amount: new FormControl({value: '', disabled: true}),
      }),
      trustees: this.fb.group({
        entity_id: new FormControl({value: '', disabled: true}),
        amount: new FormControl({value: '', disabled: true}),
      }),
      shareholders: this.fb.group({
        entity_id: new FormControl({value: '', disabled: true}),
        amount: new FormControl({value: '', disabled: true}),
      }),
    });

  }

  ngOnInit() {
    this.loading = true;

    this.entities = [];

    this.loadEntitySnapshot();
  }

  onSelect(entity: Entity): void {
    if(!entity.created_at) {
      return;
    }

    let index = this.entities.findIndex(val => {
      return val.created_at == entity.created_at;
    });
    this.selectedEntity = this.entities[index];

    let entityVal = Object.assign({}, this.entities[index]);

    delete(entityVal["id"]);
    delete(entityVal["company_id"]);
    delete(entityVal["rev"]);
    delete(entityVal["latest"]);
    delete(entityVal["created_by_username"]);
    delete(entityVal["created_at"]);
    delete(entityVal["created_by"]);
    if (entityVal.type == "person") {
      if (typeof entityVal.birthday != "undefined") {
        let birthPath = entityVal.birthday.split("-");

        entityVal.birthday = {
          "year": 1 * birthPath[0],
          "month": 1 * birthPath[1],
          "day": 1 * birthPath[2]
        };
      }

    } else if (entityVal.type == "company" || entityVal.type == "target_company") {
      let dateParts = entityVal.date_of_registration.split("-");

      entityVal.date_of_registration = {
        "year": 1 * dateParts[0],
        "month": 1 * dateParts[1],
        "day": 1 * dateParts[2]
      };

      dateParts = entityVal.date_of_establishment.split("-");

      entityVal.date_of_establishment = {
        "year": 1 * dateParts[0],
        "month": 1 * dateParts[1],
        "day": 1 * dateParts[2]
      };
    }
    this.entityForm.setValue(entityVal);
  }

  loadEntitySnapshot(): void {
    let id = this.route.snapshot.params["id"];
    let time = this.route.snapshot.params["time"];

    this.entityService.getEntityRevs(id).subscribe(
      resp => {
        if (typeof resp[Symbol.iterator] === 'function') {
          this.entities = resp;
        } else {
          this.entities = [];
        }

        let entity = new Entity;
        entity.id = id;
        entity.created_at = time;

        this.onSelect(entity);
      },
      err => {
        console.log(err.message);
      }
    );
  }
}
