# Testing Setup for Turbo Modern Starter

This document outlines the testing infrastructure setup for the Turbo Modern Starter project.

## Overview

The project uses the following testing tools:

- **Vitest**: For unit and component testing
- **React Testing Library**: For testing React components
- **User Event**: For simulating user interactions
- **Jest DOM**: For DOM testing assertions

## Test Structure

Tests are organized in the following structure:

- For packages: `packages/<package-name>/src/__tests__/*.test.{ts,tsx}`
- For apps: `apps/<app-name>/app/__tests__/*.test.{ts,tsx}`

## Running Tests

### Run All Tests

```bash
pnpm test
```

### Run Tests with Coverage

```bash
pnpm test:coverage
```

### Run Tests for a Specific Package/App

```bash
cd packages/ui
pnpm test

# or

cd apps/web
pnpm test
```

## Test Coverage Requirements

We aim for 100% test coverage in core components and utilities. Each pull request should maintain or improve the current test coverage.

## Writing Tests

### Component Tests

For React components, use React Testing Library to test the component behavior from a user's perspective:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { YourComponent } from '../YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const handleClick = vi.fn();
    render(<YourComponent onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Utility Tests

For utility functions, test the various inputs and expected outputs:

```ts
import { describe, it, expect } from 'vitest';
import { yourUtility } from '../yourUtility';

describe('yourUtility', () => {
  it('handles basic case', () => {
    expect(yourUtility('input')).toBe('expected output');
  });

  it('handles edge cases', () => {
    expect(yourUtility('')).toBe('default output');
    expect(yourUtility(null)).toBeNull();
  });
});
```

## CI/CD Integration

Tests are automatically run in the CI pipeline on pull requests and merges to the main branch. The workflow is defined in `.github/workflows/test.yml`.

## Mocking

For components with external dependencies, use Vitest's mocking capabilities:

```tsx
vi.mock('@repo/ui', () => ({
  Button: ({ children, variant }) => (
    <button data-testid={`button-${variant || 'default'}`}>{children}</button>
  ),
}));
```

For Next.js specific features, you may need to mock the Next.js imports:

```tsx
vi.mock('next/navigation', () => ({}));
```