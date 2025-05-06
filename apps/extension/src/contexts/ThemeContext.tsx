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
    console.log('Applying theme:', newTheme);
    console.log('Before change, document has dark class:', document.documentElement.classList.contains('dark'));
    
    if (newTheme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Force the DOM to update
    document.documentElement.setAttribute('data-theme', newTheme);
    
    console.log('After change, document has dark class:', document.documentElement.classList.contains('dark'));
    console.log('Document classList:', Array.from(document.documentElement.classList));
    
    setActiveTheme(newTheme);
  };

  // On mount, load theme from storage and detect system preference
  useEffect(() => {
    const loadTheme = async () => {
      console.log('Loading theme from storage...');
      try {
        // Get stored theme preference
        const result = await storageService.get(['themePreference', 'darkMode']);
        console.log('Loaded theme settings from storage:', result);
        
        if (result.themePreference) {
          const preference = result.themePreference as Theme;
          console.log('Found theme preference in storage:', preference);
          setThemePreference(preference);
          
          // If using system preference, detect it
          if (preference === Theme.SYSTEM) {
            const systemTheme = detectSystemTheme();
            console.log('System theme detected:', systemTheme);
            applyTheme(systemTheme);
          } else {
            console.log('Applying explicit theme preference:', preference);
            applyTheme(preference as Theme.LIGHT | Theme.DARK);
          }
        } else if (result.darkMode !== undefined) {
          // Legacy support for darkMode setting
          const darkModeTheme = result.darkMode ? Theme.DARK : Theme.LIGHT;
          console.log('Using legacy darkMode setting:', { darkMode: result.darkMode, theme: darkModeTheme });
          applyTheme(darkModeTheme);
          setThemePreference(darkModeTheme);
        } else {
          console.log('No theme preference found, using defaults');
          // No settings found, apply system default
          const systemTheme = detectSystemTheme();
          console.log('System theme detected for default:', systemTheme);
          applyTheme(systemTheme);
          setThemePreference(Theme.SYSTEM);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        console.log('Theme loading complete');
        setIsLoading(false);
      }
    };
    
    loadTheme();
    
    // Set up storage change listener using the improved StorageService
    const unsubscribe = storageService.subscribe('themePreference', (changes) => {
      console.log('Storage change detected for themePreference:', changes.themePreference);
      if (changes.themePreference) {
        loadTheme();
      }
    });
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      console.log('System theme change detected:', e.matches ? 'dark' : 'light');
      if (themePreference === Theme.SYSTEM) {
        applyTheme(e.matches ? Theme.DARK : Theme.LIGHT);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Pre-render the correct theme to avoid flash
    if (themePreference === Theme.SYSTEM) {
      const systemTheme = detectSystemTheme();
      console.log('Pre-rendering system theme:', systemTheme);
      applyTheme(systemTheme);
    }
    
    // Log current state for debugging
    console.log('ThemeContext initialized with:', {
      themePreference,
      theme,
      systemPreference: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      documentHasDarkClass: document.documentElement.classList.contains('dark')
    });
    
    return () => {
      console.log('Cleaning up theme context event listeners');
      mediaQuery.removeEventListener('change', handleChange);
      unsubscribe();
    };
  }, [themePreference]);
  
  // Save theme preference to storage when it changes (with debounce)
  useEffect(() => {
    if (isLoading) return;
    
    console.log('Theme changed, preparing to save:', { theme, themePreference });
    
    // Use a timeout to debounce storage writes
    const timeoutId = setTimeout(() => {
      console.log('Saving theme to storage:', { themePreference, darkMode: theme === Theme.DARK });
      
      // Save theme preference, but only after a delay to prevent exceeding quota
      storageService.set({ 
        // Use string values for storage to avoid JSON parsing issues with localStorage 
        themePreference: themePreference as string,
        // Keep darkMode setting in sync for backward compatibility
        darkMode: theme === Theme.DARK 
      })
      .then(() => {
        // Verify what got stored by logging localStorage directly
        console.log('Theme successfully saved to storage');
        console.log('Current localStorage for theme:', localStorage.getItem('themePreference'));
      })
      .catch(error => {
        // Handle quota errors gracefully
        if (error && error.message && error.message.includes('quota')) {
          console.warn('Storage quota exceeded, will retry later');
          // Could implement a retry mechanism here if needed
        } else {
          console.error('Error saving theme preference:', error);
        }
      });
    }, 300); // 300ms debounce
    
    // Clear timeout if component unmounts or dependencies change
    return () => clearTimeout(timeoutId);
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
  
  // Set a specific theme (with rate limiting)
  const setSpecificTheme = (newTheme: Theme) => {
    console.log('setSpecificTheme called with:', newTheme);
    
    // Prevent rapid successive theme changes
    if (newTheme === themePreference) {
      console.log('Theme already set to requested value, skipping');
      return; // Skip if the theme is already set to the requested value
    }
    
    setThemePreference(newTheme);
    if (newTheme === Theme.SYSTEM) {
      const systemTheme = detectSystemTheme();
      console.log('Using system theme:', systemTheme);
      applyTheme(systemTheme);
    } else {
      console.log('Using explicit theme:', newTheme);
      applyTheme(newTheme);
    }
    
    // Force a refresh of the document class after a small delay to ensure reactivity
    setTimeout(() => {
      console.log('Forcing refresh of document class');
      if (newTheme === Theme.DARK || (newTheme === Theme.SYSTEM && detectSystemTheme() === Theme.DARK)) {
        if (!document.documentElement.classList.contains('dark')) {
          console.log('Forcing dark class');
          document.documentElement.classList.add('dark');
        }
      } else {
        if (document.documentElement.classList.contains('dark')) {
          console.log('Forcing removal of dark class');
          document.documentElement.classList.remove('dark');
        }
      }
    }, 50);
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