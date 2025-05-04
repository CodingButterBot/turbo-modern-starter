import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * Page object model for the documentation page
 */
export class DocsPage extends BasePage {
  // Locators
  readonly navigation: Locator;
  readonly navItems: Locator;
  readonly mainContent: Locator;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly searchResults: Locator;

  constructor(page: Page) {
    super(page);
    this.navigation = page.locator('nav');
    this.navItems = page.locator('nav a');
    this.mainContent = page.locator('main');
    this.heading = page.locator('h1, h2').first();
    this.searchInput = page.getByRole('textbox', { name: /search/i });
    this.searchResults = page.locator('[data-testid="search-results"]');
  }

  /**
   * Navigate to the docs page
   */
  async goto(): Promise<void> {
    await this.navigate('/docs');
  }

  /**
   * Wait for the docs page to load
   */
  async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.mainContent.waitFor();
  }

  /**
   * Click on a navigation item
   * @param index - The index of the item to click (defaults to the first item)
   */
  async clickNavItem(index = 0): Promise<void> {
    if (await this.navItems.count() > index) {
      await this.navItems.nth(index).click();
      await this.mainContent.waitFor();
    }
  }

  /**
   * Perform a search
   * @param searchTerm - The term to search for
   */
  async search(searchTerm: string): Promise<void> {
    if (await this.searchInput.isVisible()) {
      await this.searchInput.fill(searchTerm);
      await this.searchInput.press('Enter');
      await this.page.waitForTimeout(500); // Wait for search results to load
    }
  }

  /**
   * Check if search results are visible
   */
  async hasSearchResults(): Promise<boolean> {
    return await this.searchResults.isVisible();
  }
}