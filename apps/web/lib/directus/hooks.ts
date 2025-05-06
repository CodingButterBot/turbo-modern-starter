/**
 * Directus Hooks
 * 
 * React hooks for working with Directus data in the web app
 */
import { useEffect, useState, useCallback } from 'react';
import { ModuleOption, ModuleOptionItem, ModuleResult, QueryParams } from '@repo/directus-client';
import { getDirectusClient } from './client';

/**
 * Hook for fetching module options
 * @param params Query parameters
 * @returns Module options data and loading state
 */
export function useModuleOptions(params?: QueryParams<ModuleOption>) {
  const [options, setOptions] = useState<ModuleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const client = getDirectusClient();
        await client.authenticate();
        
        const { data } = await client.getModuleOptions(params);
        setOptions(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch module options'));
        console.error('Error fetching module options:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOptions();
  }, [params]);
  
  return { options, loading, error };
}

/**
 * Hook for fetching a single module option
 * @param id Module option ID
 * @returns Module option data and loading state
 */
export function useModuleOption(id: number) {
  const [option, setOption] = useState<ModuleOption | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchOption = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const client = getDirectusClient();
        await client.authenticate();
        
        const { data } = await client.getModuleOption(id);
        setOption(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch module option with ID ${id}`));
        console.error(`Error fetching module option with ID ${id}:`, err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOption();
  }, [id]);
  
  return { option, loading, error };
}

/**
 * Hook for fetching module option items by options ID
 * @param optionsId Module options ID
 * @returns Module option items and loading state
 */
export function useModuleOptionItems(optionsId: number) {
  const [items, setItems] = useState<ModuleOptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchItems = async () => {
      if (!optionsId) return;
      
      try {
        setLoading(true);
        const client = getDirectusClient();
        await client.authenticate();
        
        const { data } = await client.getItemsByOptionsId(optionsId);
        setItems(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(`Failed to fetch items for options ID ${optionsId}`));
        console.error(`Error fetching items for options ID ${optionsId}:`, err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [optionsId]);
  
  return { items, loading, error };
}

/**
 * Hook for recording module results
 * @returns Function to record a result and loading state
 */
export function useRecordModuleResult() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const recordResult = useCallback(async (result: ModuleResult) => {
    try {
      setLoading(true);
      const client = getDirectusClient();
      await client.authenticate();
      
      const { data } = await client.recordModuleResult(result);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to record module result'));
      console.error('Error recording module result:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { recordResult, loading, error };
}

/**
 * Hook for spinning the wheel and recording the result
 * @param optionsId Module options ID
 * @returns Spin function, result, and loading state
 */
export function useModuleSpin(optionsId: number) {
  const { items, loading: itemsLoading } = useModuleOptionItems(optionsId);
  const { recordResult, loading: recordLoading } = useRecordModuleResult();
  const [result, setResult] = useState<ModuleOptionItem | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const spin = useCallback(async () => {
    if (itemsLoading || !items.length) {
      return null;
    }
    
    try {
      setSpinning(true);
      
      // Implement weighted random selection
      const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
      let random = Math.random() * totalWeight;
      
      let selectedItem: ModuleOptionItem | null = null;
      
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
      
      setResult(selectedItem);
      
      // Record the result in Directus
      try {
        await recordResult({
          options_id: optionsId,
          result_item_id: selectedItem.id!,
          device_info: { platform: 'web' }
        });
      } catch (recordError) {
        // Still return the result even if recording fails
        console.error('Failed to record result, but spin succeeded:', recordError);
      }
      
      return selectedItem;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to spin the wheel'));
      console.error('Error spinning wheel:', err);
      return null;
    } finally {
      setSpinning(false);
    }
  }, [items, itemsLoading, optionsId, recordResult]);
  
  const loading = itemsLoading || recordLoading || spinning;
  
  return { spin, result, loading, error };
}