import { formatAmount, formatDate } from './formatUtils';

describe('formatUtils', () => {
  describe('formatAmount', () => {
    // Test cases for billions
    it('formats billions correctly', () => {
      expect(formatAmount(1000000000)).toBe('1.0B');
      expect(formatAmount(1500000000)).toBe('1.5B');
    });

    // Test cases for millions
    it('formats millions correctly', () => {
      expect(formatAmount(1000000)).toBe('1.0M');
      expect(formatAmount(2500000)).toBe('2.5M');
      expect(formatAmount(999999999)).toBe('1000.0M');
    });

    // Test cases for thousands
    it('formats thousands correctly', () => {
      expect(formatAmount(1000)).toBe('1.0K');
      expect(formatAmount(1500)).toBe('1.5K');
      expect(formatAmount(999999)).toBe('1000.0K');
    });

    // Test cases for numbers less than 1000
    it('returns the original amount for values < 1000', () => {
      expect(formatAmount(999)).toBe('999');
      expect(formatAmount(500)).toBe('500');
      expect(formatAmount(1)).toBe('1');
      expect(formatAmount(0)).toBe('0');
    });
  });

  describe('formatDate', () => {
    it('formats valid date strings correctly', () => {
      expect(formatDate('2023-05-15')).toMatch(/May 15, 2023/);
    });

    it('handles empty input', () => {
      expect(formatDate('')).toBe('Invalid Date');
      expect(formatDate(null)).toBe('Invalid Date');
      expect(formatDate(undefined)).toBe('Invalid Date');
    });
  });
});