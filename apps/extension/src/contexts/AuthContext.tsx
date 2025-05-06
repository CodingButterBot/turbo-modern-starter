import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getDirectusToken, 
  clearAuthTokens, 
  validateToken, 
  refreshToken 
} from '../lib/directus-client';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  checkAuth: async () => false,
  logout: async () => {},
  error: null
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status
  const checkAuth = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use validateToken to check if token is still valid
      const isValid = await validateToken();
      
      // If token is not valid, try to refresh it
      if (!isValid) {
        const refreshSuccessful = await refreshToken();
        setIsAuthenticated(refreshSuccessful);
        return refreshSuccessful;
      }
      
      setIsAuthenticated(isValid);
      return isValid;
    } catch (err) {
      console.warn('Error validating authentication:', err);
      setError('Failed to validate authentication status');
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await clearAuthTokens();
      setIsAuthenticated(false);
    } catch (err) {
      console.warn('Error during logout:', err);
      setError('Failed to log out');
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication on mount and set up refresh interval
  useEffect(() => {
    checkAuth();
    
    // Set up interval to periodically check authentication status
    const interval = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, checkAuth, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};