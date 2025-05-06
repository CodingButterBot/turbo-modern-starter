// Content script for Turbo Modern Starter Extension
console.log('Content script loaded');

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

// Clean up when the content script is unloaded
window.addEventListener('unload', () => {
  observer.disconnect();
});