/**
 * StorageService - A service for managing Chrome extension storage
 * 
 * This service provides a consistent interface for working with Chrome's storage API
 * across popup, options page, and side panel. It handles fallbacks for development
 * environment and provides type-safe access to stored settings.
 */

// Define types for the extension settings
export interface ExtensionSettings {
  // Theme settings
  darkMode: boolean;
  themePreference: 'light' | 'dark' | 'system';
  
  // Notification settings
  notifications: boolean;
  autoRefresh: boolean;
  
  // Account settings
  isLoggedIn: boolean;
  
  // Advanced settings
  debugging: boolean;
  syncFrequency: boolean;

  // Add any additional settings here with proper types
  [key: string]: unknown; // Allow additional string-indexed properties
}

// Define the default settings with types
export const DEFAULT_SETTINGS: ExtensionSettings = {
  // Theme settings
  darkMode: false,
  themePreference: 'light',
  
  // Notification settings
  notifications: true,
  autoRefresh: false,
  
  // Account settings
  isLoggedIn: false,
  
  // Advanced settings
  debugging: false,
  syncFrequency: false
};

// Determine if we should use sync or local storage
const shouldUseSync = true; // Set to false to force local storage

// Type for the chrome storage change events
type StorageChangeListener = (changes: { [key: string]: chrome.storage.StorageChange }) => void;

class StorageService {
  private memoryStorage: ExtensionSettings;
  private listeners: Map<string, StorageChangeListener[]>;
  private storageArea: 'sync' | 'local';

