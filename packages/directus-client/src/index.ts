/**
 * @repo/directus-client
 * 
 * A client library for interacting with the Directus API
 */

// Export the main client
export { DirectusClient } from './directus-client';

// Export types
export type {
  DirectusClientConfig,
  ModuleOption,
  ModuleOptionItem,
  ModuleResult,
  UserPreference,
  QueryParams,
  DirectusResponse,
  Filter,
  FilterOperator
} from './types';