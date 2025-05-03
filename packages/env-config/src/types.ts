/**
 * Configuration interface for the application
 */
export interface AppConfig {
  /** 
   * Base URL for Directus API (no trailing slash)
   * @example "http://localhost:8055"
   */
  directusUrl: string;
  
  /** 
   * Environment (development, production, test)
   * @default "development"
   */
  nodeEnv: "development" | "production" | "test";
  
  /** 
   * Port for the web server 
   * @default 3000
   */
  port: number;
  
  /** 
   * Port for the docs server 
   * @default 3001
   */
  docsPort: number;
  
  /** 
   * Directus API token if needed 
   */
  directusApiToken?: string;
  
  /** 
   * GitHub personal access token for API access
   */
  githubToken?: string;
  
  /** 
   * Debug mode flag 
   * @default false
   */
  debug: boolean;
  
  /** 
   * Application URL 
   * @example "http://localhost:3000"
   */
  appUrl: string;
  
  /**
   * Documentation site URL
   * @example "http://localhost:3001"
   */
  docsUrl: string;
}