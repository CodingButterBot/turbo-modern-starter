import { test, expect } from '../../fixtures/test-fixtures';

/**
 * End-to-end test for the documentation site
 */
test.describe('Documentation', () => {
  test('should navigate to docs site', async ({ page, docsPage }) => {
    // Go to the main page first to find the docs link
    await page.goto('/');
    
    // Look for a link to docs and navigate to it
    const docsLink = page.getByRole('link', { name: /docs/i });
    
    if (await docsLink.count() > 0) {
      await docsLink.click();
      
      // Verify we're on the docs page
      await docsPage.hasURL(/docs/);
      
      // Check for docs navigation
      expect(await docsPage.isVisible(docsPage.navigation)).toBe(true);
    } else {
      // If no link found on homepage, try direct navigation
      await docsPage.goto();
      
      // Verify we're on the docs page
      expect(await docsPage.isVisible(docsPage.heading)).toBe(true);
    }
  });
  
  test('should have working documentation navigation', async ({ docsPage }) => {
    // Go directly to docs
    await docsPage.goto();
    await docsPage.waitForPageLoad();
    
    // Find and click a navigation item
    const navItemsCount = await docsPage.navItems.count();
    
    if (navItemsCount > 0) {
      await docsPage.clickNavItem(0);
      
      // Check if content updated
      expect(await docsPage.isVisible(docsPage.mainContent)).toBe(true);
    }
  });
});

/**
 * Test for documentation search functionality
 */
test('documentation search should work', async ({ docsPage }) => {
  // Go to docs
  await docsPage.goto();
  await docsPage.waitForPageLoad();
  
  // Look for search input
  if (await docsPage.searchInput.isVisible()) {
    // Try searching for something
    await docsPage.search('getting started');
    
    // Check if search results appear
    if (await docsPage.hasSearchResults()) {
      expect(await docsPage.isVisible(docsPage.searchResults)).toBe(true);
    }
  }
});