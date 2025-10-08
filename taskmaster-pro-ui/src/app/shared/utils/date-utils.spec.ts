import { toIsoMidnight } from './date-utils';

describe('toIsoMidnight', () => {
  it('should convert Date object to UTC midnight ISO', () => {
    const date = new Date(2040, 8, 28, 15, 30); // Sep 28, 2040 15:30 local
    const iso = toIsoMidnight(date);
    expect(iso).toBe('2040-09-28T00:00:00.000Z');
  });

  it('should convert dd.MM.yyyy string to UTC midnight ISO', () => {
    const iso = toIsoMidnight('28.09.2040');
    expect(iso).toBe('2040-09-28T00:00:00.000Z');
  });

  it('should fallback to empty string for invalid input', () => {
    expect(toIsoMidnight(null)).toBe('');
    expect(toIsoMidnight(undefined)).toBe('');
    expect(toIsoMidnight('invalid')).toBe('');
  });
});