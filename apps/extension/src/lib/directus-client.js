/**
 * Directus Client for Browser Extension
 * 
 * This file provides utilities for working with Directus API in the extension.
 */
import { storageService } from '../services/StorageService';

// Constants
const DIRECTUS_URL_KEY = 'directusUrl';
const DIRECTUS_TOKEN_KEY = 'directusToken';
const DEFAULT_DIRECTUS_URL = 'http://localhost:8055';

/**
 * Get the configured Directus URL
 * @returns {Promise<string>} Directus URL
 */
export async function getDirectusUrl() {
  try {
    const result = await storageService.get(DIRECTUS_URL_KEY);
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
export async function setDirectusUrl(url) {
  await storageService.set({ [DIRECTUS_URL_KEY]: url });
}

/**
 * Get the stored Directus token
 * @returns {Promise<string|null>} Directus token
 */
export async function getDirectusToken() {
  try {
    const result = await storageService.get(DIRECTUS_TOKEN_KEY);
    return result[DIRECTUS_TOKEN_KEY] || null;
  } catch (error) {
    console.error('Error getting Directus token:', error);
    return null;
  }
}

/**
 * Set the Directus token
 * @param {string} token Directus token
 * @returns {Promise<void>}
 */
export async function setDirectusToken(token) {
  await storageService.set({ [DIRECTUS_TOKEN_KEY]: token });
}

/**
 * Authenticate with Directus
 * @param {Object} credentials Credentials object
 * @param {string} credentials.email User email
 * @param {string} credentials.password User password
 * @returns {Promise<string>} Authentication token
 */
export async function authenticateDirectus({ email, password }) {
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

    const data = await response.json();
    const token = data.data.access_token;

    // Store the token
    await setDirectusToken(token);

    return token;
  } catch (error) {
    console.error('Error authenticating with Directus:', error);
    throw error;
  }
}

/**
 * Get module options from Directus
 * @param {Object} params Query parameters
 * @returns {Promise<Array>} Module options
 */
export async function getModuleOptions(params = {}) {
  try {
    const url = await getDirectusUrl();
    const token = await getDirectusToken();

    // Build the query string
    const queryParams = new URLSearchParams();
    if (params.filter) {
      queryParams.append('filter', JSON.stringify(params.filter));
    }
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }

    const queryString = queryParams.toString();
    const endpoint = `${url}/items/module_options${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(endpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error getting module options:', error);
    throw error;
  }
}

/**
 * Get module option items by options ID
 * @param {number} optionsId Module options ID
 * @returns {Promise<Array>} Module option items
 */
export async function getModuleOptionItems(optionsId) {
  try {
    const url = await getDirectusUrl();
    const token = await getDirectusToken();

    const queryParams = new URLSearchParams({
      filter: JSON.stringify({ options_id: { _eq: optionsId } }),
    });

    const endpoint = `${url}/items/module_option_items?${queryParams}`;

    const response = await fetch(endpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error getting module option items:', error);
    throw error;
  }
}

/**
 * Record a module result
 * @param {Object} result Module result object
 * @returns {Promise<Object>} Created result
 */
export async function recordModuleResult(result) {
  try {
    const url = await getDirectusUrl();
    const token = await getDirectusToken();

    if (!token) {
      throw new Error('Authentication required to record results');
    }

    const response = await fetch(`${url}/items/module_results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(result),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error recording module result:', error);
    throw error;
  }
}

/**
 * Spin the wheel using items from Directus
 * @param {Array} items Module option items
 * @param {number} optionsId Module options ID
 * @returns {Promise<Object>} Result item
 */
export async function spinWheel(items, optionsId) {
  if (!items || !items.length) {
    throw new Error('No items available to spin');
  }

  // Implement weighted random selection
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  let random = Math.random() * totalWeight;
  
  let selectedItem = null;
  
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
    await recordModuleResult({
      options_id: optionsId,
      result_item_id: selectedItem.id,
      device_info: { platform: 'extension' }
    });
  } catch (error) {
    // Still return the result even if recording fails
    console.error('Failed to record result, but spin succeeded:', error);
  }

  return selectedItem;
}