/**
 * Ensures an environment variable exists and returns its value
 * 
 * @param name The name of the environment variable
 * @param defaultValue Optional default value if the variable is not set
 * @throws Error if the variable is not set and no default is provided
 * @returns The environment variable value
 */
export function requireEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  
  if (value !== undefined) {
    return value;
  }
  
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  
  throw new Error(`Environment variable ${name} is required but not set`);
}

/**
 * Safely attempts to parse a numeric environment variable
 * 
 * @param name The name of the environment variable
 * @param defaultValue Default value if the variable is not set or invalid
 * @returns The parsed number or the default value
 */
export function parseNumericEnvVar(name: string, defaultValue: number): number {
  const value = process.env[name];
  
  if (value !== undefined) {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  
  return defaultValue;
}

/**
 * Safely attempts to parse a boolean environment variable
 * 
 * @param name The name of the environment variable
 * @param defaultValue Default value if the variable is not set
 * @returns The parsed boolean or the default value
 */
export function parseBooleanEnvVar(name: string, defaultValue: boolean): boolean {
  const value = process.env[name]?.toLowerCase();
  
  if (value === 'true' || value === '1' || value === 'yes') {
    return true;
  }
  
  if (value === 'false' || value === '0' || value === 'no') {
    return false;
  }
  
  return defaultValue;
}