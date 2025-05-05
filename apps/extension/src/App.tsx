import React, { useState } from 'react';
import ModuleComponent from './components/ModuleComponent';
import DirectusSettings from './components/DirectusSettings';
import { AuthProvider, useAuth } from './contexts/AuthContext';

/**
 * Internal App component that uses the auth context
 */
const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'module' | 'settings' | 'about'>('module');
  const { isAuthenticated, isLoading } = useAuth();

  /**
   * Function to open options page
   */
  const openOptionsPage = (): void => {
    if (chrome?.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      // Fallback for development environment
      window.open(chrome?.runtime?.getURL ? chrome.runtime.getURL('options.html') : 'options.html');
    }
  };

  /**
   * Function to open sidebar
   */
  const openSidebar = (): void => {
    try {
      // Always use the messaging approach - more reliable
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({ type: 'OPEN_SIDEPANEL' }, (response) => {
          // Handle response from background script
          if (!response || !response.success) {
            const errorMsg = (response as { error?: string })?.error || 'Unknown error';
            console.error('Error opening side panel:', errorMsg);
            
            // Fallback to opening in a new window
            window.open(chrome?.runtime?.getURL ? 
              chrome.runtime.getURL('sidepanel.html') : 'sidepanel.html', 
              '_blank', 
              'width=400,height=600,resizable=yes');
          }
        });
      } else {
        // Fallback for development environment
        window.open('sidepanel.html', '_blank', 'width=400,height=600,resizable=yes');
      }
    } catch (error) {
      console.error('Error opening sidepanel:', error);
      // Last-resort fallback
      window.open('sidepanel.html', '_blank', 'width=400,height=600,resizable=yes');
    }
  };

  /**
   * If not authenticated and on the module tab, show sign-in prompt
   */
  const renderAuthPrompt = (): JSX.Element => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="text-center py-8">
        <svg className="h-16 w-16 text-blue-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Authentication Required</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
          You need to connect to Directus to use the module functionality.
          Please go to Settings to configure your connection.
        </p>
        <button 
          onClick={() => setActiveTab('settings')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition mx-2"
        >
          Go to Settings
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className="px-6 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition mx-2"
        >
          Learn More
        </button>
      </div>
    </div>
  );

  /**
   * About section
   */
  const renderAbout = (): JSX.Element => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">About This Extension</h2>
      <div className="prose dark:prose-invert">
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          This browser extension is built with the Turbo Modern Starter monorepo, showcasing modern web development practices in a unified workflow.
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          It demonstrates integration with Directus CMS to power the module functionality, allowing you to:
        </p>
        <ul className="list-disc pl-5 mb-4 text-gray-600 dark:text-gray-300">
          <li>Connect to a Directus instance</li>
          <li>Load module options from the CMS</li>
          <li>Interact with dynamic content</li>
          <li>Experience a seamless fallback to demo mode when offline</li>
        </ul>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          Version 0.0.1 | © 2025 Turbo Modern Starter
        </p>
      </div>
    </div>
  );

  // Loading state
  if (isLoading && activeTab === 'module') {
    return (
      <div className="mx-auto max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="min-h-32 flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-300">Checking authentication status...</p>
          </div>
        </div>
      </div>
    );
  }

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
      
      {/* Quick Access Buttons */}
      <div className="flex mb-4 space-x-2">
        <button 
          onClick={openOptionsPage}
          className="flex-1 py-2 px-3 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Options
        </button>
        <button 
          onClick={openSidebar}
          className="flex-1 py-2 px-3 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          Open Side Panel
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'module' && (
          isAuthenticated ? <ModuleComponent /> : renderAuthPrompt()
        )}
        
        {activeTab === 'settings' && <DirectusSettings />}
        
        {activeTab === 'about' && renderAbout()}
      </div>
    </div>
  );
};

/**
 * Wrapper component that provides the auth context
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;