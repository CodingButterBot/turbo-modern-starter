// Background script for Turbo Modern Starter Extension
console.log('Background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  // Initialize default settings in storage
  chrome.storage.sync.set({
    theme: 'light',
    notifications: true
  }).then(() => {
    console.log('Default settings initialized');
  }).catch((error) => {
    console.error('Error initializing settings:', error);
  });
  
  // Add context menu items if available
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: 'toggleSidePanel',
      title: 'Toggle Side Panel',
      contexts: ['action']
    });
  }
});

// Add context menu click handler
if (chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'toggleSidePanel' && chrome.sidePanel) {
      toggleSidePanel();
    }
  });
}

// Handle commands (keyboard shortcuts)
chrome.commands?.onCommand.addListener((command) => {
  if (command === 'toggle-side-panel' && chrome.sidePanel) {
    toggleSidePanel();
  }
});

// Toggle side panel visibility
const toggleSidePanel = async () => {
  try {
    // Use the chrome.sidePanel API to toggle the panel
    if (chrome.sidePanel) {
      await chrome.sidePanel.toggle();
      console.log('Side panel toggled');
    }
  } catch (error) {
    console.error('Error toggling side panel:', error);
  }
};

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message, 'from:', sender);
  
  if (message.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(['theme', 'notifications']).then((data) => {
      sendResponse(data);
    }).catch((error) => {
      console.error('Error getting settings:', error);
      sendResponse({ error: 'Failed to get settings' });
    });
    return true; // Required to use sendResponse asynchronously
  }
  
  if (message.type === 'TOGGLE_SIDE_PANEL') {
    toggleSidePanel()
      .then(() => sendResponse({ success: true }))
      .catch((error) => {
        console.error('Error in toggleSidePanel:', error);
        sendResponse({ success: false, error });
      });
    return true;
  }
  
  if (message.type === 'UPDATE_SETTINGS') {
    chrome.storage.sync.set(message.data).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Error updating settings:', error);
      sendResponse({ success: false, error });
    });
    return true;
  }
  
  if (message.type === 'PERFORM_ACTION') {
    // Forward the action to the content script
    if (sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, message)
        .then(() => sendResponse({ success: true }))
        .catch((error) => sendResponse({ success: false, error }));
      return true;
    }
  }
});

// Export type for messaging
export type MessageType = {
  type: 'GET_SETTINGS' | 'UPDATE_SETTINGS' | 'PERFORM_ACTION' | 'TOGGLE_SIDE_PANEL';
  data?: any;
};