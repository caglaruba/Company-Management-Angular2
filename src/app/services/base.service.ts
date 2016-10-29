import {URLSearchParams, Http} from '@angular/http';
import {Inject, Injectable, Injector} from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class BaseService {

    protected endpoint: string;

    constructor(protected injector: Injector) {
    }

    url(...path: string[]): string {
        console.info("Use api server: " +environment.apiServer)
        return [environment.apiServer, ...path].join('/');
    }

    protected getSearch(search: any) {
        let searchParams = new URLSearchParams();
        Object.keys(search).forEach(key => searchParams.set(key, search[key]));
        return searchParams;
    }
}
