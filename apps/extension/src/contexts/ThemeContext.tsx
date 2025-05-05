import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

import { storageService } from '../services/StorageService';

// Define theme types
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

// Define the context shape
interface ThemeContextType {
  theme: Theme.LIGHT | Theme.DARK; // Actual theme applied (only light or dark)
  themePreference: Theme; // User preference (can be system)
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: Theme.LIGHT,
  themePreference: Theme.SYSTEM,
  toggleTheme: () => {},
  setTheme: () => {},
  isLoading: true
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Detects the preferred color scheme from system settings
 * @returns Theme.DARK or Theme.LIGHT
 */
const detectSystemTheme = (): Theme.DARK | Theme.LIGHT => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? Theme.DARK 
      : Theme.LIGHT;
  }
  return Theme.LIGHT; // Default fallback
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme state
  const [theme, setActiveTheme] = useState<Theme.LIGHT | Theme.DARK>(Theme.LIGHT);
  const [themePreference, setThemePreference] = useState<Theme>(Theme.SYSTEM);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Apply theme to document
  const applyTheme = (newTheme: Theme.LIGHT | Theme.DARK) => {
    if (newTheme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setActiveTheme(newTheme);
  };

  // On mount, load theme from storage and detect system preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Get stored theme preference
        const result = await storageService.get(['themePreference', 'darkMode']);
        
        if (result.themePreference) {
          const preference = result.themePreference as Theme;
          setThemePreference(preference);
          
          // If using system preference, detect it
          if (preference === Theme.SYSTEM) {
            applyTheme(detectSystemTheme());
          } else {
            applyTheme(preference as Theme.LIGHT | Theme.DARK);
          }
        } else if (result.darkMode !== undefined) {
          // Legacy support for darkMode setting
          const darkModeTheme = result.darkMode ? Theme.DARK : Theme.LIGHT;
          applyTheme(darkModeTheme);
          setThemePreference(darkModeTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
    
    // Set up storage change listener using the improved StorageService
    const unsubscribe = storageService.subscribe('themePreference', (changes) => {
      if (changes.themePreference) {
        loadTheme();
      }
    });
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (themePreference === Theme.SYSTEM) {
        applyTheme(e.matches ? Theme.DARK : Theme.LIGHT);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Pre-render the correct theme to avoid flash
    if (themePreference === Theme.SYSTEM) {
      applyTheme(detectSystemTheme());
    }
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      unsubscribe();
    };
  }, [themePreference]);
  
  // Save theme preference to storage when it changes
  useEffect(() => {
    if (isLoading) return;
    
    // Save theme preference
    storageService.set({ 
      themePreference,
      // Keep darkMode setting in sync for backward compatibility
      darkMode: theme === Theme.DARK 
    });
  }, [theme, themePreference, isLoading]);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    // Cycle through: light -> dark -> system
    setThemePreference((prev) => {
      if (prev === Theme.LIGHT) {
        applyTheme(Theme.DARK);
        return Theme.DARK;
      } else if (prev === Theme.DARK) {
        const systemTheme = detectSystemTheme();
        applyTheme(systemTheme);
        return Theme.SYSTEM;
      } else {
        applyTheme(Theme.LIGHT);
        return Theme.LIGHT;
      }
    });
  };
  
  // Set a specific theme
  const setSpecificTheme = (newTheme: Theme) => {
    setThemePreference(newTheme);
    if (newTheme === Theme.SYSTEM) {
      applyTheme(detectSystemTheme());
    } else {
      applyTheme(newTheme);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themePreference,
      toggleTheme, 
      setTheme: setSpecificTheme,
      isLoading 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;