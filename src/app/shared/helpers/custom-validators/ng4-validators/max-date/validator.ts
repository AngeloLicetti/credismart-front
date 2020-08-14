import { AbstractControl, FormControl, NgModel, Validators, ValidatorFn } from '@angular/forms';
import { isPresent, isDate, parseDate } from '../util/lang';

export const maxDate = (maxInput: any): ValidatorFn => {
  let value;
  let subscribe = false;
  let maxValue = maxInput;

  const isForm = (maxInput instanceof FormControl) || (maxInput instanceof NgModel);

  return (control: AbstractControl): { [key: string]: any } => {
    if (!isPresent(maxInput)) {
      return null;
    }

    if (isPresent(Validators.required(control))) {
      return null;
    }

    if (!subscribe && isForm) {
      subscribe = true;
      maxInput.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
      });
    }

    if (isForm) {
      maxValue = maxInput.value;
    }

    value = parseDate(maxValue);

    if (!isDate(value) && !(value instanceof Function)) {
      if (value == null) {
        return null;
      } else if (isForm) {
        throw Error('maxDate is invalid');
      } else {
        throw Error('maxDate value must be or return a formatted date');
      }
    }

    const d = new Date(parseDate(control.value)).getTime();

    if (!isDate(d)) {
      throw Error('value is invalid');
    }
    if (value instanceof Function) {
      value = value();
    }

    return d <= new Date(value).getTime() ? null :
      {
        'maxDate': {
          'actualValue': d, 'requiredValue': ((isForm) ? maxInput['name'] :
            () => {
              const options = { year: 'numeric', month: 'long', day: 'numeric' };
              return ((value).toLocaleDateString('es-PE', options));
            })
        }
      };
  };
};
