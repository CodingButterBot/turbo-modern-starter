/**
 * Directus Client for Browser Extension
 * 
 * This file provides utilities for working with Directus API in the extension.
 */
import { storageService } from '../services/StorageService';

// Constants
const DIRECTUS_URL_KEY = 'directusUrl';
const DIRECTUS_ACCESS_TOKEN_KEY = 'directusAccessToken';
const DIRECTUS_REFRESH_TOKEN_KEY = 'directusRefreshToken';
const DIRECTUS_TOKEN_EXPIRATION_KEY = 'directusTokenExpiration';
// For backwards compatibility
const DIRECTUS_TOKEN_KEY = 'directusToken';
const DEFAULT_DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';

// Types and Interfaces
export interface DirectusAuthResponse {
  data: {
    access_token: string;
    refresh_token: string;
    expires: number;
  };
}

export interface DirectusAuthResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface DirectusError {
  message: string;
  extensions?: {
    code: string;
  };
}

export interface DirectusModule {
  id: number;
  name: string;
  status: string;
  description?: string;
}

export interface DirectusModuleItem {
  id: number;
  label: string;
  color?: string;
  weight: number;
}

export interface DirectusModuleResult {
  options_id: number;
  result_item_id: number;
  device_info?: Record<string, any>;
}

export interface StorageResult {
  [key: string]: any;
}

export interface TokenTestResult {
  success: boolean;
  message: string;
  expiredAt?: string;
  hasToken?: boolean;
  hasRefreshToken?: boolean;
  initialState?: {
    hasToken: boolean;
    tokenExpiration: string | null;
  };
  currentState?: {
    hasToken: boolean;
    tokenExpiration: string | null;
  };
}

/**
 * Get the configured Directus URL
 * @returns {Promise<string>} Directus URL
 */
export async function getDirectusUrl(): Promise<string> {
  try {
    const result = await storageService.get(DIRECTUS_URL_KEY) as StorageResult;
    return result[DIRECTUS_URL_KEY] || DEFAULT_DIRECTUS_URL;
  } catch (error) {
    console.error('Error getting Directus URL:', error);
    return DEFAULT_DIRECTUS_URL;
  }
}

/**
 * Set the Directus URL
 * @param {string} url Directus URL
 * @returns {Promise<void>}
 */
export async function setDirectusUrl(url: string): Promise<void> {
  await storageService.set({ [DIRECTUS_URL_KEY]: url });
}

/**
 * Get the stored Directus access token
 * @returns {Promise<string|null>} Directus access token
 */
export async function getDirectusToken(): Promise<string | null> {
  try {
    // First try the new access token key
    const result = await storageService.get([DIRECTUS_ACCESS_TOKEN_KEY, DIRECTUS_TOKEN_KEY]) as StorageResult;
    
    // Return the new token if it exists, otherwise fall back to the old token key for compatibility
    return result[DIRECTUS_ACCESS_TOKEN_KEY] || result[DIRECTUS_TOKEN_KEY] || null;
  } catch (error) {
    console.error('Error getting Directus token:', error);
    return null;
  }
}

/**
 * Get the stored Directus refresh token
 * @returns {Promise<string|null>} Directus refresh token
 */
export async function getDirectusRefreshToken(): Promise<string | null> {
  try {
    const result = await storageService.get(DIRECTUS_REFRESH_TOKEN_KEY) as StorageResult;
    return result[DIRECTUS_REFRESH_TOKEN_KEY] || null;
  } catch (error) {
    console.error('Error getting Directus refresh token:', error);
    return null;
  }
}

/**
 * Get the stored Directus token expiration timestamp
 * @returns {Promise<number|null>} Expiration timestamp in milliseconds
 */
export async function getDirectusTokenExpiration(): Promise<number | null> {
  try {
    const result = await storageService.get(DIRECTUS_TOKEN_EXPIRATION_KEY) as StorageResult;
    return result[DIRECTUS_TOKEN_EXPIRATION_KEY] || null;
  } catch (error) {
    console.error('Error getting Directus token expiration:', error);
    return null;
  }
}

/**
 * Set all Directus auth tokens and expiration
 * @param {string} accessToken Access token
 * @param {string} refreshToken Refresh token
 * @param {number} expiresIn Expiration time in seconds
 * @returns {Promise<void>}
 */
