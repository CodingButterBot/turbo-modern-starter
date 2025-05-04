import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders a button with default styles', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary-600');
    expect(button).toHaveClass('text-white');
  });

  it('applies custom className', () => {
    // Using a valid Tailwind class
    render(<Button className="p-4">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    expect(button).toHaveClass('p-4');
  });

  it('renders with variant="outline"', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button', { name: /outline button/i });
    
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-primary-600');
    expect(button).toHaveClass('text-primary-600');
  });

  it('renders with variant="secondary"', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button', { name: /secondary button/i });
    
    expect(button).toHaveClass('bg-gray-200');
    expect(button).toHaveClass('text-gray-800');
  });

  it('renders with variant="ghost"', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole('button', { name: /ghost button/i });
    
    expect(button).toHaveClass('hover:bg-primary-100');
    expect(button).toHaveClass('hover:text-primary-600');
  });

  it('renders with variant="link"', () => {
    render(<Button variant="link">Link Button</Button>);
    const button = screen.getByRole('button', { name: /link button/i });
    
    expect(button).toHaveClass('text-primary-600');
    expect(button).toHaveClass('hover:underline');
  });

  it('renders with size="sm"', () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole('button', { name: /small button/i });
    
    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('text-xs');
  });

  it('renders with size="lg"', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button', { name: /large button/i });
    
    expect(button).toHaveClass('h-12');
    expect(button).toHaveClass('px-8');
    expect(button).toHaveClass('text-lg');
  });

  it('passes HTML button attributes', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled data-testid="test-button">
        Test Button
      </Button>
    );
    
    const button = screen.getByTestId('test-button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
    
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards ref to button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
  });
});