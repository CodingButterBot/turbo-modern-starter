/**
 * UI Component Library for Turbo Modern Starter Extension
 * 
 * This library provides a set of reusable UI components designed specifically
 * for the browser extension to ensure consistent design across popup and side panel.
 */

// Export components as they're implemented
export { default as ThemeProvider } from '../contexts/ThemeContext';
export { default as ThemeToggle } from './ThemeToggle';
export { default as Card } from './Card';
export { default as ToggleSwitch } from './ToggleSwitch';
export { default as TabNav } from './TabNav';
export { default as StatusIndicator } from './StatusIndicator';
export { default as SettingsPanel } from './SettingsPanel';

// Export utility functions
export { useTheme } from '../contexts/ThemeContext';