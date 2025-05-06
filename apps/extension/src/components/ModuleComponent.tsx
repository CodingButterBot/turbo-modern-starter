import React, { useState, useEffect, ChangeEvent } from 'react';
import { 
  getModuleOptions, 
  getModuleOptionItems, 
  spinWheel,
  DirectusModule,
  DirectusModuleItem
} from '../lib/directus-client';
import { useAuth } from '../contexts/AuthContext';
import AuthCheck from './AuthCheck';

/**
 * Module Component for the extension
 * Allows users to select options and spin the wheel
 */
const ModuleComponent: React.FC = () => {
  const [options, setOptions] = useState<DirectusModule[]>([]);
  const [items, setItems] = useState<DirectusModuleItem[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [result, setResult] = useState<DirectusModuleItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  // Load module options on mount
  useEffect(() => {
    const fetchOptions = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Only get published options
        const optionsData = await getModuleOptions({
          filter: { status: { _eq: 'published' } }
        });

        // Check if we're using demo data by looking at the first option
        if (optionsData.length === 1 && optionsData[0].id === 1 && 
            optionsData[0].name === 'Demo Options (Not Authenticated)') {
          setIsDemo(true);
        } else {
          setIsDemo(false);
        }

        setOptions(optionsData);
      } catch (err) {
        console.error('Error fetching module options:', err);
        setError('We couldn\'t load your module options. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // Load items when option is selected
  useEffect(() => {
    if (!selectedOptionId) {
      setItems([]);
      return;
    }

    const fetchItems = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        setResult(null);

        const itemsData = await getModuleOptionItems(selectedOptionId);
        setItems(itemsData);
      } catch (err) {
        console.error('Error fetching module option items:', err);
        
        // Special handling for demo mode
        if (isDemo && selectedOptionId === 1) {
          // For demo mode with ID 1, we'll try to use demo items even on error
          try {
            const demoItems = await getModuleOptionItems(1);
            setItems(demoItems);
            return;
          } catch (innerError) {
            console.error('Failed to fetch demo items as fallback:', innerError);
          }
        }
        
        setError('Could not load items for this option. Please try another selection.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedOptionId, isDemo]);

  // Handle option selection
  const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const id = parseInt(e.target.value, 10);
    setSelectedOptionId(isNaN(id) ? null : id);
  };

  // Handle spin button click
  const handleSpin = async (): Promise<void> => {
    if (!selectedOptionId || !items.length) return;

    try {
      setSpinning(true);
      setError(null);

      const resultItem = await spinWheel(items, selectedOptionId);
      setResult(resultItem);
    } catch (err) {
      console.error('Error spinning wheel:', err);
      setError('There was a problem spinning the wheel. Please try again.');
    } finally {
      setSpinning(false);
    }
  };

  const DemoModeNotice: React.FC = () => {
    if (!isDemo) return null;
    
    return (
      <div className="p-3 mb-4 text-sm text-blue-700 bg-blue-100 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <div>
            <p className="font-medium">Demo Mode Active</p>
            <p className="mt-1">You're using sample data. <button onClick={() => window.location.href = 'options.html'} className="font-medium underline">Log in</button> to access your Directus data.</p>
          </div>
        </div>
      </div>
    );
  };

  const ModuleContent: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4 dark:text-white">Module Demo</h2>

      <DemoModeNotice />

      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg flex items-start">
          <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 dark:text-gray-300">
          Select Options:
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={selectedOptionId || ''}
          onChange={handleOptionChange}
          disabled={loading || options.length === 0}
        >
          <option value="">-- Select Options --</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <button
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSpin}
        disabled={spinning || !selectedOptionId || items.length === 0}
      >
        {spinning ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Spinning...
          </span>
        ) : (
          'Spin the Wheel'
        )}
      </button>

      {result && (
        <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-center">
          <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-200">Result:</h3>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{result.label}</p>
          {result.color && (
            <div
              className="w-6 h-6 mx-auto mt-3 rounded-full shadow-inner"
              style={{ backgroundColor: result.color }}
            ></div>
          )}
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      )}
    </div>
  );

  return (
    <AuthCheck>
      <ModuleContent />
    </AuthCheck>
  );
};

export default ModuleComponent;