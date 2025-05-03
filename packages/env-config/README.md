# @repo/env-config

This package provides centralized environment configuration management for the Turbo Modern Starter monorepo.

## Features

- Type-safe configuration via TypeScript interfaces
- Environment variable validation and parsing
- Default values for development environments
- Utilities for handling required variables
- Memoized configuration access

## Usage

### Basic Usage

```typescript
import { getConfig } from '@repo/env-config';

// Get the configuration
const config = getConfig();

// Use configuration values
console.log(`Directus API URL: ${config.directusUrl}`);
console.log(`App running in ${config.nodeEnv} mode on port ${config.port}`);
```

### Using Required Environment Variables

```typescript
import { requireEnvVar } from '@repo/env-config';

// This will throw an error if API_KEY is not set
const apiKey = requireEnvVar('API_KEY');

// This will use the default value if DATABASE_URL is not set
const dbUrl = requireEnvVar('DATABASE_URL', 'postgres://localhost:5432/mydb');
```

### Parsing Numeric and Boolean Variables

```typescript
import { parseNumericEnvVar, parseBooleanEnvVar } from '@repo/env-config';

// Parse a numeric environment variable with a default
const maxConnections = parseNumericEnvVar('MAX_CONNECTIONS', 10);

// Parse a boolean environment variable with a default
const enableCache = parseBooleanEnvVar('ENABLE_CACHE', true);
```

## Configuration Options

The package provides a typed `AppConfig` interface with the following properties:

- `nodeEnv`: Environment name ('development', 'production', 'test')
- `port`: Port for the web application
- `docsPort`: Port for the documentation site
- `directusUrl`: URL for the Directus API
- `directusApiToken`: Optional token for Directus API authentication
- `githubToken`: Optional GitHub personal access token
- `debug`: Debug mode flag
- `appUrl`: Full URL to the application
- `docsUrl`: Full URL to the documentation site

## Environment Variables

The following environment variables are supported:

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | 'development' |
| PORT | Web app port | 3000 |
| DOCS_PORT | Documentation site port | 3001 |
| DIRECTUS_URL | Directus API URL | 'http://localhost:8055' |
| DIRECTUS_API_TOKEN | Directus API token | undefined |
| GITHUB_TOKEN | GitHub personal access token | undefined |
| DEBUG | Enable debug mode | true in development |
| APP_URL | Application URL (production) | derived from PORT in development |
| DOCS_URL | Documentation URL (production) | derived from DOCS_PORT in development |

## Adding New Configuration

To extend the configuration with new variables:

1. Add the new property to the `AppConfig` interface in `src/types.ts`
2. Update the `loadConfig` function in `src/config.ts` to set the new property
3. Update the tests in `src/__tests__/config.test.ts` to cover the new property