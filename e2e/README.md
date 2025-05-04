# End-to-End Tests

This directory contains end-to-end tests for all applications in the monorepo using Playwright.

## Directory Structure

```
e2e/
├── fixtures/           # Test fixtures for setup, teardown, and shared context
├── tests/              # Test files organized by application
│   ├── docs/           # Tests for the documentation site
│   ├── extension/      # Tests for the browser extension
│   └── web/            # Tests for the main web application
├── utils/              # Utility functions and page object models
│   ├── pages/          # Page object models for each application
│   └── test-helpers.ts # Helper functions for tests
├── playwright.config.ts # Playwright configuration
└── tsconfig.json       # TypeScript configuration for E2E tests
```

## Page Object Models

The tests use the Page Object Model pattern to encapsulate page behavior and improve test maintainability. Each page has its own class that encapsulates the page's elements and behaviors.

- `BasePage`: Base class for all page objects
- `HomePage`: Page object for the home page
- `DocsPage`: Page object for the documentation site
- `ExtensionPopupPage`: Page object for the browser extension popup

## Test Fixtures

Custom fixtures are defined in `fixtures/test-fixtures.ts` to provide pre-configured page objects and contexts to tests. This makes tests cleaner and more maintainable.

## Running Tests

You can run the tests using the following commands:

```bash
# Run all E2E tests
pnpm e2e

# Run with UI mode (for debugging)
pnpm e2e:ui

# Run with debug mode
pnpm e2e:debug

# View HTML report
pnpm e2e:report
```

## Test Coverage

- **Web Application**: Tests cover page loading, navigation, and accessibility
- **Documentation Site**: Tests cover navigation, content loading, and search functionality
- **Browser Extension**: Tests cover popup UI rendering and interaction

## Adding New Tests

To add a new test:

1. Create a new test file in the appropriate application directory
2. Import the test fixtures: `import { test, expect } from '../../fixtures/test-fixtures'`
3. Create test cases using the page objects provided by the fixtures

Example:

```typescript
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('My Feature', () => {
  test('should work correctly', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForPageLoad();
    
    // Add test assertions
    expect(await homePage.isVisible(homePage.heading)).toBe(true);
  });
});
```

## Browser Extension Testing

Testing browser extensions requires special configuration:

1. The extension must be built before testing
2. A special browser context must be created with the extension loaded
3. Tests navigate to extension pages using the `chrome-extension://` protocol

See `tests/extension/popup.spec.ts` for an example.