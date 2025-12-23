import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatDateTime, handleError } from '@/lib/utils';

describe('Utils', () => {
  describe('cn', () => {
    it('combines class names', () => {
      const result = cn('foo', 'bar');
      expect(result).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      const result = cn('foo', false && 'bar', 'baz');
      expect(result).toBe('foo baz');
    });
  });

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan/);
      expect(formatted).toMatch(/15/);
      expect(formatted).toMatch(/2024/);
    });

    it('formats Date object correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan/);
    });
  });

  describe('formatDateTime', () => {
    it('formats datetime with time', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDateTime(date);
      expect(formatted).toMatch(/Jan/);
      expect(formatted).toMatch(/15/);
      expect(formatted).toMatch(/2024/);
    });
  });

  describe('handleError', () => {
    it('returns error message from Error object', () => {
      const error = new Error('Test error');
      expect(handleError(error)).toBe('Test error');
    });

    it('returns default message for unknown error', () => {
      const error = { foo: 'bar' };
      expect(handleError(error)).toBe('An unexpected error occurred');
    });
  });
});
