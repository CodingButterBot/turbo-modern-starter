import { AppConfig } from './types';
import { requireEnvVar, parseNumericEnvVar, parseBooleanEnvVar } from './utils';

/**
 * Loads environment variables and returns a typed configuration object
 * 
 * @returns The application configuration
 */
export function loadConfig(): AppConfig {
  const nodeEnv = requireEnvVar('NODE_ENV', 'development') as AppConfig['nodeEnv'];
  const port = parseNumericEnvVar('PORT', 3000);
  const docsPort = parseNumericEnvVar('DOCS_PORT', 3001);
  const isDev = nodeEnv === 'development';
  
  // Base URLs based on environment
  const appBaseUrl = isDev ? `http://localhost:${port}` : requireEnvVar('APP_URL', '');
  const docsBaseUrl = isDev ? `http://localhost:${docsPort}` : requireEnvVar('DOCS_URL', '');
  
  return {
    nodeEnv,
    port,
    docsPort,
    debug: parseBooleanEnvVar('DEBUG', isDev),
    
    // API and service URLs
    directusUrl: requireEnvVar('DIRECTUS_URL', 'http://localhost:8055'),
    directusApiToken: process.env.DIRECTUS_API_TOKEN,
    githubToken: process.env.GITHUB_TOKEN,
    
    // Application URLs
    appUrl: appBaseUrl,
    docsUrl: docsBaseUrl,
  };
}

/**
 * Gets the current configuration
 * Memoizes the result to avoid reloading environment variables multiple times
 */
let cachedConfig: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}

/**
 * Resets the cached configuration
 * Useful for tests or when environment variables change
 */
export function resetConfigCache(): void {
  cachedConfig = null;
}