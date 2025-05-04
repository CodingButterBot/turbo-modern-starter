import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../page';

// Mock the Button component from @repo/ui
vi.mock('@repo/ui', () => ({
  Button: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <button data-testid={`button-${variant || 'default'}`}>{children}</button>
  ),
}));

describe('Home Page', () => {
  it('renders the title correctly', () => {
    render(<Home />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('🚀 Turbo Modern Starter');
  });

  it('renders the description text', () => {
    render(<Home />);
    
    const description = screen.getByText(/A cutting-edge monorepo starter with/i);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('TypeScript');
    expect(description).toHaveTextContent('Next.js');
    expect(description).toHaveTextContent('Tailwind CSS');
  });

  it('renders the primary and outline buttons', () => {
    render(<Home />);
    
    const primaryButton = screen.getByTestId('button-default');
    expect(primaryButton).toBeInTheDocument();
    expect(primaryButton).toHaveTextContent('Get Started');

    const outlineButton = screen.getByTestId('button-outline');
    expect(outlineButton).toBeInTheDocument();
    expect(outlineButton).toHaveTextContent('Documentation');
  });
});