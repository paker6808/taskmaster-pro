import { FormControl } from '@angular/forms';
import { minSelected } from './min-selected.validator';

describe('minSelected Validator', () => {
  it('should return null if array has at least min items', () => {
    const control = new FormControl([1, 2, 3]);
    const validator = minSelected(2);
    expect(validator(control)).toBeNull();
  });

  it('should return error if array has fewer items than min', () => {
    const control = new FormControl([1]);
    const validator = minSelected(2);
    const result = validator(control);
    expect(result).toEqual({ minSelected: { required: 2, actual: 1 } });
  });

  it('should handle empty array', () => {
    const control = new FormControl([]);
    const validator = minSelected(1);
    const result = validator(control);
    expect(result).toEqual({ minSelected: { required: 1, actual: 0 } });
  });

  it('should handle non-array values', () => {
    const control = new FormControl('not an array');
    const validator = minSelected(1);
    const result = validator(control);
    expect(result).toEqual({ minSelected: { required: 1, actual: 0 } });
  });

  it('should use default min value 1 if not provided', () => {
    const control = new FormControl([]);
    const validator = minSelected();
    const result = validator(control);
    expect(result).toEqual({ minSelected: { required: 1, actual: 0 } });
  });

  it('should pass when array length equals min', () => {
    const control = new FormControl([1, 2]);
    const validator = minSelected(2);
    expect(validator(control)).toBeNull();
  });
});
