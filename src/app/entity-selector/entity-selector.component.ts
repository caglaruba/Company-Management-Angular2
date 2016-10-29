import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/pluck";
import "rxjs/add/operator/filter";
import {AuthService} from "../services/auth.service";
import {EntityService} from "../services/entity.service";
import {Entity} from "../models/entity";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'entity-selector',
  templateUrl: 'entity-selector.component.html',
  styleUrls: ['entity-selector.component.css'],
})
export class EntitySelectorComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() type: any;
  @Input() disabled: boolean;
  @Input() isAmountEnabled: boolean;

  active: any;
  loading: boolean = false;
  items: Entity[];
  error: string = '';

  constructor(private entityService: EntityService,
              private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // this.loading = true;
    this.loadEntities();
  }

  getSelectedEntity() {
    if (typeof this.items != "undefined" && typeof this.formGroup.value.entity_id != "undefined") {
      let active = this.items.findIndex(item => {
        if (item.id == this.formGroup.value.entity_id) {
          return true;
        }

        return false;
      });


      if (active == -1) {
        return [];
      }
      return [this.items[active]];
    }
  }

  loadEntities(): void {
    this.entityService.getEntities(this.type).subscribe(
      resp => {
        if (typeof resp[Symbol.iterator] === 'function') {
          this.items = resp.map(item => {
            return {
              "id": item.id,
              "text": item.common_name,
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
  // private disabled: boolean = false;

  private get disabledV(): string {
    return this._disabledV;
  }

  private set disabledV(value: string) {
    this._disabledV = value;
    // this.disabled = this._disabledV === '1';
  }

  public selected(value: any): void {
  }

  public removed(value: any): void {
  }

  public typed(value: any): void {
  }

  public refreshValue(value: any): void {
    console.log(value);

    let formValue = this.formGroup.value;
    formValue.entity_id = value.id
    console.log(formValue)

    this.formGroup.setValue(formValue);
  }
}
