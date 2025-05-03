import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { requireEnvVar, parseNumericEnvVar, parseBooleanEnvVar } from '../utils';

describe('env-config utils', () => {
  const originalEnv = { ...process.env };
  
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });
  
  describe('requireEnvVar', () => {
    it('returns the environment variable when set', () => {
      process.env.TEST_VAR = 'test-value';
      expect(requireEnvVar('TEST_VAR')).toBe('test-value');
    });
    
    it('returns the default value when provided and the variable is not set', () => {
      expect(requireEnvVar('MISSING_VAR', 'default-value')).toBe('default-value');
    });
    
    it('throws an error when the variable is not set and no default is provided', () => {
      expect(() => requireEnvVar('MISSING_VAR')).toThrow();
    });
  });
  
  describe('parseNumericEnvVar', () => {
    it('parses numeric environment variables correctly', () => {
      process.env.NUMERIC_VAR = '42';
      expect(parseNumericEnvVar('NUMERIC_VAR', 0)).toBe(42);
    });
    
    it('returns the default value when the variable is not set', () => {
      expect(parseNumericEnvVar('MISSING_VAR', 99)).toBe(99);
    });
    
    it('returns the default value when the variable is not a valid number', () => {
      process.env.INVALID_NUMERIC = 'not-a-number';
      expect(parseNumericEnvVar('INVALID_NUMERIC', 123)).toBe(123);
    });
  });
  
  describe('parseBooleanEnvVar', () => {
    it('parses "true" as true', () => {
      process.env.BOOL_TRUE = 'true';
      expect(parseBooleanEnvVar('BOOL_TRUE', false)).toBe(true);
    });
    
    it('parses "1" as true', () => {
      process.env.BOOL_ONE = '1';
      expect(parseBooleanEnvVar('BOOL_ONE', false)).toBe(true);
    });
    
    it('parses "yes" as true', () => {
      process.env.BOOL_YES = 'yes';
      expect(parseBooleanEnvVar('BOOL_YES', false)).toBe(true);
    });
    
    it('parses "false" as false', () => {
      process.env.BOOL_FALSE = 'false';
      expect(parseBooleanEnvVar('BOOL_FALSE', true)).toBe(false);
    });
    
    it('parses "0" as false', () => {
      process.env.BOOL_ZERO = '0';
      expect(parseBooleanEnvVar('BOOL_ZERO', true)).toBe(false);
    });
    
    it('parses "no" as false', () => {
      process.env.BOOL_NO = 'no';
      expect(parseBooleanEnvVar('BOOL_NO', true)).toBe(false);
    });
    
    it('returns the default value when the variable is not set', () => {
      expect(parseBooleanEnvVar('MISSING_VAR', true)).toBe(true);
    });
    
    it('returns the default value when the variable has an invalid value', () => {
      process.env.INVALID_BOOL = 'invalid';
      expect(parseBooleanEnvVar('INVALID_BOOL', true)).toBe(true);
    });
  });
});