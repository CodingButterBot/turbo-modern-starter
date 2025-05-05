import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from '../ThemeToggle';
import { ThemeContext, THEMES } from '../../../contexts/ThemeContext';

// Mock theme context
const createMockThemeContext = (theme = THEMES.LIGHT) => {
  const toggleTheme = vi.fn();
  const setTheme = vi.fn();
  
  return {
    theme,
    toggleTheme,
    setTheme,
    mockValues: { toggleTheme, setTheme },
  };
};

// Test wrapper component
const ThemeToggleWrapper = ({ theme = THEMES.LIGHT, children }) => {
  const { toggleTheme, setTheme } = createMockThemeContext(theme).mockValues;
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

describe('ThemeToggle Component', () => {
  it('renders in icon variant by default', () => {
    render(
      <ThemeToggleWrapper>
        <ThemeToggle />
      </ThemeToggleWrapper>
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    // Default light theme icon
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });
  
  it('renders dark mode icon when theme is dark', () => {
    render(
      <ThemeToggleWrapper theme={THEMES.DARK}>
        <ThemeToggle />
      </ThemeToggleWrapper>
    );
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });
  
  it('calls toggleTheme when clicked', () => {
    const { mockValues } = createMockThemeContext();
    
    render(
      <ThemeContext.Provider value={{ 
        theme: THEMES.LIGHT, 
        toggleTheme: mockValues.toggleTheme,
        setTheme: mockValues.setTheme
      }}>
        <ThemeToggle />
      </ThemeContext.Provider>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockValues.toggleTheme).toHaveBeenCalledTimes(1);
  });
  
  it('renders as a switch when variant is "switch"', () => {
    render(
      <ThemeToggleWrapper>
        <ThemeToggle variant="switch" />
      </ThemeToggleWrapper>
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });
  
  it('renders as a button with text when variant is "button"', () => {
    render(
      <ThemeToggleWrapper>
        <ThemeToggle variant="button" />
      </ThemeToggleWrapper>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Light');
  });
  
  it('accepts custom icons', () => {
    render(
      <ThemeToggleWrapper>
        <ThemeToggle lightIcon="☼" darkIcon="☾" />
      </ThemeToggleWrapper>
    );
    
    expect(screen.getByText('☼')).toBeInTheDocument();
  });
});