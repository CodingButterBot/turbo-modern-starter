# @repo/directus-client

A client library for interacting with the Directus API in the Turbo Modern Starter monorepo.

## Features

- **TypeScript Support** - Full type definitions for all API responses and parameters
- **Authentication** - Support for both token and email/password authentication
- **CRUD Operations** - Complete Create, Read, Update, Delete operations for all collections
- **Error Handling** - Comprehensive error handling and logging
- **Query Builder** - Powerful query builder for filtering, sorting, and pagination

## Installation

This package is part of the Turbo Modern Starter monorepo and is automatically available to all apps within the workspace.

## Usage

```typescript
import { DirectusClient } from '@repo/directus-client';

// Initialize the client
const directus = new DirectusClient({
  url: 'http://localhost:8055', // or your Directus instance URL
  token: 'your_api_token' // or use email/password for authentication
});

// Authenticate (only needed if not using token)
await directus.authenticate();

// Get all published module options
const { data: moduleOptions } = await directus.getModuleOptions({
  filter: { status: { _eq: 'published' } }
});

// Get a single module option with its items
const { data: option } = await directus.getModuleOption(1);

// Create a new module option
const { data: newOption } = await directus.createModuleOption({
  name: 'New Option Set',
  description: 'Example option set',
  status: 'published'
});

// Record a module result
await directus.recordModuleResult({
  options_id: 1,
  result_item_id: 3,
  device_info: { platform: 'web', browser: 'chrome' }
});

// Save user preferences
await directus.saveUserPreferences({
  user_id: 'current-user-id',
  theme: 'dark',
  default_options_id: 1
});
```

## API Reference

### Module Options

- `getModuleOptions(params?)` - Get module options with optional filtering, sorting, etc.
- `getModuleOption(id)` - Get a single module option by ID
- `createModuleOption(option)` - Create a new module option
- `updateModuleOption(id, option)` - Update an existing module option
- `deleteModuleOption(id)` - Delete a module option

### Module Option Items

- `getModuleOptionItems(params?)` - Get module option items with optional filtering, sorting, etc.
- `getItemsByOptionsId(optionsId)` - Get all items for a specific module option set
- `createModuleOptionItem(item)` - Create a new module option item
- `updateModuleOptionItem(id, item)` - Update an existing module option item
- `deleteModuleOptionItem(id)` - Delete a module option item

### Module Results

- `recordModuleResult(result)` - Record a new module result
- `getModuleResults(params?)` - Get module results with optional filtering, sorting, etc.

### User Preferences

- `getUserPreferences(userId)` - Get user preferences for a specific user
- `saveUserPreferences(preferences)` - Create or update user preferences

## Query Parameters

All list methods accept an optional query parameters object that can include:

- `fields` - Specific fields to include in the response
- `filter` - Filter criteria for the query
- `sort` - Sorting options for the results
- `limit` - Maximum number of items to return
- `offset` - Number of items to skip
- `search` - Search term to filter by
- `page` - Page number for pagination
- `deep` - Deep filtering options for related collections

## Error Handling

All methods throw errors for failed operations. You should wrap API calls in try/catch blocks to handle errors appropriately.