  constructor() {
    // In-memory fallback for when chrome.storage is not available (development mode)
    this.memoryStorage = { ...DEFAULT_SETTINGS };
    this.listeners = new Map();
    
    // Determine which storage area to use
    this.storageArea = shouldUseSync ? 'sync' : 'local';
    
    // If in a browser extension environment, set up the storage change listener
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === this.storageArea) {
          this.notifyListeners(changes);
        }
      });
    }
  }

  /**
   * Get storage area to use (sync or local)
   * @private
   */
  private getStorageArea(): chrome.storage.LocalStorageArea | chrome.storage.SyncStorageArea {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return this.storageArea === 'sync' ? chrome.storage.sync : chrome.storage.local;
    }
    return null;
  }

  /**
   * Notify registered listeners of storage changes
   * @private
   */
  private notifyListeners(changes: { [key: string]: chrome.storage.StorageChange }): void {
    const changedKeys = Object.keys(changes);
    
    // Notify general listeners
    const generalListeners = this.listeners.get('*') || [];
    generalListeners.forEach(listener => listener(changes));
    
    // Notify specific key listeners
    changedKeys.forEach(key => {
      const keyListeners = this.listeners.get(key) || [];
      const change = { [key]: changes[key] };
      keyListeners.forEach(listener => listener(change));
    });
  }

  /**
   * Subscribe to storage changes
   * @param key - Specific key to listen for or '*' for all changes
   * @param callback - Function to call when storage changes
   * @returns Unsubscribe function
   */
  public subscribe(key: string, callback: StorageChangeListener): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    
    this.listeners.get(key).push(callback);
    
    // Return unsubscribe function
    return () => {
      const keyListeners = this.listeners.get(key) || [];
      const index = keyListeners.indexOf(callback);
      if (index !== -1) {
        keyListeners.splice(index, 1);
      }
    };
  }

  /**
   * Get a value or multiple values from storage
   * @param keys - Key(s) to retrieve from storage
   * @returns Promise resolving to object containing the requested values
   */
  public async get<T extends keyof ExtensionSettings>(
    keys: T | T[] | Partial<ExtensionSettings> | null
  ): Promise<Partial<ExtensionSettings>> {
    return new Promise((resolve) => {
      const storage = this.getStorageArea();
      if (storage) {
        storage.get(keys as unknown, (result) => {
          resolve(result as Partial<ExtensionSettings>);
        });
      } else {
        // Development fallback
        if (Array.isArray(keys)) {
          const result: Partial<ExtensionSettings> = {};
          keys.forEach(key => {
            result[key] = this.memoryStorage[key];
          });
          resolve(result);
        } else if (typeof keys === 'string') {
          resolve({ [keys]: this.memoryStorage[keys] } as Partial<ExtensionSettings>);
        } else if (keys && typeof keys === 'object') {
          const result: Partial<ExtensionSettings> = {};
          Object.keys(keys).forEach(key => {
            const typedKey = key as keyof ExtensionSettings;
            result[typedKey] = this.memoryStorage[typedKey] ?? keys[typedKey];
          });
          resolve(result);
        } else {
          resolve({ ...this.memoryStorage });
        }
      }
    });
  }

  /**
   * Set value(s) in storage
   * @param items - Key-value pairs to store
   * @returns Promise that resolves when the operation is complete
   */
  public async set(items: Partial<ExtensionSettings>): Promise<void> {
    return new Promise((resolve) => {
      const storage = this.getStorageArea();
      if (storage) {
        storage.set(items, () => {
          resolve();
        });
      } else {
        // Development fallback
        Object.assign(this.memoryStorage, items);
        
        // Simulate change notification in development
        const changes: { [key: string]: chrome.storage.StorageChange } = {};
        Object.keys(items).forEach(key => {
          changes[key] = {
            newValue: items[key as keyof ExtensionSettings],
            oldValue: this.memoryStorage[key as keyof ExtensionSettings]
          };
        });
        
        this.notifyListeners(changes);
        resolve();
      }
    });
  }

  /**
   * Remove item(s) from storage
   * @param keys - Key(s) to remove
   * @returns Promise that resolves when the operation is complete
   */
  public async remove<T extends keyof ExtensionSettings>(keys: T | T[]): Promise<void> {
    return new Promise((resolve) => {
      const storage = this.getStorageArea();
      if (storage) {
        storage.remove(keys as string | string[], () => {
          resolve();
        });
      } else {
        // Development fallback
        if (Array.isArray(keys)) {
          const changes: { [key: string]: chrome.storage.StorageChange } = {};
          keys.forEach(key => {
            changes[key as string] = {
              oldValue: this.memoryStorage[key],
              newValue: undefined
            };
            delete this.memoryStorage[key];
          });
          this.notifyListeners(changes);
        } else {
          const changes: { [key: string]: chrome.storage.StorageChange } = {
            [keys as string]: {
              oldValue: this.memoryStorage[keys],
              newValue: undefined
            }
          };
          delete this.memoryStorage[keys];
          this.notifyListeners(changes);
        }
        resolve();
      }
    });
  }

  /**
   * Clear all storage
   * @returns Promise that resolves when the operation is complete
   */
  public async clear(): Promise<void> {
    return new Promise((resolve) => {
      const storage = this.getStorageArea();
      if (storage) {
        storage.clear(() => {
          resolve();
        });
      } else {
        // Development fallback
        const oldStorage = { ...this.memoryStorage };
        this.memoryStorage = { ...DEFAULT_SETTINGS };
        
        // Simulate change notification
        const changes: { [key: string]: chrome.storage.StorageChange } = {};
        Object.keys(oldStorage).forEach(key => {
          changes[key] = {
            oldValue: oldStorage[key as keyof ExtensionSettings],
            newValue: undefined
          };
        });
        
        this.notifyListeners(changes);
        resolve();
      }
    });
  }

  /**
   * Reset all settings to defaults
   * @returns Promise that resolves when the operation is complete
   */
  public async resetToDefaults(): Promise<void> {
    return this.set(DEFAULT_SETTINGS);
  }

  /**
   * Synchronize settings between devices (when using sync storage)
   * This is automatically handled by Chrome when using sync storage,
   * but this method can be used to force a sync or handle custom logic
   */
  public async synchronize(): Promise<void> {
    // If we're not using sync storage, just return
    if (this.storageArea !== 'sync' || !chrome?.storage?.sync) {
      return;
    }

    try {
      // Get all current settings and force a sync by writing them back
      // This is a no-op if settings haven't changed but can trigger sync if needed
      const currentSettings = await this.get(null);
      await this.set(currentSettings);
    } catch (error) {
      console.error('Failed to synchronize settings:', error);
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();