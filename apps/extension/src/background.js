/**
 * Background script for the Turbo Modern Starter Extension
 * 
 * This script runs in the background and handles events
 * like extension installation, updates, and message passing.
 */

// Handle extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings on install
    chrome.storage.sync.set({
      theme: 'light',
      notifications: true,
      autoRefresh: false
    });
    
    console.log('Extension installed - default settings applied');
  } else if (details.reason === 'update') {
    console.log(`Extension updated from ${details.previousVersion} to ${chrome.runtime.getManifest().version}`);
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
});