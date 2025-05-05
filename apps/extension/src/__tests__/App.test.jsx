import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock chrome.storage API
const mockChromeStorage = {
  sync: {
    get: vi.fn().mockImplementation((keys, callback) => {
      callback({ theme: 'light' });
      return Promise.resolve({ theme: 'light' });
    }),
    set: vi.fn().mockImplementation((data, callback) => {
      if (callback) callback();
      return Promise.resolve();
    })
  }
};

global.chrome = {
  storage: mockChromeStorage
};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the app with theme provider', async () => {
    await act(async () => {
      render(<App />);
    });
    
    expect(screen.getByText('Turbo Modern Starter')).toBeInTheDocument();
  });
  
  it('displays tab navigation', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Check if all tabs are displayed
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
  
  it('switches between tabs when clicked', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Home tab should be active by default
    expect(screen.getByTitle('Welcome')).toBeInTheDocument();
    
    // Click on Data tab
    const dataTab = screen.getByText('Data');
    await act(async () => {
      fireEvent.click(dataTab);
    });
    
    // Data content should be visible
    expect(screen.getByTitle('Data View')).toBeInTheDocument();
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    
    // Click on Settings tab
    const settingsTab = screen.getByText('Settings');
    await act(async () => {
      fireEvent.click(settingsTab);
    });
    
    // Settings content should be visible
    expect(screen.getByText('Extension Settings')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });
  
  it('renders theme toggle component', async () => {
    await act(async () => {
      render(<App />);
    });
    
    // Find theme toggle button
    const themeToggle = screen.getAllByRole('button')[0]; // First button is the theme toggle
    expect(themeToggle).toBeInTheDocument();
    
    // Click theme toggle
    await act(async () => {
      fireEvent.click(themeToggle);
    });
    
    // Theme should be saved to storage
    expect(mockChromeStorage.sync.set).toHaveBeenCalled();
  });
});