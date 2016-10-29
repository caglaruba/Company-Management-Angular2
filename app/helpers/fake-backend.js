"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("@angular/http");
const testing_1 = require("@angular/http/testing");
exports.fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: http_1.Http,
    useFactory: function (backend, options) {
        // test database
        let testUser = { id: '1', companyId: '1', name: 'Alexander Antonov', password: 'test', emailAddress: 'test@firmq.com', phoneNumber: '1234567890', isEnabled: true };
        let testCompany = { id: '1', companyName: 'FirmQ' };
        let testSmsCode = '123456';
        // configure fake backend
        backend.connections.subscribe((connection) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {
                // fake authenticate api end point
                if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === http_1.RequestMethod.Post) {
                    // get parameters from post request
                    let params = JSON.parse(connection.request.getBody());
                    // check user credentials and return fake token if valid
                    if (params.email === testUser.emailAddress && params.password === testUser.password) {
                        connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 200, body: Object.assign({}, testUser, { token: 'fake-token' }) })));
                    }
                    else {
                        connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 200 })));
                    }
                }
                // fake users api end point
                if (connection.request.url.endsWith('/api/users') && connection.request.method === http_1.RequestMethod.Get) {
                    // check for fake auth token in header and return test users if valid, this security is implemented server side
                    // in a real application
                    if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {
                        connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 200, body: [testUser] })));
                    }
                    else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 401 })));
                    }
                }
                // fake user api end point
                if (connection.request.url.endsWith('/api/user') && connection.request.method === http_1.RequestMethod.Post) {
                    // get parameters from post request
                    if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {
                        let params = JSON.parse(connection.request.getBody());
                        if (params.id === testUser.id) {
                            let user = testUser;
                            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 200, body: user })));
                            return;
                        }
                    }
                    // return 401 not authorised if token is null or invalid
                    connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 401 })));
                }
                // fake sms request api end point
                if (connection.request.url.endsWith('/api/request_sms_code') && connection.request.method === http_1.RequestMethod.Post) {
                    // get parameters from post request
                    if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {
                        let params = JSON.parse(connection.request.getBody());
                        // sending sms ....
                        if (params.userId === testUser.id) {
                            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { userId: testUser.id } })));
                            return;
                        }
                    }
                    // return 401 not authorised if token is null or invalid
                    connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 401 })));
                }
                // fake sms request api end point
                if (connection.request.url.endsWith('/api/send_sms_code') && connection.request.method === http_1.RequestMethod.Post) {
                    // get parameters from post request
                    if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {
                        let params = JSON.parse(connection.request.getBody());
                        if ((params.userId === testUser.id) && (params.smsCode === testSmsCode)) {
                            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { userId: testUser.id } })));
                            return;
                        }
                    }
                    // return 401 not authorised if token is null or invalid
                    connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 401 })));
                }
                // fake user profile api end point
                if (connection.request.url.endsWith('/api/company_user_profile') && connection.request.method === http_1.RequestMethod.Post) {
                    if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {
                        // get parameters from post request
                        let params = JSON.parse(connection.request.getBody());
                        // check user credentials and return fake token if valid
                        if (params.id === testUser.id) {
                            testUser = params;
                            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 200, body: Object.assign({}, testUser, { token: 'fake-token' }) })));
                            return;
                        }
                    }
                    connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 401 })));
                }
                // fake company user profile api end point
                if (connection.request.url.endsWith('/api/company') && connection.request.method === http_1.RequestMethod.Post) {
                    // get parameters from post request
                    if (connection.request.headers.get('Authorization') === 'FirmQ fake-token') {
                        let params = JSON.parse(connection.request.getBody());
                        if (params.id === testCompany.id) {
                            let company = testCompany;
                            connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 200, body: company })));
                            return;
                        }
                    }
                    // return 401 not authorised if token is null or invalid
                    connection.mockRespond(new http_1.Response(new http_1.ResponseOptions({ status: 401 })));
                }
            }, 500);
        });
        return new http_1.Http(backend, options);
    },
    deps: [testing_1.MockBackend, http_1.BaseRequestOptions]
};
//# sourceMappingURL=fake-backend.js.map