export async function setDirectusTokens(accessToken: string, refreshToken: string, expiresIn: number): Promise<void> {
  const expirationTime = Date.now() + (expiresIn * 1000);
  
  await storageService.set({
    [DIRECTUS_ACCESS_TOKEN_KEY]: accessToken,
    [DIRECTUS_REFRESH_TOKEN_KEY]: refreshToken,
    [DIRECTUS_TOKEN_EXPIRATION_KEY]: expirationTime,
    // Also set the legacy token key for backwards compatibility
    [DIRECTUS_TOKEN_KEY]: accessToken,
    // Update login status
    isLoggedIn: true
  });
}

/**
 * Set just the Directus access token
 * @param {string} token Directus access token
 * @returns {Promise<void>}
 */
export async function setDirectusToken(token: string): Promise<void> {
  await storageService.set({
    [DIRECTUS_ACCESS_TOKEN_KEY]: token,
    [DIRECTUS_TOKEN_KEY]: token, // For backwards compatibility
    isLoggedIn: !!token
  });
}

/**
 * Validate if the current token is still valid
 * @returns {Promise<boolean>} True if token is valid, false otherwise
 */
export async function validateToken(): Promise<boolean> {
  try {
    // First, check if we have an expiration time
    const expiration = await getDirectusTokenExpiration();
    
    // If no expiration found, check if we have a legacy token (which we can't validate by expiration)
    if (!expiration) {
      const token = await getDirectusToken();
      // If we have a token but no expiration, assume it's still valid (legacy behavior)
      return !!token;
    }
    
    // If we have an expiration time, check if it's in the future
    // We add a 30-second buffer to account for network latency
    const isValid = expiration > (Date.now() + 30000);
    
    // If token is not valid, we'll return false and let the calling code
    // decide whether to refresh or redirect to login
    return isValid;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}

/**
 * Clear all authentication tokens and set logged out state
 * @returns {Promise<void>}
 */
export async function clearAuthTokens(): Promise<void> {
  await storageService.set({
    [DIRECTUS_ACCESS_TOKEN_KEY]: null,
    [DIRECTUS_REFRESH_TOKEN_KEY]: null,
    [DIRECTUS_TOKEN_EXPIRATION_KEY]: null,
    [DIRECTUS_TOKEN_KEY]: null, // Clear legacy token too
    isLoggedIn: false
  });
}

/**
 * Make an authenticated API request with token validation and refresh
 * @param {string} endpoint The API endpoint to call
 * @param {RequestInit} options Fetch options
 * @returns {Promise<Response>} Fetch response
 * @throws {Error} If authentication fails and cannot be recovered
 */
export async function makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
  // First check if token is valid
  const isTokenValid = await validateToken();
  
  // If token is not valid, try to refresh it
  if (!isTokenValid) {
    const refreshSuccessful = await refreshToken();
    
    // If refresh fails, we need to force reauthentication
    if (!refreshSuccessful) {
      throw new Error('AUTH_REQUIRED');
    }
  }
  
  // Get the URL and access token
  const baseUrl = await getDirectusUrl();
  const token = await getDirectusToken();
  
  // Build the full URL if the endpoint doesn't already include it
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  // Prepare headers with authorization token
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  // Make the API request
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    // Handle 401 errors (unauthorized) by attempting to refresh the token
    if (response.status === 401) {
      // Try to refresh the token
      const refreshSuccessful = await refreshToken();
      
      // If refresh was successful, retry the request with the new token
      if (refreshSuccessful) {
        const newToken = await getDirectusToken();
        
        // Update the headers with the new token
        const updatedHeaders = {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`
        };
        
        // Retry the request
        return fetch(url, {
          ...options,
          headers: updatedHeaders
        });
      } else {
        // If refresh failed, we need to force reauthentication
        throw new Error('AUTH_REQUIRED');
      }
    }
    
    return response;
  } catch (error) {
    // If the error is specifically about authentication, rethrow it
    if ((error as Error).message === 'AUTH_REQUIRED') {
      throw error;
    }
    
    // For network errors, check if we're authenticated
    const hasToken = !!(await getDirectusToken());
    
    // If we have a token but got a network error, it might be a temporary issue
    if (hasToken) {
      console.warn('Network error during authenticated request:', error);
      throw error;
    } else {
      // If we don't have a token, it's an authentication issue
      throw new Error('AUTH_REQUIRED');
    }
  }
}

/**
 * Refresh the access token using the refresh token
 * @returns {Promise<boolean>} True if refresh was successful, false otherwise
 */
export async function refreshToken(): Promise<boolean> {
  try {
    // Get the refresh token
    const refreshTokenValue = await getDirectusRefreshToken();
    
    // If no refresh token is available, we can't refresh
    if (!refreshTokenValue) {
      console.warn('No refresh token available');
      return false;
    }
    
    // Get the Directus URL
    const url = await getDirectusUrl();
    
    // Call the refresh endpoint
    const response = await fetch(`${url}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshTokenValue }),
    });
    
    // If the response is not ok, the refresh failed
    if (!response.ok) {
      // Clear tokens on refresh failure - user must log in again
      await clearAuthTokens();
      return false;
    }
    
    // Parse the response
    const data = await response.json() as DirectusAuthResponse;
    const { access_token, refresh_token, expires } = data.data;
    
    // Store the new tokens
    await setDirectusTokens(access_token, refresh_token, expires);
    
    // Refresh was successful
    return true;
  } catch (error) {
    console.warn('Error refreshing token:', error);
    // Clear tokens on error - user must log in again
    await clearAuthTokens();
    return false;
  }
}

