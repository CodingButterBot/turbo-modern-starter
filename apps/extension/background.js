/**
 * Background script for the Turbo Modern Starter extension
 * This script runs in the background and provides functionality for the extension.
 */

// Log when the extension is installed
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  // Initialize any required setup here
  if (details.reason === 'install') {
    console.log('First installation');
    // Add first-time setup logic here
  } else if (details.reason === 'update') {
    console.log('Extension updated from version', details.previousVersion);
    // Add update logic here
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background script:', message);
  
  // Handle different message types
  if (message.type === 'GET_DATA') {
    // Example: send back some data
    sendResponse({ success: true, data: { timestamp: Date.now() } });
  }
  
  // Return true to indicate an asynchronous response is coming
  return true;
});