import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { themeClasses } from '../../../utils/theme';
import { Card } from '../index';

/**
 * SettingsPanel component
 * A panel for displaying and managing settings
 * 
 * @param {Object} props - Component props
 * @param {Array<{id: string, label: string, description?: string, control: React.ReactNode}>} props.settings - Array of setting objects
 * @param {string} [props.title='Settings'] - Panel title
 * @param {React.ReactNode} [props.footer] - Optional footer content (like save/cancel buttons)
 * @param {string} [props.variant='default'] - 'default', 'compact', or 'grouped'
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const SettingsPanel = ({
  settings,
  title = 'Settings',
  footer,
  variant = 'default',
  className = '',
  ...rest
}) => {
  const { theme } = useTheme();

  // Variant-specific rendering
  const renderSettings = () => {
    switch (variant) {
      case 'compact':
        return (
          <div className="space-y-3">
            {settings.map((setting) => (
              <div 
                key={setting.id}
                className="flex items-center justify-between"
              >
                <div className="leading-tight">
                  <div className="font-medium">{setting.label}</div>
                  {setting.description && (
                    <div className={themeClasses(
                      theme,
                      'text-xs',
                      'text-gray-500',
                      'text-gray-400'
                    )}>
                      {setting.description}
                    </div>
                  )}
                </div>
                <div className="ml-4">{setting.control}</div>
              </div>
            ))}
          </div>
        );

      case 'grouped':
        // Group settings by category
        const grouped = settings.reduce((acc, setting) => {
          const category = setting.category || 'General';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(setting);
          return acc;
        }, {});

        return (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, categorySettings]) => (
              <div key={category}>
                <h3 className={themeClasses(
                  theme,
                  'mb-3 text-sm font-semibold uppercase tracking-wider',
                  'text-gray-500',
                  'text-gray-400'
                )}>
                  {category}
                </h3>
                <div className={themeClasses(
                  theme,
                  'rounded-md border p-4',
                  'border-gray-200',
                  'border-gray-700'
                )}>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {categorySettings.map((setting) => (
                      <div 
                        key={setting.id}
                        className="flex flex-col py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="mb-2 sm:mb-0">
                          <div className="font-medium">{setting.label}</div>
                          {setting.description && (
                            <div className={themeClasses(
                              theme,
                              'text-sm',
                              'text-gray-500',
                              'text-gray-400'
                            )}>
                              {setting.description}
                            </div>
                          )}
                        </div>
                        <div>{setting.control}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'default':
      default:
        return (
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id}>
                <div className="mb-2">
                  <div className="font-medium">{setting.label}</div>
                  {setting.description && (
                    <div className={themeClasses(
                      theme,
                      'text-sm',
                      'text-gray-500',
                      'text-gray-400'
                    )}>
                      {setting.description}
                    </div>
                  )}
                </div>
                <div>{setting.control}</div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <Card 
      title={title}
      className={className}
      {...rest}
    >
      {renderSettings()}
      
      {footer && (
        <div className={`mt-6 ${variant === 'grouped' ? 'pt-4' : ''}`}>
          {footer}
        </div>
      )}
    </Card>
  );
};

export default SettingsPanel;