/**
 * Authenticate with Directus
 * @param {Object} credentials Credentials object
 * @param {string} credentials.email User email
 * @param {string} credentials.password User password
 * @returns {Promise<DirectusAuthResult>} Authentication data containing tokens
 */
export async function authenticateDirectus({ 
  email, 
  password 
}: { 
  email: string; 
  password: string 
}): Promise<DirectusAuthResult> {
  try {
    const url = await getDirectusUrl();
    const response = await fetch(`${url}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json() as DirectusAuthResponse;
    const { access_token, refresh_token, expires } = data.data;

    // Store all tokens and expiration
    await setDirectusTokens(access_token, refresh_token, expires);

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires
    };
  } catch (error) {
    console.error('Error authenticating with Directus:', error);
    throw error;
  }
}

// Type for filter parameter in getModuleOptions
interface ModuleQueryParams {
  filter?: Record<string, any>;
  sort?: string;
  limit?: number;
}

/**
 * Get module options from Directus
 * @param {ModuleQueryParams} params Query parameters
 * @returns {Promise<DirectusModule[]>} Module options
 */
export async function getModuleOptions(params: ModuleQueryParams = {}): Promise<DirectusModule[]> {
  try {
    // Build the query string
    const queryParams = new URLSearchParams();
    if (params.filter) {
      queryParams.append('filter', JSON.stringify(params.filter));
    }
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = `/items/module_options${queryString ? `?${queryString}` : ''}`;
    
    // Check if we have a token (to determine if we should try authenticating)
    const hasToken = await validateToken();
    
    // If we have a valid token, make an authenticated request
    if (hasToken) {
      try {
        // Use our new authenticated request helper
        const response = await makeAuthenticatedRequest(endpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        return data.data || [];
      } catch (error) {
        // If authentication is required (token invalid or expired and refresh failed)
        if ((error as Error).message === 'AUTH_REQUIRED') {
          // Clear tokens and return demo data
          await clearAuthTokens();
          console.log('Authentication required. Using sample data.');
          return getDemoModuleOptions();
        }
        throw error;
      }
    } else {
      // No valid token, return demo data
      console.log('No authentication available. Using sample data.');
      return getDemoModuleOptions();
    }
  } catch (error) {
    console.warn('Error getting module options:', error);
    // For any error, if we're not authenticated, return demo data
    if (!await validateToken()) {
      console.log('Error occurred but no authentication available. Falling back to sample data.');
      return getDemoModuleOptions();
    }
    throw error;
  }
}

/**
 * Get demo module options for unauthenticated users
 * @returns {Array} Demo module options
 */
function getDemoModuleOptions(): DirectusModule[] {
  return [{
    id: 1,
    name: 'Demo Options (Not Authenticated)',
    status: 'published',
    description: 'This is demo data because you are not authenticated with Directus'
  }];
}

/**
 * Get module option items by options ID
 * @param {number} optionsId Module options ID
 * @returns {Promise<DirectusModuleItem[]>} Module option items
 */
export async function getModuleOptionItems(optionsId: number): Promise<DirectusModuleItem[]> {
  try {
    // Handle demo data for the demo option (ID 1) when not authenticated
    const isAuthenticated = await validateToken();
    if (optionsId === 1 && !isAuthenticated) {
      console.log('Using demo items for unauthenticated user');
      return getDemoModuleItems();
    }

    const queryParams = new URLSearchParams({
      filter: JSON.stringify({ options_id: { _eq: optionsId } }),
    });

    const endpoint = `/items/module_option_items?${queryParams}`;
    
    // If we have a valid token, make an authenticated request
    if (isAuthenticated) {
      try {
        // Use our new authenticated request helper
        const response = await makeAuthenticatedRequest(endpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        return data.data || [];
      } catch (error) {
        // If authentication is required (token invalid or expired and refresh failed)
        if ((error as Error).message === 'AUTH_REQUIRED') {
          // Clear tokens
          await clearAuthTokens();
          
          // If this is our demo option ID, return mock data
          if (optionsId === 1) {
            console.log('Authentication failed. Using demo items.');
            return getDemoModuleItems();
          }
          
          // For non-demo items, we need to authenticate
          throw new Error('Authentication required to view items. Please log in.');
        }
        throw error;
      }
    } else {
      // No valid token
      if (optionsId === 1) {
        // Return demo data for the demo option
        return getDemoModuleItems();
      } else {
        // For non-demo options, we need authentication
        console.log('No authentication available. Cannot fetch real items.');
        throw new Error('Authentication required to view items. Please log in.');
      }
    }
  } catch (error) {
    console.warn('Error getting module option items:', error);
    
    // Special handling for authentication errors
    if ((error as Error).message === 'AUTH_REQUIRED' || 
        (error as Error).message === 'Authentication required to view items. Please log in.') {
      // If this is our demo option ID, provide demo data even on auth error
      if (optionsId === 1) {
        console.log('Using demo items despite authentication error');
        return getDemoModuleItems();
      }
      
      // Forward auth errors for handling by UI
      throw error;
    }
    
    // For unexpected errors with the demo option, still return demo data
    if (optionsId === 1 && !await validateToken()) {
      console.log('Error occurred but using demo data for the demo option.');
      return getDemoModuleItems();
    }
    
    throw error;
  }
}

/**
 * Get demo module option items for unauthenticated users
 * @returns {Array} Demo module items
 */
function getDemoModuleItems(): DirectusModuleItem[] {
  return [
    { id: 101, label: 'Red Option', color: '#ff0000', weight: 1 },
    { id: 102, label: 'Green Option', color: '#00ff00', weight: 1 },
    { id: 103, label: 'Blue Option', color: '#0000ff', weight: 1 },
    { id: 104, label: 'Yellow Option', color: '#ffff00', weight: 1 }
  ];
}

/**
 * Record a module result
 * @param {DirectusModuleResult} result Module result object
 * @returns {Promise<any>} Created result
 */
export async function recordModuleResult(result: DirectusModuleResult): Promise<any> {
  try {
    // Check if we're authenticated
    const isAuthenticated = await validateToken();
    
    if (!isAuthenticated) {
      throw new Error('AUTH_REQUIRED');
    }

    // Use our authenticated request helper
    const response = await makeAuthenticatedRequest('/items/module_results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    // If this is an authentication error, handle it specially
    if ((error as Error).message === 'AUTH_REQUIRED') {
      console.warn('Authentication required to record results. Please log in again.');
      throw new Error('Authentication required to record results. Please log in again.');
    }
    
    console.warn('Error recording module result:', error);
    throw error;
  }
}

/**
 * Force token expiration for testing - For development/testing only
 * @returns {Promise<TokenTestResult>} Result indicating if expiration was forced
 */
export async function forceTokenExpiration(): Promise<TokenTestResult> {
  try {
    // Get current tokens
    const token = await getDirectusToken();
    const refreshToken = await getDirectusRefreshToken();
    
    if (!token) {
      return {
        success: false,
        message: 'No token to expire'
      };
    }
    
    // Set token expiration to 1 minute ago
    const expiredTime = Date.now() - (60 * 1000);
    
    await storageService.set({
      [DIRECTUS_TOKEN_EXPIRATION_KEY]: expiredTime
    });
    
    return {
      success: true,
      message: 'Token expiration forced',
      expiredAt: new Date(expiredTime).toISOString(),
      hasToken: !!token,
      hasRefreshToken: !!refreshToken
    };
  } catch (error) {
    console.error('Error forcing token expiration:', error);
    return {
      success: false,
      message: `Error forcing token expiration: ${(error as Error).message}`
    };
  }
}

/**
 * Test the token refresh flow - For development/testing only
 * @returns {Promise<TokenTestResult>} Test results
 */
export async function testTokenRefresh(): Promise<TokenTestResult> {
  try {
    console.log('Testing token refresh flow...');
    
    // Step 1: Check initial token state
    const initialToken = await getDirectusToken();
    const initialRefreshToken = await getDirectusRefreshToken();
    const initialExpiration = await getDirectusTokenExpiration();
    
    console.log('Initial state:', {
      hasToken: !!initialToken,
      hasRefreshToken: !!initialRefreshToken,
      tokenExpiration: initialExpiration ? new Date(initialExpiration).toISOString() : null,
      isExpired: initialExpiration ? (initialExpiration < Date.now()) : null
    });
    
    // Step 2: Validate the token
    const isValid = await validateToken();
    console.log('Token validation result:', isValid);
    
    if (!isValid) {
      // Step 3: Attempt to refresh the token
      console.log('Token needs refresh, attempting refresh...');
      const refreshResult = await refreshToken();
      console.log('Refresh result:', refreshResult);
      
      if (refreshResult) {
        // Step 4: Check updated token state
        const newToken = await getDirectusToken();
        const newRefreshToken = await getDirectusRefreshToken();
        const newExpiration = await getDirectusTokenExpiration();
        
        console.log('Updated state after refresh:', {
          hasNewToken: !!newToken,
          hasNewRefreshToken: !!newRefreshToken,
          newTokenExpiration: newExpiration ? new Date(newExpiration).toISOString() : null,
          isNewExpired: newExpiration ? (newExpiration < Date.now()) : null,
          tokenChanged: newToken !== initialToken,
          refreshTokenChanged: newRefreshToken !== initialRefreshToken
        });
        
        return {
          success: true,
          message: 'Token refresh successful',
          initialState: {
            hasToken: !!initialToken,
            tokenExpiration: initialExpiration ? new Date(initialExpiration).toISOString() : null,
          },
          currentState: {
            hasToken: !!newToken,
            tokenExpiration: newExpiration ? new Date(newExpiration).toISOString() : null,
          }
        };
      } else {
        // Refresh failed
        return {
          success: false,
          message: 'Token refresh failed - you need to re-authenticate'
        };
      }
    } else {
      // Token is still valid
      return {
        success: true,
        message: 'Token is still valid, no refresh needed',
        expiredAt: initialExpiration ? new Date(initialExpiration).toISOString() : null
      };
    }
  } catch (error) {
    console.error('Error testing token refresh:', error);
    return {
      success: false,
      message: `Error testing token refresh: ${(error as Error).message}`
    };
  }
}

/**
 * Spin the wheel using items from Directus
 * @param {DirectusModuleItem[]} items Module option items
 * @param {number} optionsId Module options ID
 * @returns {Promise<DirectusModuleItem>} Result item
 */
export async function spinWheel(items: DirectusModuleItem[], optionsId: number): Promise<DirectusModuleItem> {
  if (!items || !items.length) {
    throw new Error('No items available to spin');
  }

  // Implement weighted random selection
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  let random = Math.random() * totalWeight;
  
  let selectedItem: DirectusModuleItem | null = null;
  
  for (const item of items) {
    random -= (item.weight || 1);
    if (random <= 0) {
      selectedItem = item;
      break;
    }
  }
  
  // Fallback in case something went wrong with the weighted selection
  if (!selectedItem) {
    selectedItem = items[Math.floor(Math.random() * items.length)];
  }

  // Try to record the result if authenticated
  try {
    // Check if we're authenticated with valid token
    const isAuthenticated = await validateToken();
    
    if (isAuthenticated) {
      await recordModuleResult({
        options_id: optionsId,
        result_item_id: selectedItem.id,
        device_info: { platform: 'extension' }
      });
    } else {
      console.log('Demo mode: Result would be recorded if authenticated.');
    }
  } catch (error) {
    // If this is an auth error, clear tokens
    if ((error as Error).message.includes('Authentication required')) {
      await clearAuthTokens();
      console.warn('Authentication required to record results. Token cleared.');
    } else {
      // For other errors, just log and continue
      console.warn('Failed to record result, but spin succeeded:', error);
    }
  }

  return selectedItem;
}