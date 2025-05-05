import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { themeClasses } from '../../../utils/theme';

/**
 * ToggleSwitch component
 * A styled toggle switch that can be used for boolean settings
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.checked - Whether the switch is checked/on
 * @param {Function} props.onChange - Function to call when the switch state changes
 * @param {string} [props.size='md'] - The size of the toggle: 'sm', 'md', or 'lg'
 * @param {string} [props.activeColor='primary'] - Color of the switch when active: 'primary', 'success', 'warning', or 'error'
 * @param {string} [props.label] - Optional label text
 * @param {string} [props.labelPosition='right'] - Position of the label: 'left' or 'right'
 * @param {string} [props.className] - Additional CSS classes for the container
 * @param {string} [props.id] - ID for the input element, required for accessibility if using a label
 * @returns {JSX.Element}
 */
const ToggleSwitch = ({
  checked,
  onChange,
  size = 'md',
  activeColor = 'primary',
  label,
  labelPosition = 'right',
  className = '',
  id,
  disabled = false,
  ...rest
}) => {
  const { theme } = useTheme();

  // Size-specific classes
  const sizesConfig = {
    sm: {
      switch: 'h-4 w-7',
      knob: 'h-3 w-3',
      knobTranslate: 'translate-x-3',
      text: 'text-sm',
    },
    md: {
      switch: 'h-6 w-11',
      knob: 'h-5 w-5',
      knobTranslate: 'translate-x-5',
      text: 'text-base',
    },
    lg: {
      switch: 'h-8 w-14',
      knob: 'h-7 w-7',
      knobTranslate: 'translate-x-6',
      text: 'text-lg',
    },
  };

  // Active color classes
  const activeColorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600',
  };

  // Generate a unique ID if none provided
  const switchId = id || `toggle-switch-${Math.random().toString(36).substring(2, 11)}`;

  // Disabled state styles
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <div className={`flex items-center ${className}`}>
      {label && labelPosition === 'left' && (
        <label
          htmlFor={switchId}
          className={`mr-3 ${sizesConfig[size].text} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {label}
        </label>
      )}

      <div className="relative inline-block">
        <input
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...rest}
        />
        <span
          className={`
            block ${sizesConfig[size].switch} rounded-full
            ${disabled ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'}
            transition-colors duration-200
            peer-checked:${activeColorClasses[activeColor]}
            ${disabledClasses}
          `}
        >
          <span
            className={`
              absolute left-0.5 top-0.5 ${sizesConfig[size].knob}
              rounded-full bg-white transition-transform duration-200
              peer-checked:${sizesConfig[size].knobTranslate}
            `}
          ></span>
        </span>
      </div>

      {label && labelPosition === 'right' && (
        <label
          htmlFor={switchId}
          className={`ml-3 ${sizesConfig[size].text} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default ToggleSwitch;