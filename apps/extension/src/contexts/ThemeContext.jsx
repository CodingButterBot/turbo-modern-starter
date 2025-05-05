import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Theme types definition
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

/**
 * ThemeContext type definition
 */
export const ThemeContext = createContext({
  theme: THEMES.LIGHT,
  setTheme: () => {},
  toggleTheme: () => {},
});

/**
 * Custom hook for accessing theme context
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * ThemeProvider props
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme from storage or default to light
  const [theme, setTheme] = useState(THEMES.LIGHT);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on initial render
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const result = await chrome.storage.sync.get(['theme']);
        if (result.theme) {
          setTheme(result.theme);
        }
      } catch (error) {
        console.error('Error loading theme from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Save theme to storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      chrome.storage.sync.set({ theme }).catch((error) => {
        console.error('Error saving theme to storage:', error);
      });
      
      // Apply theme to document body for global styling
      document.body.classList.toggle('dark-theme', theme === THEMES.DARK);
    }
  }, [theme, isLoading]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => 
      prevTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;