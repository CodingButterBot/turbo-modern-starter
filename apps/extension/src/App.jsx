import React, { useState, useEffect } from 'react';

function App() {
  const [settings, setSettings] = useState({ theme: 'light', notifications: true });
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    // Fetch settings from storage when the component mounts
    chrome.storage.sync.get(['theme', 'notifications'])
      .then((result) => {
        setSettings(result);
        setStatus('Settings loaded');
      })
      .catch((error) => {
        console.error('Error fetching settings:', error);
        setStatus('Error loading settings');
      });
  }, []);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    chrome.storage.sync.set({ ...settings, theme: newTheme })
      .then(() => {
        setSettings({ ...settings, theme: newTheme });
        setStatus('Theme updated: ' + newTheme);
      })
      .catch((error) => {
        console.error('Error updating theme:', error);
        setStatus('Error updating theme');
      });
  };

  const toggleNotifications = () => {
    const newValue = !settings.notifications;
    chrome.storage.sync.set({ ...settings, notifications: newValue })
      .then(() => {
        setSettings({ ...settings, notifications: newValue });
        setStatus(`Notifications ${newValue ? 'enabled' : 'disabled'}`);
      })
      .catch((error) => {
        console.error('Error updating notifications:', error);
        setStatus('Error updating notifications');
      });
  };

  return (
    <div className={`mx-auto max-w-md rounded-lg ${settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-4 shadow-lg`}>
      <h1 className="mb-4 text-center text-xl font-bold">Turbo Modern Starter Extension</h1>
      <p className="mb-4 text-center text-sm text-gray-500">
        This is a browser extension built with the Turbo Modern Starter.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Theme</span>
          <button 
            className={`rounded px-3 py-1 text-sm font-medium ${
              settings.theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
            onClick={toggleTheme}
          >
            {settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Notifications</span>
          <label className="relative inline-block h-6 w-11">
            <input 
              type="checkbox" 
              className="peer h-0 w-0 opacity-0" 
              checked={settings.notifications}
              onChange={toggleNotifications}
            />
            <span className="absolute bottom-0 left-0 right-0 top-0 cursor-pointer rounded-full bg-gray-300 transition duration-300 before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition before:duration-300 peer-checked:bg-blue-500 peer-checked:before:translate-x-5"></span>
          </label>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500">{status}</div>
      </div>

      <div className="mt-4 flex justify-center">
        <button 
          className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          onClick={() => {
            setStatus('Action performed at ' + new Date().toLocaleTimeString());
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                  type: 'PERFORM_ACTION', 
                  data: { timestamp: Date.now() } 
                });
              }
            });
          }}
        >
          Perform Action
        </button>
      </div>
    </div>
  );
}

export default App;