/**
 * Type definitions for Directus API client
 */

// Collection Interfaces
export interface ModuleOption {
  id?: number;
  name: string;
  description?: string;
  status: 'published' | 'draft' | 'archived';
  user_created?: string;
  date_created?: string;
  user_updated?: string;
  date_updated?: string;
  module_option_items?: ModuleOptionItem[];
}

export interface ModuleOptionItem {
  id?: number;
  options_id: number;
  label: string;
  weight?: number;
  color?: string | null;
  sort?: number;
  status: 'published' | 'draft' | 'archived';
}

export interface ModuleResult {
  id?: number;
  options_id: number;
  result_item_id: number;
  date_created?: string;
  user_id?: string;
  device_info?: Record<string, any>;
  notes?: string;
}

export interface UserPreference {
  id?: number;
  user_id: string;
  theme?: 'light' | 'dark' | 'system';
  default_options_id?: number;
  settings?: Record<string, any>;
}

// Configuration Interface
export interface DirectusClientConfig {
  url: string;
  token?: string;
  email?: string;
  password?: string;
}

// Filter types
export type FilterOperator = 
  | '_eq' | '_neq' | '_gt' | '_gte' | '_lt' | '_lte' 
  | '_in' | '_nin' | '_null' | '_nnull' | '_contains' 
  | '_ncontains' | '_between' | '_nbetween' | '_empty' 
  | '_nempty';

export type Filter<T> = Partial<{
  [K in keyof T]?: T[K] | { [op in FilterOperator]?: any }
}>;

// Query parameters
export interface QueryParams<T> {
  fields?: Array<keyof T>;
  filter?: Filter<T>;
  sort?: Array<`${'-' | '+' | ''}${string & keyof T}`>;
  limit?: number;
  offset?: number;
  search?: string;
  page?: number;
  deep?: Record<string, any>;
}

// Response type
export interface DirectusResponse<T> {
  data: T;
  meta?: {
    total_count?: number;
    filter_count?: number;
  };
}