import React, { useEffect } from 'react';
import { useTheme, Theme } from '../contexts/ThemeContext';

interface ThemeSelectorProps {
  className?: string;
}

/**
 * Theme selector component that allows the user to switch between light, dark, and system themes
 */
const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = '' }) => {
  const { themePreference, setTheme, theme, isLoading } = useTheme();
  
  // Debug logging for theme changes
  useEffect(() => {
    console.log('ThemeSelector - Current state:', { 
      themePreference, 
      theme,
      isLoading,
      documentHasDarkClass: document.documentElement.classList.contains('dark'),
      documentClassList: Array.from(document.documentElement.classList)
    });
  }, [themePreference, theme, isLoading]);
  
  const handleThemeChange = (newTheme: Theme) => {
    console.log('Setting theme to:', newTheme);
    setTheme(newTheme);
    // Force check if classList was updated
    setTimeout(() => {
      console.log('After theme change, document has dark class:', document.documentElement.classList.contains('dark'));
      console.log('Document classList:', Array.from(document.documentElement.classList));
    }, 100);
  };
  
  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Theme</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        Choose your preferred theme appearance
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Light Theme Button */}
        <button
          onClick={() => handleThemeChange(Theme.LIGHT)}
          className={`flex-1 flex items-center justify-center p-3 rounded-lg border transition ${
            themePreference === Theme.LIGHT
              ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-400'
              : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
          }`}
        >
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 mb-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
            <span className={`text-sm font-medium ${
              themePreference === Theme.LIGHT
                ? 'text-blue-700 dark:text-blue-400'
                : 'text-gray-800 dark:text-gray-300'
            }`}>
              Light
            </span>
          </div>
        </button>
        
        {/* Dark Theme Button */}
        <button
          onClick={() => handleThemeChange(Theme.DARK)}
          className={`flex-1 flex items-center justify-center p-3 rounded-lg border transition ${
            themePreference === Theme.DARK
              ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-400'
              : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
          }`}
        >
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 mb-2 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span className={`text-sm font-medium ${
              themePreference === Theme.DARK
                ? 'text-blue-700 dark:text-blue-400'
                : 'text-gray-800 dark:text-gray-300'
            }`}>
              Dark
            </span>
          </div>
        </button>
        
        {/* System Theme Button */}
        <button
          onClick={() => handleThemeChange(Theme.SYSTEM)}
          className={`flex-1 flex items-center justify-center p-3 rounded-lg border transition ${
            themePreference === Theme.SYSTEM
              ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-400'
              : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
          }`}
        >
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 mb-2 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
            <span className={`text-sm font-medium ${
              themePreference === Theme.SYSTEM
                ? 'text-blue-700 dark:text-blue-400'
                : 'text-gray-800 dark:text-gray-300'
            }`}>
              System
            </span>
          </div>
        </button>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {themePreference === Theme.LIGHT && 'Using light theme for all extension pages'}
        {themePreference === Theme.DARK && 'Using dark theme for all extension pages'}
        {themePreference === Theme.SYSTEM && 'Following your system appearance settings'}
      </p>
      
      <div className="mt-4 text-xs p-2 bg-gray-100 dark:bg-gray-700 rounded">
        <p><strong>Debug Info:</strong></p>
        <p>Preference: {themePreference}</p>
        <p>Active Theme: {theme}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Dark Class: {document.documentElement.classList.contains('dark') ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default ThemeSelector;