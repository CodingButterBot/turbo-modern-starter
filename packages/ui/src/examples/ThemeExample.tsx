import * as React from 'react';
import { ThemeProvider, useTheme, ThemeToggle } from '..';

/**
 * This is an example component showing how to use the ThemeProvider and ThemeToggle together
 */
export function ThemeExample() {
  return (
    <ThemeProvider>
      <ThemeToggleDemo />
    </ThemeProvider>
  );
}

function ThemeToggleDemo() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="p-4 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark rounded-lg transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Current Theme: {theme}</h2>
        <ThemeToggle 
          theme={theme} 
          onThemeChange={setTheme} 
          showLabel 
        />
      </div>
      
      <p className="mb-4">This component demonstrates the theme functionality in action.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded border border-border-light dark:border-border-dark">
          <h3 className="font-medium mb-2">Light & Dark Styles</h3>
          <p className="text-sm">This card uses light and dark mode styles</p>
        </div>
        
        <div className="p-4 bg-primary-50 dark:bg-primary-900 text-primary-900 dark:text-primary-50 rounded border border-primary-200 dark:border-primary-800">
          <h3 className="font-medium mb-2">Primary Colors</h3>
          <p className="text-sm">This card uses primary colors with dark mode variants</p>
        </div>
        
        <div className="p-4 bg-surface-light dark:bg-surface-dark rounded border border-border-light dark:border-border-dark">
          <h3 className="font-medium mb-2">Surface Colors</h3>
          <p className="text-sm">This card uses surface and border colors</p>
        </div>
      </div>
    </div>
  );
}