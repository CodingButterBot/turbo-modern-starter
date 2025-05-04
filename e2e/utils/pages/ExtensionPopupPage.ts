import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * Page object model for the browser extension popup
 */
export class ExtensionPopupPage extends BasePage {
  // Locators
  readonly heading: Locator;
  readonly buttons: Locator;
  readonly content: Locator;
  readonly spinButton: Locator;
  readonly resetButton: Locator;
  readonly result: Locator;
  readonly logo: Locator;
  readonly themeToggle: Locator;
  readonly toolbar: Locator;
  readonly errorMessage: Locator;
  readonly version: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1, h2').first();
    this.buttons = page.locator('button');
    this.content = page.locator('#app, #root, .App');
    this.spinButton = page.locator('button:has-text("Spin"), [data-testid="spin-button"]');
    this.resetButton = page.locator('button:has-text("Reset"), [data-testid="reset-button"]');
    this.result = page.locator('[data-testid="result"], .result, #result');
    this.logo = page.locator('.logo, [data-testid="logo"]');
    this.themeToggle = page.locator('[data-testid="theme-toggle"], button:has([aria-label="Toggle theme"])');
    this.toolbar = page.locator('.toolbar, [data-testid="toolbar"]');
    this.errorMessage = page.locator('.error, [data-testid="error"]');
    this.version = page.locator('.version, [data-testid="version"]');
  }

  /**
   * Navigate to the extension popup
   * Note: This requires the extension to be loaded in the browser context
   * @param extensionId - The ID of the extension
   */
  async goto(extensionId: string): Promise<void> {
    await this.navigate(`chrome-extension://${extensionId}/popup.html`);
  }

  /**
   * Wait for the popup to load
   */
  async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.content.waitFor();
  }

  /**
   * Click the spin button and wait for results
   */
  async clickSpin(): Promise<void> {
    if (await this.exists(this.spinButton)) {
      await this.spinButton.click();
      // Wait for result to appear if it exists
      if (await this.exists(this.result)) {
        await this.waitForVisible(this.result);
      }
    }
  }

  /**
   * Click the reset button
   */
  async clickReset(): Promise<void> {
    if (await this.exists(this.resetButton)) {
      await this.resetButton.click();
      // If result exists, wait for it to be hidden
      if (await this.exists(this.result)) {
        try {
          await this.waitForHidden(this.result, 1000);
        } catch (error) {
          // Result might already be hidden or not exist
        }
      }
    }
  }

  /**
   * Get the result text
   */
  async getResultText(): Promise<string | null> {
    if (await this.exists(this.result) && await this.isVisible(this.result)) {
      return await this.getText(this.result);
    }
    return null;
  }

  /**
   * Toggle the theme if the toggle button exists
   */
  async toggleTheme(): Promise<void> {
    if (await this.exists(this.themeToggle)) {
      const isDarkBefore = await this.isDarkMode();
      await this.themeToggle.click();
      
      // Wait for the theme to change
      await this.waitForCondition(async () => {
        const isDarkAfter = await this.isDarkMode();
        return isDarkBefore !== isDarkAfter;
      }, 2000);
    }
  }

  /**
   * Check if the popup UI has rendered correctly
   */
  async hasRenderedCorrectly(): Promise<boolean> {
    const headingVisible = await this.heading.isVisible();
    const contentVisible = await this.content.isVisible();
    const buttonsCount = await this.buttons.count();
    
    return headingVisible && contentVisible && buttonsCount > 0;
  }

  /**
   * Perform a full interaction test (spin and reset)
   */
  async testFullInteraction(): Promise<boolean> {
    // Click spin and check for results
    await this.clickSpin();
    const resultAfterSpin = await this.getResultText();
    const hasResult = resultAfterSpin !== null && resultAfterSpin.length > 0;
    
    // Click reset and check results are cleared
    if (hasResult && await this.exists(this.resetButton)) {
      await this.clickReset();
      const resultAfterReset = await this.getResultText();
      return resultAfterReset === null || resultAfterReset === '';
    }
    
    return hasResult;
  }

  /**
   * Get the extension version from the UI
   */
  async getVersion(): Promise<string | null> {
    if (await this.exists(this.version)) {
      return await this.getText(this.version);
    }
    return null;
  }

  /**
   * Check if an error message is displayed
   */
  async hasError(): Promise<boolean> {
    return await this.exists(this.errorMessage) && await this.isVisible(this.errorMessage);
  }

  /**
   * Click a button in the popup
   * @param index - The index of the button to click (defaults to the first button)
   */
  async clickButton(index = 0): Promise<void> {
    if (await this.buttons.count() > index) {
      await this.buttons.nth(index).click();
    }
  }
}