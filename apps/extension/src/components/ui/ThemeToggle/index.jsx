import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { themeClasses } from '../../../utils/theme';
import { THEMES } from '../../../contexts/ThemeContext';

/**
 * ThemeToggle props
 * @typedef {Object} ThemeToggleProps
 * @property {string} [variant='icon'] - The variant of the toggle: 'icon', 'switch', or 'button'
 * @property {string} [size='md'] - The size of the toggle: 'sm', 'md', or 'lg'
 * @property {string} [className] - Additional class names
 */

/**
 * ThemeToggle component
 * Allows users to toggle between light and dark theme modes
 * 
 * @param {ThemeToggleProps} props
 * @returns {JSX.Element}
 */
const ThemeToggle = ({ 
  variant = 'icon', 
  size = 'md', 
  className = '',
  lightIcon = '☀️',
  darkIcon = '🌙',
  lightText = 'Light',
  darkText = 'Dark',
  ...rest
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === THEMES.DARK;

  // Size-specific classes
  const sizeClasses = {
    sm: 'text-sm h-7 w-7',
    md: 'text-base h-9 w-9',
    lg: 'text-lg h-11 w-11',
  };

  // Variant-specific rendering
  switch (variant) {
    case 'switch':
      return (
        <div className={`relative inline-block ${className}`}>
          <input
            type="checkbox"
            className="peer sr-only"
            checked={isDark}
            onChange={toggleTheme}
            aria-label="Toggle theme"
            {...rest}
          />
          <span 
            className={`
              block h-6 w-11 cursor-pointer rounded-full 
              bg-gray-300 transition
              after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 
              after:rounded-full after:bg-white after:transition
              after:content-[''] peer-checked:bg-primary-600 
              peer-checked:after:translate-x-full
              peer-focus:outline-none peer-focus:ring-2 
              peer-focus:ring-primary-500 peer-focus:ring-offset-1
            `}
          ></span>
        </div>
      );
      
    case 'button':
      return (
        <button
          type="button"
          onClick={toggleTheme}
          className={themeClasses(
            theme,
            `flex items-center justify-center rounded-md px-3 py-1.5 font-medium transition ${className}`,
            'bg-gray-200 text-gray-800 hover:bg-gray-300', // light mode
            'bg-gray-700 text-white hover:bg-gray-600' // dark mode
          )}
          aria-label="Toggle theme"
          {...rest}
        >
          <span className="mr-2">
            {isDark ? darkIcon : lightIcon}
          </span>
          {isDark ? darkText : lightText}
        </button>
      );
      
    case 'icon':
    default:
      return (
        <button
          type="button"
          onClick={toggleTheme}
          className={themeClasses(
            theme,
            `flex items-center justify-center rounded-full transition ${sizeClasses[size]} ${className}`,
            'bg-gray-200 text-gray-800 hover:bg-gray-300', // light mode
            'bg-gray-700 text-white hover:bg-gray-600' // dark mode
          )}
          aria-label="Toggle theme"
          {...rest}
        >
          {isDark ? darkIcon : lightIcon}
        </button>
      );
  }
};

export default ThemeToggle;