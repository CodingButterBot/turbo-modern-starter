import { test, expect } from '../../fixtures/test-fixtures';

/**
 * End-to-end test for the home page
 */
test.describe('Home page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForPageLoad();
  });

  test('should load correctly', async ({ homePage }) => {
    // Verify the page has loaded with the correct title
    await homePage.hasTitle(/Turbo Modern Starter/);
    
    // Check for essential elements
    expect(await homePage.isVisible(homePage.heading)).toBe(true);
    expect(await homePage.isVisible(homePage.header)).toBe(true);
    expect(await homePage.isVisible(homePage.main)).toBe(true);
    expect(await homePage.isVisible(homePage.footer)).toBe(true);
    
    // Verify the heading text
    const headingText = await homePage.getText(homePage.heading);
    expect(headingText).not.toBeNull();
    expect(headingText?.trim().length).toBeGreaterThan(0);
  });
  
  test('should have working navigation links', async ({ homePage }) => {
    // Find and check navigation links
    const navLinksCount = await homePage.navigationLinks.count();
    expect(navLinksCount).toBeGreaterThan(0);
    
    if (navLinksCount > 0) {
      // Verify first link
      const firstLink = homePage.navigationLinks.first();
      expect(await homePage.isVisible(firstLink)).toBe(true);
      
      // Click and verify navigation
      await homePage.clickFirstNavLink();
      
      // Return to home page for other tests
      await homePage.goto();
      await homePage.waitForPageLoad();
    }
  });
  
  test('should navigate through all main links', async ({ homePage }) => {
    const pageTitles = await homePage.navigateThroughMainLinks();
    
    // Verify we navigated to at least one page if links exist
    const navLinksCount = await homePage.navigationLinks.count();
    if (navLinksCount > 0) {
      expect(pageTitles.length).toBeGreaterThan(0);
    }
  });
  
  test('should have theme toggle functionality if available', async ({ homePage }) => {
    if (await homePage.exists(homePage.themeToggle)) {
      // Check the initial theme state
      const initialIsDark = await homePage.isDarkMode();
      
      // Toggle the theme
      await homePage.toggleTheme();
      
      // Verify the theme changed
      const newIsDark = await homePage.isDarkMode();
      expect(newIsDark).not.toBe(initialIsDark);
      
      // Toggle back to initial state
      await homePage.toggleTheme();
      
      // Verify we're back to the initial state
      const finalIsDark = await homePage.isDarkMode();
      expect(finalIsDark).toBe(initialIsDark);
    }
  });
  
  test('should be responsive on different screen sizes', async ({ homePage }) => {
    // Test desktop size
    await homePage.testResponsiveness(1280, 800);
    expect(await homePage.isVisible(homePage.header)).toBe(true);
    
    // Test tablet size
    await homePage.testResponsiveness(768, 1024);
    expect(await homePage.isVisible(homePage.header)).toBe(true);
    
    // Test mobile size
    await homePage.testResponsiveness(375, 667);
    expect(await homePage.isVisible(homePage.header)).toBe(true);
    
    // If mobile menu button exists on small screens, verify it's visible
    if (await homePage.exists(homePage.mobileMenuButton)) {
      expect(await homePage.isVisible(homePage.mobileMenuButton)).toBe(true);
    }
  });
  
  test('should show feature cards if available', async ({ homePage }) => {
    const featureCardsCount = await homePage.getFeatureCardsCount();
    
    // If feature cards exist, verify at least one is visible
    if (featureCardsCount > 0) {
      const firstCard = homePage.featureCards.first();
      expect(await homePage.isVisible(firstCard)).toBe(true);
    }
  });
  
  test('should have functioning logo that returns to home page', async ({ homePage, page }) => {
    // Only test if the logo exists
    if (await homePage.exists(homePage.logo)) {
      // First, navigate to another page if there are navigation links
      const navLinksCount = await homePage.navigationLinks.count();
      if (navLinksCount > 0) {
        await homePage.clickFirstNavLink();
        // Then click the logo to return to home
        await homePage.clickLogo();
        // Verify we're back home
        await homePage.hasURL(/\/$/);
      }
    }
  });
});

/**
 * Test for accessibility
 */
test.describe('Accessibility', () => {
  test('should have proper semantic structure', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForPageLoad();
    
    // Check for semantic structure
    expect(await homePage.isVisible(homePage.header)).toBe(true);
    expect(await homePage.isVisible(homePage.main)).toBe(true);
    expect(await homePage.isVisible(homePage.footer)).toBe(true);
  });
  
  test('should have accessible buttons', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForPageLoad();
    
    // Perform accessibility checks for buttons
    await homePage.checkAccessibility();
  });
  
  test('should work with keyboard navigation', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForPageLoad();
    
    // Tab through the page and verify focus states
    await homePage.pressKey('Tab');
    
    // Wait a moment to let focus be applied
    await homePage.page.waitForTimeout(100);
    
    // Verify we can tab through the page (basic keyboard navigation)
    const activeElement = await homePage.page.evaluate(() => {
      return document.activeElement?.tagName.toLowerCase();
    });
    
    // Check if we have an active element (like a link or button)
    expect(['a', 'button', 'input']).toContain(activeElement);
  });
});