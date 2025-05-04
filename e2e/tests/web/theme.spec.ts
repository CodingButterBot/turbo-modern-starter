import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Tests for dark mode functionality
 */
test.describe('Theme functionality', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForPageLoad();
  });

  test('should detect system theme preference', async ({ homePage, page }) => {
    // Skip if no theme toggle exists
    if (!await homePage.exists(homePage.themeToggle)) {
      test.skip('Theme toggle not found on the page');
      return;
    }

    // Emulate system dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await homePage.waitForPageLoad();

    // Verify the site is in dark mode when system prefers dark
    if (await homePage.exists(homePage.themeToggle)) {
      // Force theme to "system" by evaluating JS directly
      await page.evaluate(() => {
        localStorage.setItem('theme', 'system');
        window.location.reload();
      });
      await homePage.waitForPageLoad();
      expect(await homePage.isDarkMode()).toBe(true);
    }

    // Emulate system light mode preference
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    await homePage.waitForPageLoad();

    // Verify the site is in light mode when system prefers light
    if (await homePage.exists(homePage.themeToggle)) {
      // Force theme to "system" by evaluating JS directly
      await page.evaluate(() => {
        localStorage.setItem('theme', 'system');
        window.location.reload();
      });
      await homePage.waitForPageLoad();
      expect(await homePage.isDarkMode()).toBe(false);
    }
  });

  test('should persist theme preference across page loads', async ({ homePage, page }) => {
    // Skip if no theme toggle exists
    if (!await homePage.exists(homePage.themeToggle)) {
      test.skip('Theme toggle not found on the page');
      return;
    }

    // Get initial theme state
    const initialIsDark = await homePage.isDarkMode();
    
    // Toggle theme
    await homePage.toggleTheme();
    
    // Verify theme changed
    const newIsDark = await homePage.isDarkMode();
    expect(newIsDark).not.toBe(initialIsDark);
    
    // Reload the page
    await page.reload();
    await homePage.waitForPageLoad();
    
    // Verify theme persisted after reload
    const persistedIsDark = await homePage.isDarkMode();
    expect(persistedIsDark).toBe(newIsDark);
  });

  test('should toggle theme when clicking theme button', async ({ homePage }) => {
    // Skip if no theme toggle exists
    if (!await homePage.exists(homePage.themeToggle)) {
      test.skip('Theme toggle not found on the page');
      return;
    }

    // Get initial theme state
    const initialIsDark = await homePage.isDarkMode();
    
    // Toggle theme
    await homePage.toggleTheme();
    
    // Verify theme changed
    const afterToggleIsDark = await homePage.isDarkMode();
    expect(afterToggleIsDark).not.toBe(initialIsDark);
    
    // Toggle theme again
    await homePage.toggleTheme();
    
    // Verify theme changed back
    const afterSecondToggleIsDark = await homePage.isDarkMode();
    expect(afterSecondToggleIsDark).toBe(initialIsDark);
  });

  test('should apply appropriate CSS classes for current theme', async ({ homePage, page }) => {
    // Skip if no theme toggle exists
    if (!await homePage.exists(homePage.themeToggle)) {
      test.skip('Theme toggle not found on the page');
      return;
    }

    // Check dark mode status
    const isDark = await homePage.isDarkMode();
    
    // Verify root element has appropriate class or data attribute
    const hasCorrectClass = await page.evaluate((dark) => {
      const html = document.documentElement;
      
      // Check various implementations
      if (dark) {
        return html.classList.contains('dark') || 
               html.dataset.theme === 'dark' ||
               html.getAttribute('data-mode') === 'dark';
      } else {
        return !html.classList.contains('dark') || 
               html.dataset.theme === 'light' ||
               html.getAttribute('data-mode') === 'light';
      }
    }, isDark);
    
    expect(hasCorrectClass).toBe(true);
    
    // Toggle theme
    await homePage.toggleTheme();
    
    // Verify classes changed appropriately
    const newIsDark = await homePage.isDarkMode();
    const hasNewCorrectClass = await page.evaluate((dark) => {
      const html = document.documentElement;
      
      if (dark) {
        return html.classList.contains('dark') || 
               html.dataset.theme === 'dark' ||
               html.getAttribute('data-mode') === 'dark';
      } else {
        return !html.classList.contains('dark') || 
               html.dataset.theme === 'light' ||
               html.getAttribute('data-mode') === 'light';
      }
    }, newIsDark);
    
    expect(hasNewCorrectClass).toBe(true);
  });

  test('should apply different styles based on theme', async ({ homePage, page }) => {
    // Skip if no theme toggle exists
    if (!await homePage.exists(homePage.themeToggle)) {
      test.skip('Theme toggle not found on the page');
      return;
    }

    // Get initial colors
    const initialBgColor = await getBgColor(page);
    const initialTextColor = await getTextColor(page);
    
    // Toggle theme
    await homePage.toggleTheme();
    
    // Get new colors after theme change
    const newBgColor = await getBgColor(page);
    const newTextColor = await getTextColor(page);
    
    // Verify colors changed
    expect(initialBgColor).not.toBe(newBgColor);
    expect(initialTextColor).not.toBe(newTextColor);
  });
});

/**
 * Helper function to get the background color of the body element
 */
async function getBgColor(page: any): Promise<string> {
  return page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });
}

/**
 * Helper function to get the text color of the body element
 */
async function getTextColor(page: any): Promise<string> {
  return page.evaluate(() => {
    return window.getComputedStyle(document.body).color;
  });
}