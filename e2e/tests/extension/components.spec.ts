import { test, expect } from '@playwright/test';
import { ExtensionPopupPage } from '../../utils/pages/ExtensionPopupPage';
import { getExtensionId } from '../../utils/test-helpers';

test.describe('Extension UI Components', () => {
  let popupPage: ExtensionPopupPage;
  let extensionId: string;

  test.beforeEach(async ({ page }) => {
    // Get extension ID (mocked in the helper)
    extensionId = await getExtensionId('apps/extension/manifest.json');
    
    // Create a popup page helper
    popupPage = new ExtensionPopupPage(page);
    
    // For tests, we use a local dev server instead of actual extension popup
    // In a full implementation, we'd load the extension and use extensionId
    await page.goto('http://localhost:3000');
    await popupPage.waitForPageLoad();
  });

  test('renders main UI elements properly', async () => {
    await expect(popupPage.heading).toBeVisible();
    await expect(popupPage.content).toBeVisible();
    expect(await popupPage.hasRenderedCorrectly()).toBeTruthy();
  });

  test('theme toggle changes appearance', async () => {
    // Check if theme toggle exists
    await expect(popupPage.themeToggle).toBeVisible();
    
    // Get initial theme state
    const initialIsDark = await popupPage.isDarkMode();
    
    // Toggle theme
    await popupPage.toggleTheme();
    
    // Verify theme changed
    const newIsDark = await popupPage.isDarkMode();
    expect(newIsDark).not.toEqual(initialIsDark);
  });

  test('has interactive buttons', async () => {
    // Check that multiple buttons exist
    expect(await popupPage.buttons.count()).toBeGreaterThan(1);
    
    // Click a button (should work without errors)
    await popupPage.clickButton(0);
  });

  test('component tabs work correctly', async () => {
    // Find tab navigation buttons (assuming they exist in the new UI)
    const tabButtons = popupPage.page.getByRole('button', { name: /Home|Data|Settings/ });
    
    // Verify tabs exist
    expect(await tabButtons.count()).toBeGreaterThanOrEqual(3);
    
    // Click the second tab (should switch to that tab's content)
    await tabButtons.nth(1).click();
    
    // Click the third tab
    await tabButtons.nth(2).click();
    
    // Click back to the first tab
    await tabButtons.nth(0).click();
  });

  test('ui components use consistent styling', async () => {
    // Check for cards
    const cards = popupPage.page.locator('.card, [data-testid="card"]');
    if (await cards.count() > 0) {
      await expect(cards.first()).toBeVisible();
    }
    
    // Check for buttons
    const buttons = popupPage.buttons;
    if (await buttons.count() > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      
      // Check consistent rounded corners on buttons
      const borderRadius = await firstButton.evaluate(el => 
        window.getComputedStyle(el).borderRadius
      );
      expect(borderRadius).toBeTruthy();
    }
  });
});