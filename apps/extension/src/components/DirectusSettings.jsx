import React, { useState, useEffect } from 'react';
import { getDirectusUrl, setDirectusUrl, getDirectusToken, authenticateDirectus } from '../lib/directus-client';

/**
 * Directus Settings Component
 * Allows the user to configure the Directus API connection
 */
const DirectusSettings = () => {
  const [directusUrl, setDirectusUrlState] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Load current settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Get current Directus URL
        const currentUrl = await getDirectusUrl();
        setDirectusUrlState(currentUrl);
        
        // Check if authenticated
        const currentToken = await getDirectusToken();
        if (currentToken) {
          setToken(currentToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading Directus settings:', error);
        setStatusMessage('Error loading settings');
      }
    };
    
    loadSettings();
  }, []);

  // Handle URL change
  const handleUrlChange = async () => {
    try {
      setLoading(true);
      setStatusMessage('');
      
      await setDirectusUrl(directusUrl);
      setStatusMessage('URL updated successfully');
    } catch (error) {
      console.error('Error updating Directus URL:', error);
      setStatusMessage('Error updating URL');
    } finally {
      setLoading(false);
    }
  };

  // Handle authentication
  const handleAuthenticate = async () => {
    try {
      setLoading(true);
      setStatusMessage('');
      
      const newToken = await authenticateDirectus({ email, password });
      setToken(newToken);
      setIsAuthenticated(true);
      setStatusMessage('Authentication successful');
    } catch (error) {
      console.error('Error authenticating with Directus:', error);
      setStatusMessage('Authentication failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Directus Settings</h2>
      
      {statusMessage && (
        <div className={`p-2 mb-4 text-sm rounded-md ${
          statusMessage.includes('successful') || statusMessage.includes('updated') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {statusMessage}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Directus URL:
        </label>
        <div className="flex">
          <input
            type="url"
            className="flex-1 p-2 border rounded mr-2"
            value={directusUrl}
            onChange={(e) => setDirectusUrlState(e.target.value)}
            placeholder="http://localhost:8055"
          />
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleUrlChange}
            disabled={loading}
          >
            Save
          </button>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-2">Authentication</h3>
        
        {isAuthenticated ? (
          <div className="bg-green-100 p-2 rounded text-sm text-green-700 mb-4">
            ✓ Authenticated with Directus
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Email:
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Password:
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={handleAuthenticate}
              disabled={loading || !email || !password}
            >
              {loading ? 'Authenticating...' : 'Authenticate'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DirectusSettings;