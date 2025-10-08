import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minSelected(min = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val = control.value as any[];
    if (!Array.isArray(val)) {
      return { minSelected: { required: min, actual: 0 } };
    }
    return val.length >= min ? null : { minSelected: { required: min, actual: val.length } };
  };
}