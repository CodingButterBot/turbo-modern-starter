import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import DirectusSettings from './components/DirectusSettings';
import './index.css';

// Options page component
const OptionsPage: React.FC = () => {
  return (
    <div className="p-6 mx-auto max-w-md h-full">
      <h1 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Extension Options</h1>
      <DirectusSettings />
    </div>
  );
};

// Render the options page
ReactDOM.createRoot(document.getElementById('options-root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <OptionsPage />
    </AuthProvider>
  </React.StrictMode>
);