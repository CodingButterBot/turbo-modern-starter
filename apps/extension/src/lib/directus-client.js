/**
 * Directus Client for Browser Extension
 * 
 * This file provides utilities for working with Directus API in the extension.
 */
import { storageService } from '../services/StorageService';

// Constants
const DIRECTUS_URL_KEY = 'directusUrl';
const DIRECTUS_TOKEN_KEY = 'directusToken';
const DEFAULT_DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';

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
    let endpoint = `${url}/items/module_options${queryString ? `?${queryString}` : ''}`;
    
    let headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(endpoint, { headers });
      
      // If unauthorized and no token was used, return demo data
      if (response.status === 401 && !token) {
        console.log('No authentication available. Using sample data.');
        return [{
          id: 1,
          name: 'Demo Options (Not Authenticated)',
          status: 'published',
          description: 'This is demo data because you are not authenticated with Directus'
        }];
      }

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      // If there's a network error and we're not authenticated, also return demo data
      if (!token && (error.message.includes('Failed to fetch') || 
                    error.message.includes('NetworkError') ||
                    error.message.includes('HTTP error 401'))) {
        console.log('Network error or unauthorized. Using sample data.');
        return [{
          id: 1,
          name: 'Demo Options (Not Authenticated)',
          status: 'published',
          description: 'This is demo data because you are not authenticated with Directus'
        }];
      }
      throw error;
    }
  } catch (error) {
    console.error('Error getting module options:', error);
    // Add one more fallback for any unexpected errors if not authenticated
    if (!await getDirectusToken()) {
      console.log('Error occurred but no authentication available. Falling back to sample data.');
      return [{
        id: 1,
        name: 'Demo Options (Not Authenticated)',
        status: 'published',
        description: 'This is demo data because you are not authenticated with Directus'
      }];
    }
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

    // Handle demo data for the demo option
    if (optionsId === 1 && !token) {
      console.log('Using demo items for unauthenticated user');
      return [
        { id: 101, label: 'Red Option', color: '#ff0000', weight: 1 },
        { id: 102, label: 'Green Option', color: '#00ff00', weight: 1 },
        { id: 103, label: 'Blue Option', color: '#0000ff', weight: 1 },
        { id: 104, label: 'Yellow Option', color: '#ffff00', weight: 1 }
      ];
    }

    const queryParams = new URLSearchParams({
      filter: JSON.stringify({ options_id: { _eq: optionsId } }),
    });

    const endpoint = `${url}/items/module_option_items?${queryParams}`;
    
    let headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(endpoint, { headers });

      // If we're requesting items for the demo option but got an unauthorized response,
      // return the demo items
      if (response.status === 401 && !token) {
        // If this is our demo option ID, return mock data
        if (optionsId === 1) {
          console.log('Using demo items for unauthenticated user');
          return [
            { id: 101, label: 'Red Option', color: '#ff0000', weight: 1 },
            { id: 102, label: 'Green Option', color: '#00ff00', weight: 1 },
            { id: 103, label: 'Blue Option', color: '#0000ff', weight: 1 },
            { id: 104, label: 'Yellow Option', color: '#ffff00', weight: 1 }
          ];
        }
        
        console.log('No authentication available. Cannot fetch real items.');
        throw new Error('Authentication required to view items. Please log in.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      // If we're getting items for the demo option and encounter a network error
      if (optionsId === 1 && !token) {
        console.log('Network error loading items for demo option. Using fallback data.');
        return [
          { id: 101, label: 'Red Option', color: '#ff0000', weight: 1 },
          { id: 102, label: 'Green Option', color: '#00ff00', weight: 1 },
          { id: 103, label: 'Blue Option', color: '#0000ff', weight: 1 },
          { id: 104, label: 'Yellow Option', color: '#ffff00', weight: 1 }
        ];
      }
      throw error;
    }
  } catch (error) {
    console.error('Error getting module option items:', error);
    // One final fallback for demo option
    if (optionsId === 1 && !await getDirectusToken()) {
      console.log('Error occurred but using demo data for the demo option.');
      return [
        { id: 101, label: 'Red Option', color: '#ff0000', weight: 1 },
        { id: 102, label: 'Green Option', color: '#00ff00', weight: 1 },
        { id: 103, label: 'Blue Option', color: '#0000ff', weight: 1 },
        { id: 104, label: 'Yellow Option', color: '#ffff00', weight: 1 }
      ];
    }
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
    const token = await getDirectusToken();
    if (token) {
      await recordModuleResult({
        options_id: optionsId,
        result_item_id: selectedItem.id,
        device_info: { platform: 'extension' }
      });
    } else {
      console.log('Demo mode: Result would be recorded if authenticated.');
    }
  } catch (error) {
    // Still return the result even if recording fails
    console.error('Failed to record result, but spin succeeded:', error);
  }

  return selectedItem;
}