import { AbstractControl, FormControl, NgModel, Validators, ValidatorFn } from '@angular/forms';
import { isPresent } from '../util/lang';

export const equalTo = (equalControl: NgModel | FormControl): ValidatorFn => {
  let subscribe = false;

  return (control: AbstractControl): { [key: string]: any } => {
    if (!isPresent(equalControl)) {
      return null;
    }

    if (isPresent(Validators.required(control))) {
      return null;
    }

    if (!subscribe) {
      subscribe = true;
      equalControl.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
      });
    }

    const v: string = control.value;

    return equalControl.value === v ? null : { 'equalTo': { 'actualValue': v, 'requiredValue': equalControl['name'] } };
  };
};
