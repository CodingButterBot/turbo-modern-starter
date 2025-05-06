/**
 * Directus Integration
 * 
 * This file provides the main exports for the Directus integration.
 */

// Export the client
export { 
  getDirectusClient,
  isDirectusConfigured,
  resetDirectusClient 
} from './client';

// Export hooks
export {
  useModuleOptions,
  useModuleOption,
  useModuleOptionItems,
  useRecordModuleResult,
  useModuleSpin
} from './hooks';

// Re-export types from the directus-client package
export type {
  ModuleOption,
  ModuleOptionItem,
  ModuleResult,
  UserPreference,
  DirectusResponse,
  QueryParams,
  Filter
} from '@repo/directus-client';