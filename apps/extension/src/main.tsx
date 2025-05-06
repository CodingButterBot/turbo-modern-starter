import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

// Initialize theme from system preferences
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', prefersDarkMode);
document.documentElement.classList.toggle('light', !prefersDarkMode);

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event: MediaQueryListEvent) => {
  document.documentElement.classList.toggle('dark', event.matches);
  document.documentElement.classList.toggle('light', !event.matches);
});

// Get the root element and create React root
const rootElement = document.getElementById('root');

// Ensure root element exists
if (!rootElement) {
  throw new Error('Root element not found in the DOM');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);