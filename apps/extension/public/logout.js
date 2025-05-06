/**
 * Standalone script to handle logout functionality
 * This is used in the options.html and sidepanel.html pages
 */

// Constants
const DIRECTUS_TOKEN_KEY = 'directusToken';

// Get storage area to use (sync or local)
function getStorageArea() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return chrome.storage.sync || chrome.storage.local;
  }
  return null;
}

// Set a value in storage
async function setStorageValue(key, value) {
  return new Promise((resolve) => {
    const storage = getStorageArea();
    if (storage) {
      storage.set({ [key]: value }, () => {
        resolve(value);
      });
    } else {
      // Development fallback - using localStorage
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
      resolve(value);
    }
  });
}

// Get a value from storage
async function getStorageValue(key) {
  return new Promise((resolve) => {
    const storage = getStorageArea();
    if (storage) {
      storage.get([key], (result) => {
        resolve(result[key] || null);
      });
    } else {
      // Development fallback - using localStorage
      try {
        const item = localStorage.getItem(key);
        resolve(item ? JSON.parse(item) : null);
      } catch (e) {
        resolve(null);
      }
    }
  });
}

// Clear the Directus token (logout)
async function clearDirectusToken() {
  try {
    await setStorageValue(DIRECTUS_TOKEN_KEY, null);
    return true;
  } catch (error) {
    console.error('Error clearing Directus token:', error);
    return false;
  }
}

// Check if user is authenticated
async function isAuthenticated() {
  const token = await getStorageValue(DIRECTUS_TOKEN_KEY);
  return !!token;
}

// For use in the global scope of HTML pages
window.directusHelpers = {
  clearDirectusToken,
  getStorageValue,
  setStorageValue,
  isAuthenticated
};