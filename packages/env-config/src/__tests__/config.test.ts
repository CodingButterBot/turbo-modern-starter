import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadConfig, getConfig, resetConfigCache } from '../config';

describe('config', () => {
  const originalEnv = { ...process.env };
  
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    resetConfigCache();
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });
  
  describe('loadConfig', () => {
    it('uses default values when environment variables are not set', () => {
      const config = loadConfig();
      
      expect(config.nodeEnv).toBe('development');
      expect(config.port).toBe(3000);
      expect(config.docsPort).toBe(3001);
      expect(config.directusUrl).toBe('http://localhost:8055');
      expect(config.debug).toBe(true);
      expect(config.appUrl).toBe('http://localhost:3000');
      expect(config.docsUrl).toBe('http://localhost:3001');
    });
    
    it('uses environment variables when set', () => {
      process.env.NODE_ENV = 'production';
      process.env.PORT = '5000';
      process.env.DOCS_PORT = '5001';
      process.env.DIRECTUS_URL = 'https://api.example.com';
      process.env.DEBUG = 'false';
      process.env.APP_URL = 'https://example.com';
      process.env.DOCS_URL = 'https://docs.example.com';
      
      const config = loadConfig();
      
      expect(config.nodeEnv).toBe('production');
      expect(config.port).toBe(5000);
      expect(config.docsPort).toBe(5001);
      expect(config.directusUrl).toBe('https://api.example.com');
      expect(config.debug).toBe(false);
      expect(config.appUrl).toBe('https://example.com');
      expect(config.docsUrl).toBe('https://docs.example.com');
    });
    
    it('includes API tokens when set', () => {
      process.env.DIRECTUS_API_TOKEN = 'test-directus-token';
      process.env.GITHUB_TOKEN = 'test-github-token';
      
      const config = loadConfig();
      
      expect(config.directusApiToken).toBe('test-directus-token');
      expect(config.githubToken).toBe('test-github-token');
    });
  });
  
  describe('getConfig', () => {
    it('returns the same config instance on multiple calls', () => {
      const config1 = getConfig();
      const config2 = getConfig();
      
      expect(config1).toBe(config2);
    });
    
    it('reloads config after resetConfigCache is called', () => {
      const config1 = getConfig();
      resetConfigCache();
      const config2 = getConfig();
      
      expect(config1).not.toBe(config2);
    });
  });
});