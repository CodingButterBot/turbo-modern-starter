// Background script for Turbo Modern Starter Extension
console.log('Background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  // Initialize default settings in storage
  chrome.storage.sync.set({
    theme: 'light',
    notifications: true,
    autoRefresh: false
  }).then(() => {
    console.log('Default settings initialized');
  }).catch((error) => {
    console.error('Error initializing settings:', error);
  });
});

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
  
  if (message.type === 'GET_THEME') {
    chrome.storage.sync.get(['theme'], (result) => {
      sendResponse({ theme: result.theme || 'light' });
    });
    return true; // Required for async sendResponse
  }
  
  if (message.type === 'SET_THEME') {
    chrome.storage.sync.set({ theme: message.theme }, () => {
      sendResponse({ success: true });
    });
    return true; // Required for async sendResponse
  }
  
  // Handle other message types here
});