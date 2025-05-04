import { Page, Locator, expect, ElementHandle } from '@playwright/test';
import { setTheme } from './test-helpers';

/**
 * Base class for page object models
 * Provides common functionality for all page objects
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to the specified path
   * @param path - The path to navigate to
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait for page to be loaded
   * Override in specific page objects to wait for specific elements
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if the element is visible on the page
   * @param locator - The locator for the element
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Check if the page title contains the specified text
   * @param title - The text to check for in the page title
   */
  async hasTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  /**
   * Check if the page URL contains the specified text
   * @param url - The text to check for in the page URL
   */
  async hasURL(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  /**
   * Capture a screenshot
   * @param name - Name for the screenshot file
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `./test-results/screenshots/${name}.png` });
  }

  /**
   * Fills an input field with the given value
   * @param locator - The locator for the input field
   * @param value - The value to fill in
   */
  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  /**
   * Clicks an element and waits for navigation to complete
   * @param locator - The locator for the element to click
   */
  async clickAndWaitForNavigation(locator: Locator): Promise<void> {
    await Promise.all([
      this.page.waitForNavigation(),
      locator.click()
    ]);
  }

  /**
   * Get the text content of an element
   * @param locator - The locator for the element
   */
  async getText(locator: Locator): Promise<string | null> {
    return await locator.textContent();
  }

  /**
   * Get an attribute value of an element
   * @param locator - The locator for the element
   * @param attributeName - The name of the attribute
   */
  async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
    return await locator.getAttribute(attributeName);
  }

  /**
   * Check if an element has a specific CSS class
   * @param locator - The locator for the element
   * @param className - The CSS class to check for
   */
  async hasClass(locator: Locator, className: string): Promise<boolean> {
    const classes = await locator.getAttribute('class');
    return classes?.split(' ').includes(className) || false;
  }

  /**
   * Wait for an element to be visible
   * @param locator - The locator for the element
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   * @param locator - The locator for the element
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Check if an element exists in the DOM
   * @param locator - The locator for the element
   */
  async exists(locator: Locator): Promise<boolean> {
    return await locator.count() > 0;
  }

  /**
   * Hover over an element
   * @param locator - The locator for the element
   */
  async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  /**
   * Press a keyboard key
   * @param key - The key to press
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Set the theme mode for testing
   * @param theme - The theme to set ('light', 'dark', or 'system')
   */
  async setTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
    await setTheme(this.page, theme);
  }

  /**
   * Check if the page is in dark mode
   */
  async isDarkMode(): Promise<boolean> {
    const theme = await this.page.evaluate(() => {
      return document.documentElement.dataset.theme || 
             document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
    return theme === 'dark';
  }

  /**
   * Select an option from a dropdown
   * @param locator - The locator for the dropdown element
   * @param value - The value to select
   */
  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Check if a radio button or checkbox is checked
   * @param locator - The locator for the radio button or checkbox
   */
  async isChecked(locator: Locator): Promise<boolean> {
    return locator.isChecked();
  }

  /**
   * Wait for a specific condition to be true
   * @param conditionFn - A function that returns a promise resolving to a boolean
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForCondition(
    conditionFn: () => Promise<boolean>,
    timeout = 30000
  ): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await conditionFn()) {
        return;
      }
      await this.page.waitForTimeout(100);
    }
    throw new Error(`Timeout (${timeout}ms) waiting for condition`);
  }
}