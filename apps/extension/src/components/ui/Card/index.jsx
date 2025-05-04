import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { themeClasses } from '../../../utils/theme';

/**
 * Card component for displaying content in a contained, styled box
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.title] - Optional card title
 * @param {React.ReactNode} [props.action] - Optional action element (button, link, etc.)
 * @param {string} [props.variant='default'] - Card style variant: 'default', 'outline', or 'flat'
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.hoverable=false] - Whether the card should have hover effects
 * @param {boolean} [props.clickable=false] - Whether the card is clickable (adds pointer cursor)
 * @returns {JSX.Element}
 */
const Card = ({
  children,
  title,
  action,
  variant = 'default',
  className = '',
  hoverable = false,
  clickable = false,
  ...rest
}) => {
  const { theme } = useTheme();

  // Variant-specific classes
  const variantClasses = {
    default: themeClasses(
      theme,
      'border',
      'bg-white border-gray-200 shadow',
      'bg-gray-800 border-gray-700 shadow-md'
    ),
    outline: themeClasses(
      theme,
      'border-2',
      'bg-white border-gray-300',
      'bg-gray-800 border-gray-600'
    ),
    flat: themeClasses(
      theme,
      '',
      'bg-gray-100',
      'bg-gray-800'
    ),
  };

  // Add hover and clickable classes
  const interactivityClasses = [
    hoverable ? themeClasses(
      theme,
      'transition-shadow duration-200',
      'hover:shadow-md',
      'hover:shadow-lg'
    ) : '',
    clickable ? 'cursor-pointer' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={`rounded-lg overflow-hidden ${variantClasses[variant]} ${interactivityClasses} ${className}`}
      {...rest}
    >
      {title && (
        <div className={themeClasses(
          theme,
          'flex items-center justify-between px-4 py-3 border-b',
          'border-gray-200',
          'border-gray-700'
        )}>
          <h3 className={themeClasses(
            theme,
            'font-medium',
            'text-gray-800',
            'text-white'
          )}>
            {title}
          </h3>
          {action && <div className="ml-4">{action}</div>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;