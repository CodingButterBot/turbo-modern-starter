// Content script for Turbo Modern Starter Extension
console.log('Content script loaded');

// Request the current theme from the background script
chrome.runtime.sendMessage({ type: 'GET_THEME' }, (response) => {
  if (!response || !response.theme) return;
  
  // Store theme for potential use in this content script
  const currentTheme = response.theme;
  console.log(`Current extension theme: ${currentTheme}`);
});

// Send a message to the background script
chrome.runtime.sendMessage({ 
  type: 'GET_SETTINGS' 
}, (response) => {
  console.log('Settings received:', response);
});

// Listen for DOM changes if needed
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      // Handle DOM changes here
    }
  }
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'THEME_CHANGED') {
    const newTheme = message.theme;
    console.log(`Extension theme changed to: ${newTheme}`);
    sendResponse({ received: true });
  }
  
  if (message.type === 'PERFORM_ACTION') {
    console.log('Performing action with data:', message.data);
    sendResponse({ success: true });
  }
});

// Clean up when the content script is unloaded
window.addEventListener('unload', () => {
  observer.disconnect();
});