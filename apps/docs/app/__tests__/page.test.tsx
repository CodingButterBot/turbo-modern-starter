import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../page';

// Mock Next.js components
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href} data-testid={`link-to-${href}`}>{children}</a>
    ),
  };
});

// Mock the Button component from @repo/ui
vi.mock('@repo/ui', () => ({
  Button: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <button data-testid={`button-${variant || 'default'}`}>{children}</button>
  ),
}));

describe('Docs Home Page', () => {
  it('renders the title correctly', () => {
    render(<Home />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('📚 Turbo Modern Starter Docs');
  });

  it('renders the description text', () => {
    render(<Home />);
    
    const description = screen.getByText(/Comprehensive documentation/i);
    expect(description).toBeInTheDocument();
  });

  it('renders the links to docs and home', () => {
    render(<Home />);
    
    const docsLink = screen.getByTestId('link-to-/docs');
    expect(docsLink).toBeInTheDocument();
    
    const homeLink = screen.getByTestId('link-to-/');
    expect(homeLink).toBeInTheDocument();
  });
});