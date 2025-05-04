import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  /** The children to render */
  children: React.ReactNode;
  /** Default theme, defaults to system */
  defaultTheme?: Theme;
  /** Disable theme persistence, defaults to false */
  disableTransitions?: boolean;
  /** Storage key to use in localStorage */
  storageKey?: string;
}

interface ThemeProviderState {
  /** Current theme */
  theme: Theme;
  /** Function to set the theme */
  setTheme: (theme: Theme) => void;
  /** Whether the system prefers dark mode */
  systemTheme: 'light' | 'dark';
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  systemTheme: 'light',
};

// Create context for the theme
const ThemeContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  disableTransitions = false,
  storageKey = 'ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(
    () => (localStorage?.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>(
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  );

  // Function to apply the theme to the HTML element
  const applyTheme = React.useCallback((theme: Theme) => {
    const root = window.document.documentElement;
    
    // Remove transitions during theme change to avoid flash
    if (disableTransitions) {
      root.classList.add('disable-transitions');
    }

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Re-enable transitions
    if (disableTransitions) {
      window.setTimeout(() => {
        root.classList.remove('disable-transitions');
      }, 0);
    }
  }, [disableTransitions]);

  // Update theme
  const setTheme = React.useCallback((theme: Theme) => {
    localStorage?.setItem(storageKey, theme);
    setThemeState(theme);
  }, [storageKey]);

  // Listen for system theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyTheme, theme]);

  // Apply theme on mount and when theme changes
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      systemTheme,
    }),
    [theme, setTheme, systemTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Custom hook to use the theme context
export function useTheme(): ThemeProviderState {
  const context = React.useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}