import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RootLayout, { metadata } from '../layout';

// Mock next/font
vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'mock-font-variable' }),
}));

describe('Root Layout', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    );
    
    // Check if children are rendered
    const content = screen.getByTestId('test-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Test Content');
    
    // Check if the body has the right classes
    const body = container.querySelector('body');
    expect(body).toHaveClass('bg-white');
    expect(body).toHaveClass('dark:bg-gray-950');
  });
  
  it('has correct metadata for the page', () => {
    // Test the exported metadata values
    expect(metadata.title).toBe('Turbo Modern Starter - Documentation');
    expect(metadata.description).toContain('Documentation for Turbo Modern Starter');
  });
});