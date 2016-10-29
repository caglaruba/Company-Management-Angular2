export class CompanyUser {
  id: string;
  companyId: string;
  name: string;
  emailAddress: string;
  password: string;
  phoneNumber: string;
  isEnabled: boolean;
}

export class User {
  id: string;
  company_id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  is_enabled: boolean;
}

export class AuthSmsCode {
  userId: string;
  phoneNumber: string;
  smsCode: string;
}
