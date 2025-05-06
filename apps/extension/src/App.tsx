import React, { useState } from 'react';

import DirectusSettings from './components/DirectusSettings';
import ModuleComponent from './components/ModuleComponent';
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
   * 
   * Per Chrome's security policy, chrome.sidePanel.open() MUST be called directly
   * in response to a user gesture (click) and must specify the tab context.
   */
  const openSidebar = (): void => {
    try {
      // Direct call to chrome.sidePanel.open() in response to user gesture
      if (chrome?.sidePanel?.open && chrome?.tabs?.query) {
        // Get the current tab first
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          try {
            if (tabs && tabs.length > 0 && tabs[0].id) {
              // Get the current tab ID
              const tabId = tabs[0].id;
              console.log('Opening sidepanel with tabId:', tabId);
              
              // IMPORTANT: Always specify tabId when opening side panel
              await chrome.sidePanel.open({ tabId });
              console.log('Side panel opened successfully with tabId');
              
              // Close the popup window after opening the side panel
              window.close();
            } else {
              // If we couldn't get a tab ID, try with current window
              const currentWindow = await new Promise<chrome.windows.Window | undefined>(resolve => {
                if (chrome?.windows?.getCurrent) {
                  chrome.windows.getCurrent(resolve);
                } else {
                  resolve(undefined);
                }
              });
              
              if (currentWindow?.id) {
                const windowId = currentWindow.id;
                console.log('Opening sidepanel with windowId:', windowId);
                await chrome.sidePanel.open({ windowId });
                console.log('Side panel opened successfully with windowId');
                
                // Close the popup window after opening the side panel
                window.close();
              } else {
                console.error('Neither tab ID nor window ID available');
                openSidePanelFallback();
              }
            }
          } catch (error) {
            console.error('Failed to open side panel:', error);
            openSidePanelFallback();
          }
        });
      } else {
        console.warn('Side panel API not available, falling back to popup');
        openSidePanelFallback();
      }
    } catch (error) {
      console.error('Error in sidepanel opener:', error);
      openSidePanelFallback();
    }
  };
  
  /**
   * Fallback function to open sidepanel in a new window
   */
  const openSidePanelFallback = (): void => {
    window.open(
      chrome?.runtime?.getURL ? chrome.runtime.getURL('sidepanel.html') : 'sidepanel.html', 
      '_blank', 
      'width=400,height=600,resizable=yes'
    );
  };

  /**
   * If not authenticated and on the module tab, show sign-in prompt
   */
  const renderAuthPrompt = (): JSX.Element => (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
      <div className="py-8 text-center">
        <svg className="mx-auto mb-6 size-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-white">Authentication Required</h2>
        <p className="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-300">
          You need to connect to Directus to use the module functionality.
          Please go to Settings to configure your connection.
        </p>
        <button 
          onClick={() => setActiveTab('settings')}
          className="mx-2 rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Go to Settings
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className="mx-2 rounded-md bg-gray-200 px-6 py-2 text-gray-800 transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
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
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">About This Extension</h2>
      <div className="prose dark:prose-invert">
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          This browser extension is built with the Turbo Modern Starter monorepo, showcasing modern web development practices in a unified workflow.
        </p>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          It demonstrates integration with Directus CMS to power the module functionality, allowing you to:
        </p>
        <ul className="mb-4 list-disc pl-5 text-gray-600 dark:text-gray-300">
          <li>Connect to a Directus instance</li>
          <li>Load module options from the CMS</li>
          <li>Interact with dynamic content</li>
          <li>Experience a seamless fallback to demo mode when offline</li>
        </ul>
        <p className="mt-6 border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Version 0.0.1 | © 2025 Turbo Modern Starter
        </p>
      </div>
    </div>
  );

  // Loading state
  if (isLoading && activeTab === 'module') {
    return (
      <div className="min-h-[360px] w-full bg-gray-100 p-4 text-gray-800 transition-colors duration-150 dark:bg-gray-900 dark:text-gray-200">
        <h1 className="mb-4 text-center text-xl font-bold">Turbo Modern Starter</h1>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex min-h-32 items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <svg className="mb-4 size-8 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 dark:text-gray-300">Checking authentication status...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[360px] w-full bg-gray-100 p-4 text-gray-800 transition-colors duration-150 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="mb-4 text-center text-xl font-bold">Turbo Modern Starter</h1>
      
      {/* Container with card styling */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        {/* Tab Navigation */}
        <div className="mb-4 flex border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === 'module'
                ? 'border-b-2 border-blue-500 font-medium text-blue-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('module')}
          >
            Module
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'settings'
                ? 'border-b-2 border-blue-500 font-medium text-blue-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button
            className={`px-4 py-2 ${
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
        <div className="mb-4 flex space-x-2">
          <button 
            onClick={openOptionsPage}
            className="flex flex-1 items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <svg className="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Options
          </button>
          <button 
            onClick={openSidebar}
            className="flex flex-1 items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <svg className="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
            Open Side Panel
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="tab-content">
          <div key="module-tab" className={activeTab === 'module' ? 'block' : 'hidden'}>
            {isAuthenticated ? <ModuleComponent /> : renderAuthPrompt()}
          </div>
          
          <div key="settings-tab" className={activeTab === 'settings' ? 'block' : 'hidden'}>
            <DirectusSettings />
          </div>
          
          <div key="about-tab" className={activeTab === 'about' ? 'block' : 'hidden'}>
            {renderAbout()}
          </div>
        </div>
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