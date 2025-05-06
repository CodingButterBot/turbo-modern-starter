import React, { useState, useEffect } from 'react';
import { Button } from '@repo/ui';

function SidePanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState({ theme: 'light', notifications: true });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch settings from storage when the component mounts
    chrome.storage.sync.get(['theme', 'notifications'])
      .then((result) => {
        setSettings(result);
        setLoading(false);
        // Generate some dummy data
        setData([
          { id: 1, title: 'Dashboard Overview', status: 'Active' },
          { id: 2, title: 'Recent Activities', status: 'Active' },
          { id: 3, title: 'Statistics', status: 'Inactive' },
          { id: 4, title: 'User Preferences', status: 'Active' },
        ]);
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
        setLoading(false);
      });
  }, []);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    chrome.storage.sync.set({ ...settings, theme: newTheme })
      .then(() => {
        setSettings({ ...settings, theme: newTheme });
      })
      .catch((error) => {
        console.error('Error updating theme:', error);
      });
  };

  return (
    <div className={`flex h-screen flex-col ${settings.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      {/* Header */}
      <header className={`flex items-center justify-between border-b ${settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <h1 className="text-xl font-bold">Turbo Modern Starter</h1>
        <Button
          variant={settings.theme === 'dark' ? 'ghost' : 'secondary'}
          size="sm"
          onClick={toggleTheme}
        >
          {settings.theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </header>

      {/* Tabs */}
      <div className={`flex border-b ${settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'dashboard'
              ? settings.theme === 'dark'
                ? 'border-b-2 border-primary-500 text-primary-400'
                : 'border-b-2 border-primary-600 text-primary-600'
              : settings.theme === 'dark'
              ? 'text-gray-400 hover:text-gray-200'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'analytics'
              ? settings.theme === 'dark'
                ? 'border-b-2 border-primary-500 text-primary-400'
                : 'border-b-2 border-primary-600 text-primary-600'
              : settings.theme === 'dark'
              ? 'text-gray-400 hover:text-gray-200'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'settings'
              ? settings.theme === 'dark'
                ? 'border-b-2 border-primary-500 text-primary-400'
                : 'border-b-2 border-primary-600 text-primary-600'
              : settings.theme === 'dark'
              ? 'text-gray-400 hover:text-gray-200'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-t-transparent"></div>
          </div>
        ) : (
          <div>
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="mb-4 text-lg font-semibold">Dashboard</h2>
                <div className={`mb-6 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-4`}>
                  <h3 className="mb-2 font-medium">Summary</h3>
                  <p className={`text-sm ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Welcome to the Turbo Modern Starter side panel dashboard. This panel
                    provides an overview of your extension's functionality and status.
                  </p>
                </div>
                <h3 className="mb-2 font-medium">Components Status</h3>
                <div className={`rounded-lg ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-4`}>
                  <ul className="divide-y divide-gray-600 space-y-2">
                    {data.map((item) => (
                      <li key={item.id} className="flex items-center justify-between py-2">
                        <span>{item.title}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="mb-4 text-lg font-semibold">Analytics</h2>
                <div className={`rounded-lg ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-4`}>
                  <div className="mb-4">
                    <h3 className="mb-2 font-medium">Usage Statistics</h3>
                    {/* Dummy chart representation */}
                    <div className="h-48 rounded-md bg-white p-2">
                      <div className="flex h-full items-end space-x-2">
                        <div className="h-20% w-8 rounded-t bg-primary-600"></div>
                        <div className="h-40% w-8 rounded-t bg-primary-600"></div>
                        <div className="h-70% w-8 rounded-t bg-primary-600"></div>
                        <div className="h-60% w-8 rounded-t bg-primary-600"></div>
                        <div className="h-80% w-8 rounded-t bg-primary-600"></div>
                        <div className="h-50% w-8 rounded-t bg-primary-600"></div>
                        <div className="h-30% w-8 rounded-t bg-primary-600"></div>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="mb-4 text-lg font-semibold">Settings</h2>
                <div className={`rounded-lg ${settings.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-4`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Theme</span>
                      <div className="relative inline-block h-6 w-11">
                        <input 
                          type="checkbox" 
                          className="peer h-0 w-0 opacity-0" 
                          checked={settings.theme === 'dark'}
                          onChange={toggleTheme}
                        />
                        <span className="absolute bottom-0 left-0 right-0 top-0 cursor-pointer rounded-full bg-gray-300 transition duration-300 before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition before:duration-300 peer-checked:bg-primary-600 peer-checked:before:translate-x-5"></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Notifications</span>
                      <div className="relative inline-block h-6 w-11">
                        <input 
                          type="checkbox" 
                          className="peer h-0 w-0 opacity-0" 
                          checked={settings.notifications}
                          onChange={() => {
                            const newValue = !settings.notifications;
                            chrome.storage.sync.set({ ...settings, notifications: newValue })
                              .then(() => {
                                setSettings({ ...settings, notifications: newValue });
                              });
                          }}
                        />
                        <span className="absolute bottom-0 left-0 right-0 top-0 cursor-pointer rounded-full bg-gray-300 transition duration-300 before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition before:duration-300 peer-checked:bg-primary-600 peer-checked:before:translate-x-5"></span>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="default" className="w-full">
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`border-t ${settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-4 text-center text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        Turbo Modern Starter Extension v0.0.1
      </footer>
    </div>
  );
}

export default SidePanel;