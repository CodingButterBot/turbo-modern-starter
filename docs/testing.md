# Testing Guide

This document outlines the testing infrastructure and practices for the Turbo Modern Starter project.

## Testing Stack

The project uses the following testing tools:

- **Vitest**: Fast test runner with built-in TypeScript support
- **React Testing Library**: Component testing with a user-centric approach
- **User Event**: Simulates realistic user interactions
- **Jest DOM**: DOM-specific assertions
- **Playwright**: End-to-end testing

## Test Structure

Tests follow this organization:

- **Unit Tests**: Located alongside the code they test with the naming convention `*.test.ts`
- **Component Tests**: Located in `__tests__` folders with the naming convention `*.test.tsx`
- **End-to-End Tests**: Located in the `e2e` directory

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   └── ...
│   └── __tests__/
│       └── ... (shared test utilities)
```

## Running Tests

### Unit and Component Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run tests for a specific package
cd packages/ui
pnpm test
```

### End-to-End Tests

```bash
# Run all E2E tests
pnpm e2e

# Run specific E2E tests
pnpm e2e:web
pnpm e2e:extension
```

## Coverage Requirements

We aim for:
- 90%+ coverage for core utilities
- 80%+ coverage for UI components
- E2E tests for critical user flows

## Writing Tests

### Component Test Example

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Utility Test Example

```ts
import { describe, it, expect } from 'vitest';
import { cn } from '../lib/utils';

describe('cn', () => {
  it('combines class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(cn('foo', null, 'bar')).toBe('foo bar');
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });
});
```

### E2E Test Example

```ts
import { test, expect } from '@playwright/test';

test('homepage has the correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Turbo Modern Starter/);
});
```

## Mocking

### Component Mocks

```tsx
vi.mock('@repo/ui', () => ({
  Button: ({ children, ...props }) => (
    <button data-testid="mocked-button" {...props}>{children}</button>
  ),
}));
```

### API Mocks

```ts
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));
```

## CI Integration

Tests run automatically in GitHub Actions for:
- Every pull request
- Merges to main branch

The workflow is defined in `.github/workflows/test.yml`.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)