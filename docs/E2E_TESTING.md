# End-to-End Testing with Playwright

This project uses [Playwright](https://playwright.dev/) for end-to-end (E2E) testing of the web applications.

## Getting Started

### Installation

Playwright is included as a dev dependency in the project. You need to install the browsers:

```bash
# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all E2E tests
pnpm e2e

# Run tests with UI mode (great for debugging)
pnpm e2e:ui

# Run tests in debug mode
pnpm e2e:debug

# View the last test report
pnpm e2e:report
```

## Test Structure

The E2E tests are organized in the following structure:

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

## Page Object Model Pattern

We use the Page Object Model pattern to encapsulate page behavior and improve test maintainability:

```typescript
// Example page object in e2e/utils/pages/HomePage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class HomePage extends BasePage {
  readonly heading: Locator;
  readonly navigationLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1');
    this.navigationLinks = page.locator('nav a');
  }

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.heading.waitFor();
  }
}
```

## Test Fixtures

Custom fixtures provide pre-configured page objects and contexts to tests:

```typescript
// Example test using fixtures in e2e/tests/web/home.spec.ts
import { test, expect } from '../../fixtures/test-fixtures';

test('should load correctly', async ({ homePage }) => {
  await homePage.goto();
  await homePage.waitForPageLoad();
  
  // Verify the page has loaded
  await homePage.hasTitle(/Turbo Modern Starter/);
  
  // Check for essential elements
  expect(await homePage.isVisible(homePage.heading)).toBe(true);
});
```

## Writing Tests

Here's an example of a basic test using page objects:

```typescript
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('My Feature', () => {
  test('should work correctly', async ({ homePage }) => {
    // Navigate to the page
    await homePage.goto();
    await homePage.waitForPageLoad();
    
    // Check for element visibility
    expect(await homePage.isVisible(homePage.heading)).toBe(true);
    
    // Interact with the page
    await homePage.clickButton('Sign In');
    
    // Verify results
    expect(await homePage.isVisible(homePage.userProfile)).toBe(true);
  });
});
```

## Test Configuration

The Playwright configuration is defined in `e2e/playwright.config.ts`. Key configurations include:

- **Browsers**: Tests run on Chromium, Firefox, and WebKit by default
- **Mobile Viewports**: Tests also run on mobile viewports (Pixel 5, iPhone 12)
- **Screenshots**: Captured on test failures
- **Videos**: Recorded on first retry
- **Traces**: Captured on first retry to help with debugging

## Continuous Integration

E2E tests are automatically run in the CI/CD pipeline via GitHub Actions. The workflow is defined in `.github/workflows/e2e.yml`.

Test artifacts (screenshots, videos, traces) from CI runs are available as workflow artifacts and can be downloaded for debugging failed tests.

## Testing Browser Extensions

Testing browser extensions requires special configuration:

1. The extension must be built before testing
2. A special browser context must be created with the extension loaded
3. Tests navigate to extension pages using the `chrome-extension://` protocol

See `e2e/tests/extension/popup.spec.ts` and `e2e/fixtures/test-fixtures.ts` for examples.

## Best Practices

1. **Keep tests independent**: Each test should be able to run independently of others
2. **Use page objects**: Organize selectors and actions in page object models
3. **Focus on user flows**: Test key user journeys rather than implementation details
4. **Accessibility testing**: Include checks for accessibility in your tests
5. **Visual testing**: Use Playwright's screenshot comparison when needed

## Debugging Tips

- Use `await page.pause()` to pause execution during test runs
- Use `pnpm e2e:ui` to run tests with the interactive UI mode
- Use `pnpm e2e:debug` for more debugging features
- Check the test report for screenshots, videos, and traces of failed tests

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Test Assertions](https://playwright.dev/docs/test-assertions)
- [Page Object Models with Playwright](https://playwright.dev/docs/test-pom)