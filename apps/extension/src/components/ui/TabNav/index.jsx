import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { themeClasses } from '../../../utils/theme';

/**
 * TabNav component
 * A tabbed navigation component for switching between different views
 * 
 * @param {Object} props - Component props
 * @param {Array<{id: string, label: string, icon?: React.ReactNode}>} props.tabs - Array of tab objects
 * @param {string} props.activeTab - ID of the currently active tab
 * @param {Function} props.onChange - Function to call when a tab is changed
 * @param {string} [props.orientation='horizontal'] - 'horizontal' or 'vertical'
 * @param {string} [props.variant='underline'] - 'underline', 'pills', or 'buttons'
 * @param {string} [props.size='md'] - 'sm', 'md', or 'lg'
 * @param {boolean} [props.fullWidth=false] - Whether tabs should take full width
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const TabNav = ({
  tabs,
  activeTab,
  onChange,
  orientation = 'horizontal',
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  className = '',
  ...rest
}) => {
  const { theme } = useTheme();
  const [hoverTabId, setHoverTabId] = useState(null);

  // Size-specific classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2',
    lg: 'px-4 py-2.5 text-lg',
  };

  // Orientation-specific classes
  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col',
  };

  // Variant-specific classes
  const getVariantClasses = (tabId) => {
    const isActive = tabId === activeTab;
    const isHovered = tabId === hoverTabId;

    switch (variant) {
      case 'pills':
        return themeClasses(
          theme,
          'rounded-md transition-colors',
          isActive 
            ? 'bg-primary-100 text-primary-700' 
            : isHovered
              ? 'bg-gray-100 text-gray-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-700',
          isActive 
            ? 'bg-primary-900 text-primary-100' 
            : isHovered
              ? 'bg-gray-700 text-gray-200'
              : 'text-gray-300 hover:bg-gray-700 hover:text-gray-200'
        );

      case 'buttons':
        return themeClasses(
          theme,
          'border transition-colors',
          isActive 
            ? 'border-primary-600 bg-primary-600 text-white' 
            : isHovered
              ? 'border-gray-300 bg-gray-100 text-gray-700'
              : 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-700',
          isActive 
            ? 'border-primary-700 bg-primary-700 text-white' 
            : isHovered
              ? 'border-gray-600 bg-gray-700 text-gray-200'
              : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-200',
        );

      case 'underline':
      default:
        return themeClasses(
          theme,
          'border-b-2 transition-colors',
          isActive 
            ? 'border-primary-600 text-primary-600' 
            : isHovered
              ? 'border-gray-300 text-gray-700'
              : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-700',
          isActive 
            ? 'border-primary-500 text-primary-400' 
            : isHovered
              ? 'border-gray-600 text-gray-200'
              : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-200',
        );
    }
  };

  // Full width setup
  const fullWidthClasses = fullWidth 
    ? orientation === 'horizontal' ? 'flex-1 text-center' : 'w-full'
    : '';

  return (
    <div 
      className={`${orientationClasses[orientation]} ${
        variant === 'buttons' 
          ? orientation === 'horizontal' ? 'space-x-1' : 'space-y-1' 
          : orientation === 'horizontal' ? variant === 'underline' ? 'border-b' : '' : ''
      } ${className}`}
      {...rest}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          onMouseEnter={() => setHoverTabId(tab.id)}
          onMouseLeave={() => setHoverTabId(null)}
          className={`
            flex items-center justify-center font-medium outline-none
            focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
            ${fullWidthClasses}
            ${sizeClasses[size]}
            ${getVariantClasses(tab.id)}
          `}
          aria-selected={tab.id === activeTab}
          role="tab"
        >
          {tab.icon && (
            <span className={`${tab.label ? 'mr-2' : ''} text-current`}>
              {tab.icon}
            </span>
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNav;