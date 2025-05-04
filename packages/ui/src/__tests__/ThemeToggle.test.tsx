/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from '../ThemeToggle';

describe('ThemeToggle', () => {
  it('renders with light theme by default', () => {
    render(<ThemeToggle />);
    expect(screen.getByText('Toggle theme')).toBeDefined();
  });

  it('cycles through themes when clicked', () => {
    const onThemeChange = vi.fn();
    render(<ThemeToggle onThemeChange={onThemeChange} />);
    
    // Initial state is light
    const button = screen.getByRole('button');
    
    // Click to change to dark
    fireEvent.click(button);
    expect(onThemeChange).toHaveBeenCalledWith('dark');
    
    // Update the component to dark mode and click again to change to system
    render(<ThemeToggle theme="dark" onThemeChange={onThemeChange} />);
    fireEvent.click(button);
    expect(onThemeChange).toHaveBeenCalledWith('system');
    
    // Update the component to system mode and click again to change to light
    render(<ThemeToggle theme="system" onThemeChange={onThemeChange} />);
    fireEvent.click(button);
    expect(onThemeChange).toHaveBeenCalledWith('light');
  });

  it('shows label when showLabel is true', () => {
    render(<ThemeToggle theme="light" showLabel />);
    expect(screen.getByText('Light')).toBeDefined();
    
    render(<ThemeToggle theme="dark" showLabel />);
    expect(screen.getByText('Dark')).toBeDefined();
    
    render(<ThemeToggle theme="system" showLabel />);
    expect(screen.getByText('System')).toBeDefined();
  });
});