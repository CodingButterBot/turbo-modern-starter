import { THEMES } from '../contexts/ThemeContext';

/**
 * Get class names based on the current theme
 * 
 * @param {string} theme - The current theme (light or dark)
 * @param {Object} classNames - Object containing theme-specific class names
 * @returns {string} - The appropriate class name for the current theme
 */
export const getThemeClass = (theme, classNames) => {
  return theme === THEMES.DARK 
    ? classNames.dark 
    : classNames.light;
};

/**
 * Generate conditional className string based on theme
 * 
 * @param {string} theme - The current theme (light or dark)
 * @param {string} baseClasses - Classes to always apply
 * @param {string} lightClasses - Classes to apply only in light mode
 * @param {string} darkClasses - Classes to apply only in dark mode
 * @returns {string} - Combined className string
 */
export const themeClasses = (theme, baseClasses, lightClasses, darkClasses) => {
  const themeSpecificClasses = theme === THEMES.DARK ? darkClasses : lightClasses;
  return `${baseClasses} ${themeSpecificClasses}`.trim();
};

/**
 * Check if system prefers dark mode
 * 
 * @returns {boolean} - True if system prefers dark mode
 */
export const systemPrefersDarkMode = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Get an object containing appropriate colors for the theme
 * 
 * @param {string} theme - The current theme (light or dark)
 * @returns {Object} - Theme colors object
 */
export const getThemeColors = (theme) => {
  return theme === THEMES.DARK
    ? {
        background: '#1f2937',
        foreground: '#ffffff',
        primary: '#3b82f6',
        secondary: '#6b7280',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        border: '#374151',
      }
    : {
        background: '#ffffff',
        foreground: '#1f2937',
        primary: '#2563eb',
        secondary: '#6b7280',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        border: '#e5e7eb',
      };
};