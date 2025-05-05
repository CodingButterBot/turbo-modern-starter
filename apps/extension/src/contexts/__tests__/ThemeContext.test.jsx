import React from 'react';
import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, ThemeContext, useTheme, THEMES } from '../ThemeContext';

// Mock chrome.storage API
const mockChromeStorage = {
  sync: {
    get: vi.fn(),
    set: vi.fn().mockResolvedValue(undefined)
  }
};

global.chrome = {
  storage: mockChromeStorage
};

// Test component that uses the theme context
const ThemeConsumer = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div data-testid="theme-consumer">
      <span data-testid="current-theme">{theme}</span>
      <button data-testid="toggle-button" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockChromeStorage.sync.get.mockResolvedValue({});
  });
  
  it('provides default light theme when no stored theme', async () => {
    mockChromeStorage.sync.get.mockResolvedValue({});
    
    let result;
    await act(async () => {
      result = render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
    });
    
    const themeElement = result.getByTestId('current-theme');
    expect(themeElement.textContent).toBe(THEMES.LIGHT);
    expect(mockChromeStorage.sync.get).toHaveBeenCalledWith(['theme']);
  });
  
  it('loads theme from chrome storage', async () => {
    mockChromeStorage.sync.get.mockResolvedValue({ theme: THEMES.DARK });
    
    let result;
    await act(async () => {
      result = render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
    });
    
    const themeElement = result.getByTestId('current-theme');
    expect(themeElement.textContent).toBe(THEMES.DARK);
  });
  
  it('toggles theme when toggle function is called', async () => {
    mockChromeStorage.sync.get.mockResolvedValue({ theme: THEMES.LIGHT });
    
    let result;
    await act(async () => {
      result = render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      );
    });
    
    const toggleButton = result.getByTestId('toggle-button');
    const themeElement = result.getByTestId('current-theme');
    
    // Initial state should be light
    expect(themeElement.textContent).toBe(THEMES.LIGHT);
    
    // Toggle to dark
    await act(async () => {
      toggleButton.click();
    });
    
    expect(themeElement.textContent).toBe(THEMES.DARK);
    expect(mockChromeStorage.sync.set).toHaveBeenCalledWith({ theme: THEMES.DARK });
    
    // Toggle back to light
    await act(async () => {
      toggleButton.click();
    });
    
    expect(themeElement.textContent).toBe(THEMES.LIGHT);
    expect(mockChromeStorage.sync.set).toHaveBeenCalledWith({ theme: THEMES.LIGHT });
  });
  
  it('applies theme class to container', async () => {
    mockChromeStorage.sync.get.mockResolvedValue({ theme: THEMES.DARK });
    
    let result;
    await act(async () => {
      result = render(
        <ThemeProvider>
          <div data-testid="themed-content">Content</div>
        </ThemeProvider>
      );
    });
    
    const themedContainer = result.container.firstChild;
    expect(themedContainer).toHaveClass('theme-dark');
  });
});