import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import RootLayout, { metadata } from '../layout';

// Mock next components and metadata
vi.mock('next/navigation', () => ({}));

describe('Root Layout', () => {
  it('renders children correctly', () => {
    // Next.js RootLayout produces an HTML structure that can't be easily tested
    // in a standard JSDOM environment. Instead, we can test the component structure.
    const { container } = render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    );
    
    // Check if children are rendered
    const content = screen.getByTestId('test-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Test Content');
    
    // Check if the html and body elements exist in the rendered structure
    const body = container.querySelector('body');
    expect(body).toBeTruthy();
  });
  
  it('has correct metadata for the page', () => {
    // Test the exported metadata values
    expect(metadata.title).toBe('Turbo Modern Starter');
    expect(metadata.description).toContain('monorepo starter');
    expect(metadata.description).toContain('TypeScript');
    expect(metadata.description).toContain('Next.js');
    expect(metadata.description).toContain('Tailwind CSS');
  });
});