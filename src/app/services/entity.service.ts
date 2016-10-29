import {Injectable, Injector} from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { AuthService } from './index';
import {ApiHttpService} from "./http.service";
import {BaseService} from "./base.service";
import {Entity} from "../models/entity";

@Injectable()
export class EntityService extends BaseService {
  constructor(protected  injector: Injector,
              private api: ApiHttpService,) {
    super(injector)
  }

  getEntities(type: any): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();

    if(!!type) {
      params.set("type", type)
    }

    return this.api.get(this.url('v1/entity'), {search: params});
  }

  getEntity(id: string): Observable<any> {
    return this.api.get(this.url('v1/entity/' + id));
  }

  getEntityRevs(id: string): Observable<any> {
    return this.api.get(this.url('v1/entity_revs/' + id));
  }

  updateEntity(id: string, entity: Entity): Observable<any> {
    return this.api.post(this.url('v1/entity/' + id), JSON.stringify(entity));
  }

  deleteEntity(id: string): Observable<any> {
    return this.api.delete(this.url('v1/entity/' + id));
  }

  createEntity(entity: Entity): Observable<any> {
    return this.api.post(this.url('v1/entity'), JSON.stringify(entity));
  }
}
