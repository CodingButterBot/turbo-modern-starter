/**
 * Directus Client Singleton
 * 
 * This file provides a singleton instance of the DirectusClient for use in the web app.
 */
import { DirectusClient, DirectusClientConfig } from '@repo/directus-client';

// Configuration from environment variables
const directusConfig: DirectusClientConfig = {
  url: process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055',
  token: process.env.DIRECTUS_ADMIN_TOKEN,
};

// Create singleton instance
let directusClientInstance: DirectusClient | null = null;

/**
 * Get the DirectusClient instance
 * @returns DirectusClient instance
 */
export function getDirectusClient(): DirectusClient {
  if (!directusClientInstance) {
    directusClientInstance = new DirectusClient(directusConfig);
  }
  
  return directusClientInstance;
}

/**
 * Check if Directus is configured and available
 * @returns Boolean indicating if Directus is configured
 */
export function isDirectusConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_DIRECTUS_URL);
}

/**
 * Reset the DirectusClient instance (mostly for testing)
 */
export function resetDirectusClient(): void {
  directusClientInstance = null;
}

export default getDirectusClient;