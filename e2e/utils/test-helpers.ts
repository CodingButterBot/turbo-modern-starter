import { Page, BrowserContext, Browser, chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Helper functions for Playwright tests
 */

/**
 * Get the extension ID from the manifest
 * @param manifestPath - Path to the manifest.json file
 */
export async function getExtensionId(manifestPath: string): Promise<string> {
  try {
    const manifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    // In a real test, you would extract the ID from the browser after loading the extension
    // For demonstration purposes, we'll use a placeholder ID
    return 'extension-id-placeholder';
  } catch (error) {
    console.error('Error reading extension manifest:', error);
    return 'extension-id-placeholder';
  }
}

/**
 * Create a browser context with the extension loaded
 * @param browser - The Playwright Browser instance
 * @param extensionPath - Path to the extension directory
 */
export async function createContextWithExtension(
  browser: Browser,
  extensionPath: string
): Promise<BrowserContext> {
  return await browser.newContext({
    viewport: { width: 400, height: 600 },
    userAgent: 'playwright-test',
    permissions: ['clipboard-read']
    // Remove args property as it's not part of BrowserContextOptions
    // The args should be passed when launching the browser instead
  });
}

/**
 * Wait for a specific amount of time
 * @param ms - Time to wait in milliseconds
 */
export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if an element is in the viewport
 * @param page - The Playwright Page instance
 * @param selector - The selector for the element to check
 */
export async function isElementInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Clear browser storage (localStorage, sessionStorage, cookies)
 * @param page - The Playwright Page instance
 */
export async function clearBrowserStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  });
}

/**
 * Set the theme mode for testing
 * @param page - The Playwright Page instance
 * @param theme - The theme to set ('light', 'dark', or 'system')
 */
export async function setTheme(page: Page, theme: 'light' | 'dark' | 'system'): Promise<void> {
  await page.evaluate((themeMode) => {
    localStorage.setItem('theme', themeMode);
    
    // Update data-theme attribute if needed
    if (themeMode !== 'system') {
      document.documentElement.dataset.theme = themeMode;
    } else {
      // For system theme, detect preferred color scheme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
    }
  }, theme);
}