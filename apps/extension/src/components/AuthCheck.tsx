import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Props for the AuthCheck component
 */
interface AuthCheckProps {
  /** Content to render when authenticated */
  children: ReactNode;
  /** Optional fallback UI to show when not authenticated */
  fallback?: ReactNode;
}

/**
 * Authentication check component
 * Renders children only if authenticated, otherwise shows login prompt
 */
const AuthCheck: React.FC<AuthCheckProps> = ({ children, fallback }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Function to open options page for login
  const openOptionsPage = (): void => {
    if (chrome?.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      // Fallback for development environment
      window.open(chrome?.runtime?.getURL ? chrome.runtime.getURL('options.html') : 'options.html');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="text-center py-6">
          <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your session has expired or you need to authenticate with Directus to access this content.
          </p>
          <button 
            onClick={openOptionsPage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
          >
            Go to Settings
          </button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            You'll be redirected to the options page to log in with your Directus credentials.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthCheck;