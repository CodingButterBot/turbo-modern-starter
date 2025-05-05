import React, { useState, useEffect } from 'react';
import { getModuleOptions, getModuleOptionItems, spinWheel } from '../lib/directus-client';

/**
 * Module Component for the extension
 * Allows users to select options and spin the wheel
 */
const ModuleComponent = () => {
  const [options, setOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  // Load module options on mount
  useEffect(() => {
    const fetchOptions = async () => {
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
        setError('Failed to load options from Directus');
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

    const fetchItems = async () => {
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
        
        setError('Failed to load items from Directus');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedOptionId, isDemo]);

  // Handle option selection
  const handleOptionChange = (e) => {
    const id = parseInt(e.target.value, 10);
    setSelectedOptionId(isNaN(id) ? null : id);
  };

  // Handle spin button click
  const handleSpin = async () => {
    if (!selectedOptionId || !items.length) return;

    try {
      setSpinning(true);
      setError(null);

      const resultItem = await spinWheel(items, selectedOptionId);
      setResult(resultItem);
    } catch (err) {
      console.error('Error spinning wheel:', err);
      setError('Failed to spin the wheel');
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Module Demo</h2>

      {isDemo && (
        <div className="p-2 mb-4 text-sm text-blue-700 bg-blue-100 rounded-md">
          Running in demo mode. Log in via Settings to access your Directus data.
        </div>
      )}

      {error && (
        <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Select Options:
        </label>
        <select
          className="w-full p-2 border rounded"
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
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSpin}
        disabled={spinning || !selectedOptionId || items.length === 0}
      >
        {spinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>

      {result && (
        <div className="mt-4 p-3 border border-dashed rounded-md text-center">
          <h3 className="font-medium mb-1">Result:</h3>
          <p className="text-lg font-bold">{result.label}</p>
          {result.color && (
            <div
              className="w-4 h-4 mx-auto mt-2 rounded-full"
              style={{ backgroundColor: result.color }}
            ></div>
          )}
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Loading...
        </div>
      )}
    </div>
  );
};

export default ModuleComponent;