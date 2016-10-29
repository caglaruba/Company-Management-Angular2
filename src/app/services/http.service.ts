import {Request, RequestOptionsArgs, Response, Http, RequestOptions} from "@angular/http";
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable()
export class ApiHttpService extends AuthHttp {
  private plainHttp: Http;

  constructor(protected auth: AuthService, options: AuthConfig, http: Http, defOpts?: RequestOptions) {
    super(options, http, defOpts);
    this.plainHttp = http;
  };


  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (this.auth.loggedIn()) {
      return super.request(url, options);
    }
    return this.plainHttp.request(url, options);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.responseInterceptor(super.get(url, options));
  };

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.responseInterceptor(super.post(url, body, options));
  };

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.responseInterceptor(super.put(url, body, options));
  };

  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.responseInterceptor(super.delete(url, options));
  };

  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.responseInterceptor(super.patch(url, body, options));
  };

  private responseInterceptor(observable: Observable<any>): Observable<any> {
    return observable
      .map((response: Response) => {
        let body = response.json();

        if (!body.meta.ok) {
          throw new Error(body.meta.error);
        }

        if(body.meta.status_code != 428 && typeof body.meta.error != "undefined" && body.meta.error != "") {
          throw new Error(body.meta.error);
        }

        if(body.meta.status_code == 428 || !body.data) {
          return body;
        }

        return body.data;
      })
      .catch(error => {
        console.error(error);
        return Observable.throw(error);
      })
  }
}
