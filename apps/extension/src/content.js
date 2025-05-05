/**
 * Content script for the Turbo Modern Starter Extension
 * 
 * This script runs in the context of web pages and can interact with
 * the page's DOM and communicate with the extension's background script.
 */

// Request the current theme from the background script
chrome.runtime.sendMessage({ type: 'GET_THEME' }, (response) => {
  if (!response || !response.theme) return;
  
  // Store theme for potential use in this content script
  const currentTheme = response.theme;
  console.log(`Current extension theme: ${currentTheme}`);
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'THEME_CHANGED') {
    const newTheme = message.theme;
    console.log(`Extension theme changed to: ${newTheme}`);
    sendResponse({ received: true });
  }
});