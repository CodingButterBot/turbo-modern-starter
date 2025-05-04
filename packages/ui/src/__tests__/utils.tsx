import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('merges class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toBe('base active');
    });

    it('handles falsy values', () => {
      const isActive = false;
      const result = cn('base', isActive && 'active', null, undefined, 0);
      expect(result).toBe('base');
    });

    it('handles arrays', () => {
      const result = cn('base', ['array1', 'array2']);
      expect(result).toBe('base array1 array2');
    });

    it('handles objects', () => {
      const result = cn('base', { 'conditional-true': true, 'conditional-false': false });
      expect(result).toBe('base conditional-true');
    });

    it('handles conflicts with Tailwind classes via tailwind-merge', () => {
      const result = cn('px-2 py-1', 'p-4');
      // tailwind-merge should override px-2 py-1 with p-4
      expect(result).toBe('p-4');
    });

    it('handles Tailwind class conflicts with proper precedence', () => {
      const result = cn('text-sm text-blue-500', 'text-lg text-red-500');
      // Later classes should override earlier ones
      expect(result).toBe('text-lg text-red-500');
    });
  });
});