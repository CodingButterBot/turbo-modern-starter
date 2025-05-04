import * as React from 'react';
import { cn } from './utils';
import { Button } from './Button';

export interface ThemeToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * The current theme
   */
  theme?: 'light' | 'dark' | 'system';
  /**
   * Callback when theme is changed
   */
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  /**
   * Show text label alongside icon
   */
  showLabel?: boolean;
}

export const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className, theme: propTheme, onThemeChange, showLabel = false, ...props }, ref) => {
    const themeContext = React.useContext(
      // @ts-ignore - This is needed to use the ThemeContext without circular dependency
      React.createContext({ theme: 'light', setTheme: () => {} })
    );
    
    // Use either provided theme prop or theme from context
    const theme = propTheme || themeContext?.theme || 'light';
    
    const handleClick = React.useCallback(() => {
      // Cycle through themes: light -> dark -> system -> light
      const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
      if (onThemeChange) {
        onThemeChange(nextTheme);
      } else if (themeContext?.setTheme) {
        // @ts-ignore - Ignore the argument type mismatch
        themeContext.setTheme(nextTheme);
      }
    }, [theme, onThemeChange, themeContext]);

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={cn(
          'rounded-full w-9 h-9 p-0',
          showLabel && 'w-auto px-3',
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="sr-only">Toggle theme</span>
        {theme === 'light' ? (
          <SunIcon className="h-5 w-5" />
        ) : theme === 'dark' ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <ComputerIcon className="h-5 w-5" />
        )}
        {showLabel && (
          <span className="ml-2">
            {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
          </span>
        )}
      </Button>
    );
  }
);

ThemeToggle.displayName = 'ThemeToggle';

// Icon components for theme toggle
function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ComputerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}