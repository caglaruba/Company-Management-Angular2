import {AbstractControl, FormControl, FormGroup, Validator, ValidatorFn} from "@angular/forms";

export function IsEqual(passwordKey: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if( typeof control.parent != "undefined") {
      return {'isEqual': control.value == control.parent.value[passwordKey]}
    }

    return null;
  };
}

export class EmailValidator {
  static isValidMailFormat(control: FormControl){
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
      return { "Please provide a valid email": true };
    }

    return null;
  }
}

// FORM GROUP VALIDATORS
export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
  return (group: FormGroup): {[key: string]: any} => {
    let password = group.controls[passwordKey];
    let confirmPassword = group.controls[confirmPasswordKey];

    if (typeof password != "undefined" && typeof  confirmPassword != "undefined" && password.value == confirmPassword.value) {
      return null;
    }

    return {
      mismatchedPasswords: true
    };
  }
}

