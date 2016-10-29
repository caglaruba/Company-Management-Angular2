import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: function (backend: MockBackend, options: BaseRequestOptions) {
    
    // test database
    let testUser = { id: '1', companyId: '1', name: 'Alexander Antonov', password: 'test', emailAddress: 'test@firmq.com', phoneNumber: '1234567890', isEnabled: true };
    let testCompany = { id: '1', companyName: 'FirmQ'};
    let testSmsCode = '123456';
    
    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {
      // wrap in timeout to simulate server api call
      setTimeout(() => {

        // fake authenticate api end point
        if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
          // get parameters from post request
          let params = JSON.parse(connection.request.getBody());

          // check user credentials and return fake token if valid
          if (params.email === testUser.emailAddress && params.password === testUser.password) {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: { ...testUser, token: 'fake-token' } })
            ));
          } else {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200 })
            ));
          }
        }

        // fake users api end point
        if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return test users if valid, this security is implemented server side
          // in a real application
          if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: [testUser] })
            ));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 401 })
            ));
          }
        }

        // fake user api end point
        if (connection.request.url.endsWith('/api/user') && connection.request.method === RequestMethod.Post) {
          // get parameters from post request

          if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {

            let params = JSON.parse(connection.request.getBody());

            if (params.id === testUser.id) {
              let user = testUser;

              connection.mockRespond(new Response(
                new ResponseOptions({ status: 200, body: user })
              ));

              return;              
            }
          }

          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(
            new ResponseOptions({ status: 401 })
          ));
        }

        // fake sms request api end point
        if (connection.request.url.endsWith('/api/request_sms_code') && connection.request.method === RequestMethod.Post) {
          // get parameters from post request

          if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {

            let params = JSON.parse(connection.request.getBody());

            // sending sms ....


            if (params.userId === testUser.id) {
              
              connection.mockRespond(new Response(
                new ResponseOptions({ status: 200, body: { userId : testUser.id }})
              ));

              return;              
            }
          }

          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(
            new ResponseOptions({ status: 401 })
          ));
        }

        // fake sms request api end point
        if (connection.request.url.endsWith('/api/send_sms_code') && connection.request.method === RequestMethod.Post) {
          // get parameters from post request

          if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {

            let params = JSON.parse(connection.request.getBody());

            if ((params.userId === testUser.id) && (params.smsCode === testSmsCode)) {
              
              connection.mockRespond(new Response(
                new ResponseOptions({ status: 200, body: { userId : testUser.id }})
              ));

              return;              
            }
          }

          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(
            new ResponseOptions({ status: 401 })
          ));
        }

        // fake user profile api end point
        if (connection.request.url.endsWith('/api/company_user_profile') && connection.request.method === RequestMethod.Post) {

          if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {
            // get parameters from post request
            let params = JSON.parse(connection.request.getBody());

            // check user credentials and return fake token if valid
            if (params.id === testUser.id) {
              testUser = params;
              connection.mockRespond(new Response(
                new ResponseOptions({ status: 200, body: { ...testUser, token: 'fake-token' } })
              ));

              return;
            }
          }

          connection.mockRespond(new Response(
            new ResponseOptions({ status: 401 })
          ));
          
        }

        // fake company user profile api end point
        if (connection.request.url.endsWith('/api/company') && connection.request.method === RequestMethod.Post) {
          // get parameters from post request

          if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {

            let params = JSON.parse(connection.request.getBody());

            if (params.id === testCompany.id) {
              let company = testCompany;

              connection.mockRespond(new Response(
                new ResponseOptions({ status: 200, body: company })
              ));

              return;              
            }
          }

          // return 401 not authorised if token is null or invalid
          connection.mockRespond(new Response(
            new ResponseOptions({ status: 401 })
          ));
        }

      }, 500);

    });

    return new Http(backend, options);
  },
  deps: [MockBackend, BaseRequestOptions]
};