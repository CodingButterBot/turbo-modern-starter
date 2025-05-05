import React, { useState, useEffect } from 'react';
import { 
  getDirectusToken, 
  authenticateDirectus,
  DirectusAuthResult 
} from '../lib/directus-client';
import { useAuth } from '../contexts/AuthContext';

/**
 * Directus Settings Component
 * Allows the user to authenticate with Directus
 */
const DirectusSettings: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, checkAuth, logout, error: authError } = useAuth();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>(''); // 'success' or 'error'
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState<boolean>(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      try {
        setIsLoadingSettings(true);
        
        // If authenticated, get the token for display
        if (isAuthenticated) {
          const savedToken = await getDirectusToken();
          if (savedToken) {
            setToken(savedToken);
          }
        }
        
        // Show auth error if any
        if (authError) {
          showStatus(authError, 'error');
        }
      } catch (err) {
        console.warn('Error loading Directus settings:', err);
        showStatus('Could not load your settings. Please try again.', 'error');
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettings();
  }, [isAuthenticated, authError]);

  // Show status message
  const showStatus = (message: string, type: 'success' | 'error' = 'success'): void => {
    setStatusMessage(message);
    setStatusType(type);
    
    // Auto-clear success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        setStatusMessage('');
      }, 5000);
    }
  };

  // Authenticate with Directus
  const handleAuthenticate = async (): Promise<void> => {
    if (!email || !password) {
      showStatus('Please enter both email and password', 'error');
      return;
    }
    
    try {
      setLoading(true);
      setStatusMessage('');

      const authData: DirectusAuthResult = await authenticateDirectus({ email, password });
      
      // Extract token from the response 
      const { accessToken } = authData;
      setToken(accessToken);
      
      // Refresh auth context
      await checkAuth();
      
      showStatus('Authentication successful', 'success');
      setPassword(''); // Clear password for security
    } catch (err) {
      console.warn('Error authenticating with Directus:', err);
      
      let errorMessage = 'Authentication failed';
      const error = err as Error;
      if (error.message && error.message.includes('401')) {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      } else if (error.message && (
        error.message.includes('Failed to fetch') || 
        error.message.includes('NetworkError')
      )) {
        errorMessage = 'Could not connect to Directus server.';
      }
      
      showStatus(errorMessage, 'error');
      
      // Refresh auth context
      await checkAuth();
    } finally {
      setLoading(false);
    }
  };

  // Reset authentication
  const handleLogout = async (): Promise<void> => {
    try {
      setLoading(true);
      // Use logout from auth context
      await logout();
      setToken('');
      showStatus('Successfully logged out', 'success');
    } catch (err) {
      console.warn('Error logging out:', err);
      showStatus('Error logging out', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingSettings || authLoading) {
    return (
      <div className="min-h-32 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-300">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Directus Settings</h2>

      {statusMessage && (
        <div className={`p-3 mb-5 text-sm border rounded-lg flex items-start ${
          statusType === 'success'
            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400'
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400'
        }`}>
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            {statusType === 'success' ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            ) : (
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            )}
          </svg>
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">Authentication</h3>

        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 p-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-700 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="font-medium text-green-800 dark:text-green-400">Successfully authenticated with Directus</span>
              </div>
            </div>
            
            <button
              className="w-full py-2 px-4 bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition disabled:opacity-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:opacity-50"
              onClick={handleAuthenticate}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Log in to Directus'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectusSettings;