/**
 * Directus API Client
 * 
 * A typed client for interacting with the Directus API
 */
import { createDirectus, rest, authentication, readItems, createItem, updateItem, deleteItem } from '@directus/sdk';
import { 
  DirectusClientConfig,
  ModuleOption, 
  ModuleOptionItem, 
  ModuleResult, 
  UserPreference,
  QueryParams,
  DirectusResponse
} from './types';

export class DirectusClient {
  private client: ReturnType<typeof createDirectus>;
  private authenticated = false;
  private config: DirectusClientConfig;

  constructor(config: DirectusClientConfig) {
    this.config = config;
    
    // Initialize the Directus SDK client
    this.client = createDirectus(config.url)
      .with(rest())
      .with(authentication());
  }

  /**
   * Authenticate with the Directus API
   * @returns Promise resolving to authentication success
   */
  async authenticate(): Promise<boolean> {
    try {
      if (this.config.token) {
        // Static token authentication
        await this.client.setToken(this.config.token);
      } else if (this.config.email && this.config.password) {
        // Email/password authentication
        await this.client.login(this.config.email, this.config.password);
      } else {
        throw new Error('Authentication requires either a token or email/password');
      }
      
      this.authenticated = true;
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      this.authenticated = false;
      throw error;
    }
  }

  /**
   * Ensure client is authenticated
   */
  private async ensureAuthentication(): Promise<void> {
    if (!this.authenticated) {
      await this.authenticate();
    }
  }

  // Module Options API

  /**
   * Get module options
   * @param params Query parameters
   * @returns Promise resolving to module options
   */
  async getModuleOptions(params?: QueryParams<ModuleOption>): Promise<DirectusResponse<ModuleOption[]>> {
    await this.ensureAuthentication();
    
    try {
      const data = await this.client.request(
        readItems('module_options', params)
      );
      
      return { data };
    } catch (error) {
      console.error('Error retrieving module options:', error);
      throw error;
    }
  }

  /**
   * Get a single module option by ID
   * @param id Module option ID
   * @returns Promise resolving to module option
   */
  async getModuleOption(id: number): Promise<DirectusResponse<ModuleOption>> {
    await this.ensureAuthentication();
    
    try {
      const data = await this.client.request(
        readItems('module_options', {
          filter: { id: { _eq: id } },
          limit: 1
        })
      );
      
      if (!data || data.length === 0) {
        throw new Error(`Module option with ID ${id} not found`);
      }
      
      return { data: data[0] };
    } catch (error) {
      console.error(`Error retrieving module option with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new module option
   * @param option Module option data
   * @returns Promise resolving to created module option
   */
  async createModuleOption(option: ModuleOption): Promise<DirectusResponse<ModuleOption>> {
    await this.ensureAuthentication();
    
    try {
      const data = await this.client.request(
        createItem('module_options', option)
      );
      
      return { data };
    } catch (error) {
      console.error('Error creating module option:', error);
      throw error;
    }
  }

  /**
   * Update a module option
   * @param id Module option ID
   * @param option Module option data to update
   * @returns Promise resolving to updated module option
   */
  async updateModuleOption(id: number, option: Partial<ModuleOption>): Promise<DirectusResponse<ModuleOption>> {
    await this.ensureAuthentication();
    
    try {
      const data = await this.client.request(
        updateItem('module_options', id, option)
      );
      
      return { data };
    } catch (error) {
      console.error(`Error updating module option with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a module option
   * @param id Module option ID
   * @returns Promise resolving to boolean indicating success
   */
  async deleteModuleOption(id: number): Promise<boolean> {
    await this.ensureAuthentication();
    
    try {
      await this.client.request(
        deleteItem('module_options', id)
      );
      
      return true;
    } catch (error) {
      console.error(`Error deleting module option with ID ${id}:`, error);
      throw error;
    }
  }

  // Module Option Items API

  /**
   * Get module option items
   * @param params Query parameters
   * @returns Promise resolving to module option items
   */
  async getModuleOptionItems(params?: QueryParams<ModuleOptionItem>): Promise<DirectusResponse<ModuleOptionItem[]>> {
    await this.ensureAuthentication();
    
    try {
      const data = await this.client.request(
        readItems('module_option_items', params)
      );
      
      return { data };
    } catch (error) {
      console.error('Error retrieving module option items:', error);
      throw error;
    }
  }

  /**
   * Get module option items for a specific options set
   * @param optionsId Module options ID
   * @returns Promise resolving to module option items
   */
  async getItemsByOptionsId(optionsId: number): Promise<DirectusResponse<ModuleOptionItem[]>> {
    return this.getModuleOptionItems({
      filter: { options_id: { _eq: optionsId } }
    });
  }

  /**
   * Create a new module option item
   * @param item Module option item data
   * @returns Promise resolving to created module option item
   */
  async createModuleOptionItem(item: ModuleOptionItem): Promise<DirectusResponse<ModuleOptionItem>> {
    await this.ensureAuthentication();
    
    try {
      const data = await this.client.request(
        createItem('module_option_items', item)
      );
      
      return { data };
    } catch (error) {
      console.error('Error creating module option item:', error);
      throw error;
    }
  }

  /**
   * Update a module option item
   * @param id Module option item ID
   * @param item Module option item data to update
   * @returns Promise resolving to updated module option item
   */
  async updateModuleOptionItem(id: number, item: Partial<ModuleOptionItem>): Promise<DirectusResponse<ModuleOptionItem>> {
    await this.ensureAuthentication();
    
    try {
      const data = await this.client.request(
        updateItem('module_option_items', id, item)
      );
      
      return { data };
    } catch (error) {
      console.error(`Error updating module option item with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a module option item
   * @param id Module option item ID
   * @returns Promise resolving to boolean indicating success
   */
  async deleteModuleOptionItem(id: number): Promise<boolean> {
    await this.ensureAuthentication();
    
    try {
      await this.client.request(
        deleteItem('module_option_items', id)
      );
      
      return true;
    } catch (error) {
      console.error(`Error deleting module option item with ID ${id}:`, error);
      throw error;
    }
  }

  // Module Results API

  /**
   * Record a new module result
   * @param result Module result data
   * @returns Promise resolving to created module result
   */
  async recordModuleResult(result: ModuleResult): Promise<DirectusResponse<ModuleResult>> {
    await this.ensureAuthentication();
    
    try {
      const data = await this.client.request(
        createItem('module_results', result)
      );
      
      return { data };
    } catch (error) {
      console.error('Error recording module result:', error);
      throw error;
    }
  }

  /**
   * Get module results
   * @param params Query parameters
   * @returns Promise resolving to module results
   */
  async getModuleResults(params?: QueryParams<ModuleResult>): Promise<DirectusResponse<ModuleResult[]>> {
    await this.ensureAuthentication();
    
    try {
      const data = await this.client.request(
        readItems('module_results', params)
      );
      
      return { data };
    } catch (error) {
      console.error('Error retrieving module results:', error);
      throw error;
    }
  }

  // User Preferences API

  /**
   * Get user preferences
   * @param userId User ID
   * @returns Promise resolving to user preferences
   */
  async getUserPreferences(userId: string): Promise<DirectusResponse<UserPreference>> {
    await this.ensureAuthentication();
    
    try {
      const data = await this.client.request(
        readItems('user_preferences', {
          filter: { user_id: { _eq: userId } },
          limit: 1
        })
      );
      
      if (!data || data.length === 0) {
        throw new Error(`User preferences for user ${userId} not found`);
      }
      
      return { data: data[0] };
    } catch (error) {
      console.error(`Error retrieving user preferences for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Create or update user preferences
   * @param preferences User preferences data
   * @returns Promise resolving to created/updated user preferences
   */
  async saveUserPreferences(preferences: UserPreference): Promise<DirectusResponse<UserPreference>> {
    await this.ensureAuthentication();
    
    try {
      // Check if preferences already exist
      try {
        const existing = await this.getUserPreferences(preferences.user_id);
        
        if (existing.data) {
          // Update existing
          const data = await this.client.request(
            updateItem('user_preferences', existing.data.id!, preferences)
          );
          
          return { data };
        }
      } catch (error) {
        // Preferences don't exist yet, will create new
      }
      
      // Create new preferences
      const data = await this.client.request(
        createItem('user_preferences', preferences)
      );
      
      return { data };
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }
}