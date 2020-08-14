import { AbstractControl, FormControl, NgModel, Validators, ValidatorFn } from '@angular/forms';
import { isPresent, isDate, parseDate } from '../util/lang';

export const minDate = (minInput: any): ValidatorFn => {
  let value;
  let subscribe = false;
  let minValue = minInput;

  const isForm = (minInput instanceof FormControl) || (minInput instanceof NgModel);

  return (control: AbstractControl): { [key: string]: any } => {
    if (!isPresent(minInput)) {
      return null;
    }

    if (isPresent(Validators.required(control))) {
      return null;
    }

    if (!subscribe && isForm) {
      subscribe = true;
      minInput.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
      });
    }

    if (isForm) {
      minValue = minInput.value;
    }

    value = parseDate(minValue);

    if (!isDate(value) && !(value instanceof Function)) {
      if (value == null) {
        return null;
      } else if (isForm) {
        throw Error('minDate is invalid');
      } else {
        throw Error('minDate value must be or return a formatted date');
      }
    }

    const d = new Date(parseDate(control.value)).getTime();

    if (!isDate(d)) {
      throw Error('value is invalid');
    }
    if (value instanceof Function) {
      value = value();
    }

    return d >= new Date(value).getTime() ? null :
      {
        'minDate': {
          'actualValue': d, 'requiredValue': ((isForm) ? minInput['name'] :
            () => {
              const options = { year: 'numeric', month: 'long', day: 'numeric' };
              return ((value).toLocaleDateString('es-PE', options));
            })
        }
      };
  };
};
