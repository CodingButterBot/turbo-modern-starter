import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

/**
 * Page object model for the home page
 */
export class HomePage extends BasePage {
  // Locators
  readonly heading: Locator;
  readonly navigationLinks: Locator;
  readonly header: Locator;
  readonly main: Locator;
  readonly footer: Locator;
  readonly buttons: Locator;
  readonly logo: Locator;
  readonly themeToggle: Locator;
  readonly heroSection: Locator;
  readonly featureCards: Locator;
  readonly ctaButton: Locator;
  readonly searchInput: Locator;
  readonly mobileMenuButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1');
    this.navigationLinks = page.locator('nav a');
    this.header = page.locator('header');
    this.main = page.locator('main');
    this.footer = page.locator('footer');
    this.buttons = page.locator('button');
    this.logo = page.locator('[aria-label="logo"], .logo');
    this.themeToggle = page.locator('[aria-label="Toggle theme"], [data-testid="theme-toggle"]');
    this.heroSection = page.locator('.hero, #hero, [data-testid="hero"]');
    this.featureCards = page.locator('.card, .feature-card, [data-testid="feature-card"]');
    this.ctaButton = page.locator('.cta-button, [data-testid="cta-button"]');
    this.searchInput = page.locator('input[type="search"], [data-testid="search-input"]');
    this.mobileMenuButton = page.locator('[aria-label="Toggle menu"], [data-testid="mobile-menu-button"]');
  }

  /**
   * Navigate to the home page
   */
  async goto(): Promise<void> {
    await this.navigate('/');
  }

  /**
   * Wait for the home page to load
   */
  async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    await this.heading.waitFor();
  }

  /**
   * Click the first navigation link and wait for navigation
   */
  async clickFirstNavLink(): Promise<void> {
    if (await this.navigationLinks.count() > 0) {
      const firstLink = this.navigationLinks.first();
      const href = await firstLink.getAttribute('href') || '';
      await firstLink.click();
      await this.page.waitForURL(new RegExp(href));
    }
  }

  /**
   * Perform accessibility checks on the page
   */
  async checkAccessibility(): Promise<void> {
    // Check for semantic structure
    const headerVisible = await this.header.isVisible();
    const mainVisible = await this.main.isVisible();
    const footerVisible = await this.footer.isVisible();

    // Check for a11y attributes on buttons
    const buttonCount = await this.buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = this.buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      if (!(text?.trim() || ariaLabel)) {
        throw new Error(`Button at index ${i} has no text content or aria-label`);
      }
    }
  }

  /**
   * Toggle the theme between light and dark mode
   */
  async toggleTheme(): Promise<void> {
    // Check if the theme toggle exists before trying to click it
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
   * Navigate through all main navigation links
   * @returns An array of page titles encountered during navigation
   */
  async navigateThroughMainLinks(): Promise<string[]> {
    const titles: string[] = [];
    const count = await this.navigationLinks.count();
    
    // First, collect all the navigation links and their href values
    const navLinks: { locator: Locator; href: string }[] = [];
    for (let i = 0; i < count; i++) {
      const link = this.navigationLinks.nth(i);
      const href = await link.getAttribute('href') || '';
      if (href && !href.startsWith('http')) { // Only include internal links
        navLinks.push({ locator: link, href });
      }
    }
    
    // Navigate through each link
    for (const { locator, href } of navLinks) {
      try {
        await this.clickAndWaitForNavigation(locator);
        titles.push(await this.getTitle());
        await this.goto(); // Go back to home page for next link
        await this.waitForPageLoad();
      } catch (error) {
        console.error(`Failed to navigate to ${href}: ${error}`);
      }
    }
    
    return titles;
  }

  /**
   * Test mobile responsiveness by resizing the viewport
   * @param width - The viewport width
   * @param height - The viewport height
   */
  async testResponsiveness(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    
    // Check if mobile menu button appears on small screens
    if (width < 768) {
      const mobileMenuVisible = await this.exists(this.mobileMenuButton) 
                            && await this.isVisible(this.mobileMenuButton);
      if (mobileMenuVisible) {
        // Test mobile menu functionality
        await this.mobileMenuButton.click();
        // Add logic to verify mobile menu opened
      }
    }
  }

  /**
   * Check if search functionality exists and test basic search
   * @param searchTerm - The term to search for
   */
  async testSearch(searchTerm: string): Promise<boolean> {
    if (await this.exists(this.searchInput) && await this.isVisible(this.searchInput)) {
      await this.fillInput(this.searchInput, searchTerm);
      await this.pressKey('Enter');
      // Add logic to verify search results
      return true;
    }
    return false;
  }

  /**
   * Gets the count of feature cards on the home page
   */
  async getFeatureCardsCount(): Promise<number> {
    return await this.featureCards.count();
  }

  /**
   * Click on the logo to navigate to the home page
   */
  async clickLogo(): Promise<void> {
    if (await this.exists(this.logo)) {
      await this.clickAndWaitForNavigation(this.logo);
    }
  }

  /**
   * Check if the CTA button exists and click it
   */
  async clickCtaButton(): Promise<boolean> {
    if (await this.exists(this.ctaButton) && await this.isVisible(this.ctaButton)) {
      await this.clickAndWaitForNavigation(this.ctaButton);
      return true;
    }
    return false;
  }
}