import { test as base, Page, BrowserContext, chromium, expect, Browser } from '@playwright/test';
import { HomePage } from '../utils/pages/HomePage';
import { DocsPage } from '../utils/pages/DocsPage';
import { ExtensionPopupPage } from '../utils/pages/ExtensionPopupPage';
import { createContextWithExtension, clearBrowserStorage, wait } from '../utils/test-helpers';
import * as path from 'path';
import * as fs from 'fs';

// Define the fixture type with page objects
type Fixtures = {
  homePage: HomePage;
  docsPage: DocsPage;
  extensionPopupPage: ExtensionPopupPage;
  cleanPage: Page;
  extensionContext: BrowserContext;
  extensionPath: string;
  extensionBrowser: Browser;
  saveScreenshotOnFailure: void;
  resetBrowserState: void;
  deviceEmulation: (deviceName: string) => Promise<void>;
  testInfo: {
    title: string;
    testPath: string;
    retry: number;
    error?: Error;
  };
};

/**
 * Extend the base test with custom fixtures
 * This allows us to provide pre-configured page objects to all tests
 */
export const test = base.extend<Fixtures>({
  // Store test info for logging and debugging
  testInfo: [async ({}, use, testInfo) => {
    await use({
      title: testInfo.title,
      testPath: testInfo.file,
      retry: testInfo.retry,
    });
  }, { auto: true }],

  // Create a reset browser state fixture to clear storage and cookies before tests
  resetBrowserState: [async ({ page }, use) => {
    // Clear browser storage before test
    await clearBrowserStorage(page);

    // Clear cookies
    await page.context().clearCookies();
    
    // Reset viewport to desktop default
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Reset emulation to default
    await page.emulateMedia({ colorScheme: 'light' });
    
    await use();
    
    // Clean up after test
    await clearBrowserStorage(page);
    await page.context().clearCookies();
  }, { auto: true }],

  // Device emulation fixture
  deviceEmulation: async ({ page }, use) => {
    const emulateDevice = async (deviceName: string) => {
      const devices = {
        'desktop': { width: 1280, height: 800 },
        'tablet': { width: 768, height: 1024 },
        'mobile': { width: 375, height: 667 },
        'iPhone': { width: 375, height: 812 },
        'iPad': { width: 768, height: 1024 },
      };
      
      type DeviceKey = keyof typeof devices;
      
      if (deviceName in devices) {
        const device = devices[deviceName as DeviceKey];
        await page.setViewportSize(device);
      } else {
        throw new Error(`Unknown device: ${deviceName}`);
      }
    };
    
    await use(emulateDevice);
  },
  
  // Save screenshot on test failure
  saveScreenshotOnFailure: [async ({ page }, use, testInfo) => {
    await use();
    
    if (testInfo.status !== 'passed') {
      // Create directories if they don't exist
      const screenshotDir = path.join(__dirname, '../test-results/screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      // Save screenshot with test name
      const fileName = `${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
      await page.screenshot({
        path: path.join(screenshotDir, fileName),
        fullPage: true,
      });
      
      // Attach screenshot to test result
      testInfo.attachments.push({
        name: 'screenshot',
        path: path.join(screenshotDir, fileName),
        contentType: 'image/png',
      });
    }
  }, { auto: true }],

  // Provide a fresh, clean page for tests that need it
  cleanPage: async ({ page, resetBrowserState }, use) => {
    // Reset is automatic due to auto: true
    await use(page);
  },

  // Create HomePage object for tests
  homePage: async ({ page, resetBrowserState }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  // Create DocsPage object for tests
  docsPage: async ({ page, resetBrowserState }, use) => {
    const docsPage = new DocsPage(page);
    await use(docsPage);
  },

  // Store extension path for reuse
  extensionPath: async ({}, use) => {
    const extensionPath = path.join(__dirname, '../../apps/extension/dist');
    await use(extensionPath);
  },

  // Create and manage extension browser
  extensionBrowser: async ({ extensionPath }, use) => {
    const browser = await chromium.launch({
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`
      ]
    });
    
    await use(browser);
    
    await browser.close();
  },

  // Create context with extension loaded
  extensionContext: async ({ extensionBrowser }, use) => {
    const context = await extensionBrowser.newContext({
      viewport: { width: 400, height: 600 },
      userAgent: 'playwright-test',
      permissions: ['clipboard-read'],
    });
    
    await use(context);
    
    await context.close();
  },

  // Create ExtensionPopupPage object for tests
  extensionPopupPage: async ({ extensionContext }, use) => {
    const page = await extensionContext.newPage();
    const extensionPopupPage = new ExtensionPopupPage(page);
    
    // Wait for page to be ready
    await wait(500);
    
    await use(extensionPopupPage);
    
    await page.close();
  },
});

// Add global setup and teardown
test.beforeAll(async () => {
  // Global setup code - run once before all tests
  console.log('Starting E2E test suite');
  
  // Create directories for test artifacts if they don't exist
  const dirs = [
    path.join(__dirname, '../test-results'),
    path.join(__dirname, '../test-results/screenshots'),
    path.join(__dirname, '../test-results/videos'),
    path.join(__dirname, '../test-results/traces'),
  ];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
});

test.afterAll(async () => {
  // Global teardown code - run once after all tests
  console.log('Completed E2E test suite');
});

// Export expect for convenience
export { expect };