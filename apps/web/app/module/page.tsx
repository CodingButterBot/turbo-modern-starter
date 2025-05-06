'use client';

import { useState } from 'react';
import { useModuleOptions, useModuleSpin } from '../../lib/directus';

export default function ModulePage() {
  const { options, loading: optionsLoading } = useModuleOptions({
    filter: { status: { _eq: 'published' } }
  });
  
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const { spin, result, loading: spinLoading } = useModuleSpin(selectedOptionId || 0);
  
  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10);
    setSelectedOptionId(id || null);
  };
  
  const handleSpin = async () => {
    if (!selectedOptionId) return;
    await spin();
  };
  
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Module Demo</h1>
      
      <div className="mb-8 max-w-md">
        <p className="mb-4 text-gray-600">
          This page demonstrates the integration with Directus CMS. It allows you to select
          a module option set and spin the wheel to get a random result.
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Module Options:
          </label>
          
          <select
            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={selectedOptionId || ''}
            onChange={handleOptionChange}
            disabled={optionsLoading}
          >
            <option value="">-- Select options --</option>
            {options.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          
          {optionsLoading && <p className="mt-2 text-sm text-gray-500">Loading options...</p>}
        </div>
        
        <button
          onClick={handleSpin}
          disabled={!selectedOptionId || spinLoading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {spinLoading ? 'Spinning...' : 'Spin the Wheel'}
        </button>
        
        {result && (
          <div className="mt-6 p-4 border border-dashed border-gray-400 rounded text-center">
            <h3 className="text-lg font-medium mb-1">Result:</h3>
            <p className="text-xl font-bold">{result.label}</p>
            {result.color && (
              <div 
                className="w-6 h-6 mx-auto mt-2 rounded-full" 
                style={{ backgroundColor: result.color }}
              ></div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}