import { FormControl } from '@angular/forms';

export class Validation {
  static numbersOnly(control: FormControl): null | object {
    let response = null;
    const pattern: RegExp = /^[0-9]*$/;
    if (control.value !== undefined && control.value !== '' && control.value !== null) {
      response = pattern.test(control.value) ? null : { numbersOnly: true };
    }
    return response;
  }
  static integersCheck(control: FormControl): null | object {
    let response = null;
    const pattern: RegExp = /^[-+]?\d+(\d+)?$/;
    if (control.value !== undefined && control.value !== '' && control.value !== null) {
      response = pattern.test(control.value) ? null : { integersCheck: true };
    }
    return response;
  }
}
