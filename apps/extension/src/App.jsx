import React, { useState } from 'react';
import ModuleComponent from './components/ModuleComponent';
import DirectusSettings from './components/DirectusSettings';

function App() {
  const [activeTab, setActiveTab] = useState('module');

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 dark:text-white">
      <h1 className="mb-4 text-center text-xl font-bold">Turbo Modern Starter</h1>
      
      {/* Tab Navigation */}
      <div className="mb-4 flex border-b">
        <button
          className={`py-2 px-4 ${
            activeTab === 'module'
              ? 'border-b-2 border-blue-500 font-medium text-blue-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('module')}
        >
          Module
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'settings'
              ? 'border-b-2 border-blue-500 font-medium text-blue-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'about'
              ? 'border-b-2 border-blue-500 font-medium text-blue-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'module' && <ModuleComponent />}
        
        {activeTab === 'settings' && <DirectusSettings />}
        
        {activeTab === 'about' && (
          <div className="p-4">
            <h2 className="mb-2 text-lg font-semibold">About This Extension</h2>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
              This browser extension is built with the Turbo Modern Starter monorepo.
            </p>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
              It demonstrates integration with Directus CMS to power the module functionality.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Version 0.0.1
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;