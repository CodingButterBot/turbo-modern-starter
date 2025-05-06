import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import ModuleComponent from './components/ModuleComponent';
import AuthCheck from './components/AuthCheck';
import './index.css';

// Side panel component
const SidePanel: React.FC = () => {
  return (
    <div className="p-4 text-gray-800 dark:text-gray-200 w-full min-h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4">Module Panel</h1>
      
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex-grow">
        <AuthCheck fallback={
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-center py-6">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Authentication Required</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your session has expired or you need to authenticate with Directus to access this content.
              </p>
              <button 
                onClick={() => {
                  if (chrome?.runtime?.openOptionsPage) {
                    chrome.runtime.openOptionsPage();
                  } else {
                    window.open('options.html', '_blank');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
              >
                Go to Settings
              </button>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                You'll be redirected to the options page to log in with your Directus credentials.
              </p>
            </div>
          </div>
        }>
          <ModuleComponent />
        </AuthCheck>
      </div>
    </div>
  );
};

// Render the side panel
ReactDOM.createRoot(document.getElementById('panel-root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <SidePanel />
    </AuthProvider>
  </React.StrictMode>
);