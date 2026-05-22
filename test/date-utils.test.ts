import { describe, it, expect } from 'bun:test';
import { formatDate } from '../src/utils/date.js';

describe('formatDate', () => {
  it('should format a date in long US format', () => {
    expect(formatDate(new Date('2025-01-15'))).toBe('January 15, 2025');
  });

  it('should format date with single digit day', () => {
    expect(formatDate(new Date('2025-03-05'))).toBe('March 5, 2025');
  });
});
