import { describe, it, expect, vi } from 'vitest';
import { DirectusClient } from '../directus-client';

// Mock @directus/sdk
vi.mock('@directus/sdk', () => {
  return {
    createDirectus: vi.fn(() => ({
      with: vi.fn().mockImplementation(function() {
        return this;
      }),
      setToken: vi.fn().mockResolvedValue(true),
      login: vi.fn().mockResolvedValue({ access_token: 'test_token' }),
      request: vi.fn().mockResolvedValue([])
    })),
    rest: vi.fn(),
    authentication: vi.fn(),
    readItems: vi.fn(),
    createItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn()
  };
});

describe('DirectusClient', () => {
  it('should initialize with URL', () => {
    const client = new DirectusClient({ url: 'http://localhost:8055' });
    expect(client).toBeDefined();
  });

  it('should authenticate with token', async () => {
    const client = new DirectusClient({ 
      url: 'http://localhost:8055',
      token: 'test_token'
    });
    
    await expect(client.authenticate()).resolves.toBe(true);
  });

  it('should authenticate with email and password', async () => {
    const client = new DirectusClient({ 
      url: 'http://localhost:8055',
      email: 'admin@example.com',
      password: 'password'
    });
    
    await expect(client.authenticate()).resolves.toBe(true);
  });

  it('should throw an error if no authentication method is provided', async () => {
    const client = new DirectusClient({ url: 'http://localhost:8055' });
    
    await expect(client.authenticate()).rejects.toThrow('Authentication requires either a token or email/password');
  });
});