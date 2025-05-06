import React, { useState, useEffect } from 'react';
import { Button } from '@repo/ui';

function App() {
  const [settings, setSettings] = useState({ theme: 'light', notifications: true });
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    // Fetch settings from storage when the component mounts
    chrome.storage.sync.get(['theme', 'notifications'])
      .then((result) => {
        setSettings(result);
        setStatus('Ready');
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
        setStatus(`Theme set to ${newTheme}`);
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

  const openSidePanelFallback = () => {
    setStatus('Side panel could not be opened, using popup instead');
    // Any fallback UI logic would go here
  };

  const openSidePanel = () => {
    try {
      // Direct call to chrome.sidePanel.open() in response to user gesture
      if (chrome?.sidePanel?.open && chrome?.tabs?.query) {
        // Get the current tab first
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
          try {
            if (tabs && tabs.length > 0 && tabs[0].id) {
              // Get the current tab ID
              const tabId = tabs[0].id;
              console.log('Opening sidepanel with tabId:', tabId);
              
              // IMPORTANT: Always specify tabId when opening side panel
              await chrome.sidePanel.open({ tabId });
              console.log('Side panel opened successfully with tabId');
              
              // Close the popup window after opening the side panel
              window.close();
            } else {
              // If we couldn't get a tab ID, try with current window
              if (chrome?.windows?.getCurrent) {
                chrome.windows.getCurrent((currentWindow) => {
                  if (currentWindow?.id) {
                    const windowId = currentWindow.id;
                    console.log('Opening sidepanel with windowId:', windowId);
                    chrome.sidePanel.open({ windowId })
                      .then(() => {
                        console.log('Side panel opened successfully with windowId');
                        // Close the popup window after opening the side panel
                        window.close();
                      })
                      .catch((error) => {
                        console.error('Failed to open side panel with windowId:', error);
                        openSidePanelFallback();
                      });
                  } else {
                    console.error('Neither tab ID nor window ID available');
                    openSidePanelFallback();
                  }
                });
              } else {
                console.warn('Windows API not available');
                openSidePanelFallback();
              }
            }
          } catch (error) {
            console.error('Failed to open side panel:', error);
            openSidePanelFallback();
          }
        });
      } else {
        console.warn('Side panel API not available, falling back to popup');
        openSidePanelFallback();
      }
    } catch (error) {
      console.error('Error in sidepanel opener:', error);
      openSidePanelFallback();
    }
  };

  return (
    <div className={`mx-auto w-80 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-4 shadow-lg`}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Turbo Modern Starter</h1>
        <Button
          variant={settings.theme === 'dark' ? 'ghost' : 'secondary'}
          size="sm"
          onClick={toggleTheme}
        >
          {settings.theme === 'dark' ? '☀️' : '🌙'}
        </Button>
      </div>
      
      <div className="mb-6">
        <p className={`text-sm ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Browser extension with a consistent UI across popup and side panel.
        </p>
      </div>
      
      <div className={`mb-4 rounded-lg ${settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-3`}>
        <div className="mb-4 flex items-center justify-between">
          <span className="font-medium">Notifications</span>
          <div className="relative inline-block h-6 w-11">
            <input 
              type="checkbox" 
              className="peer h-0 w-0 opacity-0" 
              checked={settings.notifications}
              onChange={toggleNotifications}
            />
            <span className="absolute bottom-0 left-0 right-0 top-0 cursor-pointer rounded-full bg-gray-300 transition duration-300 before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition before:duration-300 peer-checked:bg-primary-600 peer-checked:before:translate-x-5"></span>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium">Side Panel</span>
          <Button
            variant="outline"
            size="sm"
            onClick={openSidePanel}
          >
            Open
          </Button>
        </div>
      </div>

      <Button 
        variant="default"
        className="w-full"
        onClick={() => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, { 
                type: 'PERFORM_ACTION', 
                data: { timestamp: Date.now() } 
              });
              setStatus('Action sent to content script');
            }
          });
        }}
      >
        Perform Action
      </Button>
      
      <div className="mt-3 text-center">
        <p className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {status}
        </p>
      </div>
    </div>
  );
}

export default App;