import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/pluck";
import "rxjs/add/operator/filter";
import {AuthService} from "../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Entity} from "../models/entity";
import {EntityService} from "../services/entity.service";
import {NgbDatepickerConfig} from "@ng-bootstrap/ng-bootstrap";
import {BehaviorSubject} from "rxjs";
import {NotificationsService} from "angular2-notifications";

@Component({
  templateUrl: 'entity.component.html'
})
export class EntityComponent implements OnInit {
  selectedEntityId: any;
  entityForm: FormGroup;
  loading: boolean = false;
  entities: Entity[];
  mindate: { year: 1917, month: 1, day: 1 };
  error: string = '';
  private entity$ = new BehaviorSubject(null);

  constructor(private entityService: EntityService,
              private router: Router,
              private notificationService: NotificationsService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private datePickerConfig: NgbDatepickerConfig,
              private fb: FormBuilder) {

    this.buildFormGroup();
    let curDate = new Date();
    datePickerConfig.minDate = {year: 1900, month: 1, day: 1};
    datePickerConfig.maxDate = {
      year: curDate.getFullYear(),
      month: curDate.getUTCMonth() + 1,
      day: curDate.getUTCDate()
    };
  }

  buildFormGroup() {

    this.entityForm = this.fb.group({
      // id: [''],
      // company_id: [''],
      // rev: [''],
      // latest: [''],
      // created_by: [''],
      // created_by_username: [''],
      // created_at: [''],


      common_name: ['', Validators.required],
      type: ['', Validators.required],
      given_name: [''],
      middle_name: [''],
      family_name: [''],
      name_prefix: [''],
      name_suffix: [''],
      gender: [''],
      birthday: [''],
      birthplace: [''],
      birthcountry: [''],
      nationality: [''],
      residential_address: this.fb.group({
        address_line_1: [''],
        address_line_2: [''],
        city: [''],
        region: [''],
        postal_code: [''],
        country: [''],
      }),
      visiting_address: this.fb.group({
        address_line_1: [''],
        address_line_2: [''],
        city: [''],
        region: [''],
        postal_code: [''],
        country: [''],
      }),
      registered_address: this.fb.group({
        address_line_1: [''],
        address_line_2: [''],
        city: [''],
        region: [''],
        postal_code: [''],
        country: [''],
      }),
      kvk: [''],
      legal_form: [''],
      registered_name: [''],
      registered_office: [''],
      date_of_registration: [''],
      date_of_establishment: [''],
      trade_name: [''],
      rsin: [''],
      issued_capital: [''],
      paidup_capital: [''],
      is_bfi: [''],
      bfi_number: [''],
      directors: this.fb.group({
        entity_id: [''],
        amount: [''],
      }),
      proxyholders: this.fb.group({
        entity_id: [''],
        amount: [''],
      }),
      trustees: this.fb.group({
        entity_id: [''],
        amount: [''],
      }),
      shareholders: this.fb.group({
        entity_id: [''],
        amount: [''],
      }),
    });

  }

  ngOnInit() {
    this.loading = true;

    this.entities = [];

    this.entity$
      .filter(Boolean)
      .subscribe(entity => {
        delete(entity["id"]);
        delete(entity["company_id"]);
        delete(entity["rev"]);
        delete(entity["latest"]);
        delete(entity["created_by_username"]);
        delete(entity["created_at"]);
        delete(entity["created_by"]);

        if (entity.type == "person") {
          if (typeof entity.birthday != "undefined") {
            let birthPath = entity.birthday.split("-");

            entity.birthday = {
              "year": 1 * birthPath[0],
              "month": 1 * birthPath[1],
              "day": 1 * birthPath[2]
            };
          }

        } else if (entity.type == "company" || entity.type == "target_company") {
          let dateParts = entity.date_of_registration.split("-");

          entity.date_of_registration = {
            "year": 1 * dateParts[0],
            "month": 1 * dateParts[1],
            "day": 1 * dateParts[2]
          };

          dateParts = entity.date_of_establishment.split("-");

          entity.date_of_establishment = {
            "year": 1 * dateParts[0],
            "month": 1 * dateParts[1],
            "day": 1 * dateParts[2]
          };
        }

        this.entityForm.setValue(entity);
      });


    this.loadEntities();
    this.route.params.subscribe((params: Params) => {
      let id = params['id'];

      if (typeof id != "undefined") {
        this.loadEntity(id);
      }
    });
  }

  loadEntities(): void {
    this.entityService.getEntities("").subscribe(
      resp => {
        if (typeof resp[Symbol.iterator] === 'function') {
          this.entities = resp;
        } else {
          this.entities = [];
        }
      },
      err => {
        console.log(err.message);
      }
    );
  }

  onSelect(entity: Entity): void {
    this.selectedEntityId = entity.id;
  }


  loadEntity(id: string): void {
    this.entityService.getEntity(id).subscribe(
      entity => {
        this.selectedEntityId = entity.id;
        console.log(this.selectedEntityId);
        this.entity$.next(entity);
      },
      err => {
        console.log(err.message);
      }
    );
  }

  onModify(event): void {
    event.preventDefault();
    if (this.entityForm.value.is_bfi == "") {
      this.entityForm.value.is_bfi = false;
    }

    if (this.entityForm.value.type == "person") {
      this.entityForm.value.birthday = this.entityForm.value.birthday.year + "-" + this.entityForm.value.birthday.month + "-" + this.entityForm.value.birthday.day;
    } else if (this.entityForm.value.type == "company" || this.entityForm.value.type == "target_company") {
      this.entityForm.value.date_of_registration = this.entityForm.value.date_of_registration.year + "-" + this.entityForm.value.date_of_registration.month + "-" + this.entityForm.value.date_of_registration.day;
      this.entityForm.value.date_of_establishment = this.entityForm.value.date_of_establishment.year + "-" + this.entityForm.value.date_of_establishment.month + "-" + this.entityForm.value.date_of_establishment.day;
    }

    if (typeof this.selectedEntityId == "undefined" || this.selectedEntityId == "") {
      this.create();
    } else {
      this.update();
    }
  }

  create(): void {
    this.entityService.createEntity(this.entityForm.value).subscribe(
      resp => {
        this.entities.push(resp);
        this.buildFormGroup();
        this.notificationService.success("", "Created");

      },
      err => {
        console.error(err);
      }
    );
  }

  update(): void {
    this.entityService.updateEntity(this.selectedEntityId, this.entityForm.value).subscribe(
      resp => {
        let index = this.entities.findIndex(user => {
          return user.id === this.selectedEntityId
        });

        if (index != -1) {
          this.entities[index] = resp;
        }

        this.notificationService.success("", "Saved");
      },
      err => {
        console.error(err);
      }
    );
  }

  onRemove(): void {
    this.entityService.deleteEntity(this.selectedEntityId).subscribe(
      resp => {
        this.entities = this.entities.filter(item => {
          return item.id === this.selectedEntityId
        });
        this.selectedEntityId = "";
        this.router.navigate(['companies']);
      },
      err => {
        console.log(err.message);
      }
    );
  }

  onShowCreate(event): void {
    event.preventDefault();
    this.selectedEntityId = "";
    this.buildFormGroup();
  }
}
