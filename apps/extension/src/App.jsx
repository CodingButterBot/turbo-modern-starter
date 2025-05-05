import React, { useState } from 'react';
import {
  ThemeProvider,
  Card,
  ThemeToggle,
  ToggleSwitch,
  TabNav,
  StatusIndicator,
  SettingsPanel,
  useTheme
} from './components/ui';

// Example settings for the SettingsPanel
const EXAMPLE_SETTINGS = [
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Enable desktop notifications',
    control: (props) => <ToggleSwitch {...props} />
  },
  {
    id: 'darkMode',
    label: 'Dark Mode',
    description: 'Enable dark mode for the extension',
    control: (props) => <ThemeToggle variant="switch" {...props} />
  },
  {
    id: 'autoRefresh',
    label: 'Auto Refresh',
    description: 'Automatically refresh data every minute',
    control: (props) => <ToggleSwitch {...props} />
  }
];

// Example tabs for the TabNav
const EXAMPLE_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'data', label: 'Data' },
  { id: 'settings', label: 'Settings' }
];

// Example component that uses the theme context
const ThemedContent = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`p-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <h2 className="mb-3 text-lg font-semibold">Current Theme: {theme}</h2>
      <p className="mb-3">
        This content automatically adapts to the current theme.
      </p>
      <div className="mb-4 flex items-center gap-2">
        <StatusIndicator status="online" />
        <span>System Status: Online</span>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoRefresh: false
  });

  // Handle settings change
  const handleSettingChange = (id, value) => {
    setSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Card title="Welcome" className="my-4" data-testid="tab-content-home">
            <ThemedContent />
            <div className="mt-4 flex justify-center">
              <ThemeToggle variant="button" />
            </div>
          </Card>
        );
      case 'data':
        return (
          <Card title="Data View" className="my-4" data-testid="tab-content-data">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span>CPU Usage</span>
                <StatusIndicator status="online" label="Normal" />
              </div>
              <div className="flex justify-between">
                <span>Memory Usage</span>
                <StatusIndicator status="warning" label="High" />
              </div>
              <div className="flex justify-between">
                <span>Network Status</span>
                <StatusIndicator status="offline" label="Disconnected" />
              </div>
            </div>
          </Card>
        );
      case 'settings':
        return (
          <SettingsPanel
            title="Extension Settings"
            data-testid="tab-content-settings"
            settings={EXAMPLE_SETTINGS.map(setting => ({
              ...setting,
              value: settings[setting.id],
              onChange: (value) => handleSettingChange(setting.id, value)
            }))}
            footer={
              <div className="mt-4 flex justify-end gap-2">
                <button className="rounded bg-gray-200 px-3 py-1.5 text-sm">Reset</button>
                <button className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white">Save</button>
              </div>
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div 
        className="mx-auto max-w-md rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 dark:text-white"
        data-testid="app-container"
      >
        <div className="mb-4 flex items-center justify-between" data-testid="toolbar">
          <h1 className="text-xl font-bold">Turbo Modern Starter</h1>
          <ThemeToggle size="sm" data-testid="theme-toggle" />
        </div>
        
        <TabNav 
          tabs={EXAMPLE_TABS} 
          activeTab={activeTab} 
          onChange={setActiveTab}
          data-testid="tab-navigation"
        />
        
        {renderTabContent()}
        
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400" data-testid="version">
          Built with Turbo Modern Starter UI Components
        </p>
      </div>
    </ThemeProvider>
  );
}

export default App;