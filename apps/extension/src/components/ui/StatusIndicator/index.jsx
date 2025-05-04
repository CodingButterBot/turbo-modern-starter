import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

/**
 * StatusIndicator component
 * A visual indicator for displaying status (success, warning, error, etc.)
 * 
 * @param {Object} props - Component props
 * @param {string} props.status - Status type: 'online', 'offline', 'warning', 'error', 'loading', 'idle'
 * @param {string} [props.size='md'] - Size of the indicator: 'sm', 'md', or 'lg'
 * @param {string} [props.label] - Optional label text
 * @param {boolean} [props.pulse=false] - Whether the indicator should have a pulsing animation
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const StatusIndicator = ({
  status,
  size = 'md',
  label,
  pulse = false,
  className = '',
  ...rest
}) => {
  const { theme } = useTheme();
  
  // Status colors
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      pulseColor: 'bg-green-200',
      label: label || 'Online',
    },
    offline: {
      color: 'bg-gray-500',
      pulseColor: 'bg-gray-200',
      label: label || 'Offline',
    },
    warning: {
      color: 'bg-yellow-500',
      pulseColor: 'bg-yellow-200',
      label: label || 'Warning',
    },
    error: {
      color: 'bg-red-500',
      pulseColor: 'bg-red-200',
      label: label || 'Error',
    },
    loading: {
      color: 'bg-blue-500',
      pulseColor: 'bg-blue-200',
      label: label || 'Loading',
    },
    idle: {
      color: 'bg-gray-300',
      pulseColor: 'bg-gray-100',
      label: label || 'Idle',
    },
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      dot: 'h-2 w-2',
      pulse: 'h-2.5 w-2.5',
      text: 'text-xs',
    },
    md: {
      dot: 'h-3 w-3',
      pulse: 'h-4 w-4',
      text: 'text-sm',
    },
    lg: {
      dot: 'h-4 w-4',
      pulse: 'h-5 w-5',
      text: 'text-base',
    },
  };

  // Default to online if status is not recognized
  const currentStatus = statusConfig[status] || statusConfig.online;
  const currentSize = sizeConfig[size] || sizeConfig.md;
  
  // Generate text color based on theme and status
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';

  return (
    <div className={`flex items-center ${className}`} {...rest}>
      <div className="relative flex">
        <span
          className={`${currentStatus.color} ${currentSize.dot} rounded-full`}
        />
        
        {pulse && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className={`${currentStatus.pulseColor} ${currentSize.pulse} animate-ping rounded-full opacity-75`}
            />
          </span>
        )}
      </div>
      
      {label && (
        <span className={`ml-2 ${currentSize.text} ${textColor}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;