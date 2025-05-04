/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility', () => {
  it('combines multiple class names', () => {
    const result = cn('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('handles conditional classes with objects', () => {
    const result = cn(
      'base-class',
      { 'conditional-class': true, 'excluded-class': false }
    );
    expect(result).toBe('base-class conditional-class');
    expect(result).not.toContain('excluded-class');
  });

  it('handles undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'other-class');
    expect(result).toBe('base-class other-class');
  });

  it('merges tailwind classes properly', () => {
    const result = cn('p-4 bg-red-500', 'p-6 text-white');
    expect(result).toBe('text-white p-6 bg-red-500');
  });

  it('handles arrays of classes', () => {
    const result = cn('base', ['array-item1', 'array-item2']);
    expect(result).toContain('base');
    expect(result).toContain('array-item1');
    expect(result).toContain('array-item2');
  });
});