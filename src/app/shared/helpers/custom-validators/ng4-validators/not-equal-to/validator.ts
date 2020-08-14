import { AbstractControl, FormControl, NgModel, Validators, ValidatorFn } from '@angular/forms';
import { isPresent } from '../util/lang';

export const notEqualTo = (notEqualControl: NgModel | FormControl): ValidatorFn => {
  let subscribe = false;

  return (control: AbstractControl): { [key: string]: any } => {
    if (!isPresent(notEqualControl)) {
      return null;
    }

    if (isPresent(Validators.required(control))) {
      return null;
    }

    if (!subscribe) {
      subscribe = true;
      notEqualControl.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
      });
    }

    const v: string = control.value;

    return notEqualControl.value !== v ? null : { 'notEqualTo': { 'actualValue': v, 'requiredValue': notEqualControl['name'] } };
  };
};
