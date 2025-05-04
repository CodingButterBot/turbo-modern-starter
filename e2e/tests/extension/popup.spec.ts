import { test, expect } from '../../fixtures/test-fixtures';
import { getExtensionId } from '../../utils/test-helpers';
import * as path from 'path';

/**
 * End-to-end test for the extension popup
 * Note: This test will need to be run in a real extension context
 * and is primarily for illustration purposes.
 */
test.describe('Extension Popup', () => {
  // Skip these tests when running in CI
  test.skip(!!process.env.CI, 'Extension tests are skipped in CI');
  
  // Define the extension ID once for all tests
  let extensionId: string;
  
  // Before hook to get the extension ID
  test.beforeAll(async () => {
    extensionId = await getExtensionId(
      path.join(__dirname, '../../../apps/extension/dist/manifest.json')
    );
  });
  
  // Before each test, navigate to the extension popup
  test.beforeEach(async ({ extensionPopupPage }) => {
    await extensionPopupPage.goto(extensionId);
    await extensionPopupPage.waitForPageLoad();
  });
  
  test('should render the popup UI correctly', async ({ extensionPopupPage }) => {
    // Verify the popup UI has rendered correctly
    expect(await extensionPopupPage.hasRenderedCorrectly()).toBe(true);
    
    // Verify key elements are visible
    expect(await extensionPopupPage.isVisible(extensionPopupPage.heading)).toBe(true);
    expect(await extensionPopupPage.isVisible(extensionPopupPage.content)).toBe(true);
    
    // Check if logo exists and is visible
    if (await extensionPopupPage.exists(extensionPopupPage.logo)) {
      expect(await extensionPopupPage.isVisible(extensionPopupPage.logo)).toBe(true);
    }
  });
  
  test('should have interactive buttons', async ({ extensionPopupPage }) => {
    // Check if buttons are visible
    const buttonsCount = await extensionPopupPage.buttons.count();
    expect(buttonsCount).toBeGreaterThan(0);
    
    // Verify spin and reset buttons if they exist
    if (await extensionPopupPage.exists(extensionPopupPage.spinButton)) {
      expect(await extensionPopupPage.isVisible(extensionPopupPage.spinButton)).toBe(true);
    }
    
    if (await extensionPopupPage.exists(extensionPopupPage.resetButton)) {
      expect(await extensionPopupPage.isVisible(extensionPopupPage.resetButton)).toBe(true);
    }
  });
  
  test('should perform spin and reset actions', async ({ extensionPopupPage }) => {
    // Skip test if spin button doesn't exist
    if (!await extensionPopupPage.exists(extensionPopupPage.spinButton)) {
      test.skip();
      return; // This prevents the test from continuing
    }
    
    // Test clicking the spin button
    await extensionPopupPage.clickSpin();
    
    // Check for results if they should appear
    if (await extensionPopupPage.exists(extensionPopupPage.result)) {
      const resultText = await extensionPopupPage.getResultText();
      expect(resultText).not.toBeNull();
    }
    
    // Test reset if reset button exists
    if (await extensionPopupPage.exists(extensionPopupPage.resetButton)) {
      await extensionPopupPage.clickReset();
      
      // Check that result is cleared or hidden
      const resultAfterReset = await extensionPopupPage.getResultText();
      expect(resultAfterReset === null || resultAfterReset === '').toBe(true);
    }
  });
  
  test('should toggle theme if theme toggle exists', async ({ extensionPopupPage }) => {
    // Skip test if theme toggle doesn't exist
    if (!await extensionPopupPage.exists(extensionPopupPage.themeToggle)) {
      test.skip();
      return;
    }
    
    // Get initial theme
    const initialIsDark = await extensionPopupPage.isDarkMode();
    
    // Toggle theme
    await extensionPopupPage.toggleTheme();
    
    // Verify theme changed
    const newIsDark = await extensionPopupPage.isDarkMode();
    expect(newIsDark).not.toEqual(initialIsDark);
    
    // Toggle back to original theme
    await extensionPopupPage.toggleTheme();
    const finalIsDark = await extensionPopupPage.isDarkMode();
    expect(finalIsDark).toEqual(initialIsDark);
  });
  
  test('should display version information if available', async ({ extensionPopupPage }) => {
    // Skip test if version element doesn't exist
    if (!await extensionPopupPage.exists(extensionPopupPage.version)) {
      test.skip();
      return;
    }
    
    // Get version
    const version = await extensionPopupPage.getVersion();
    expect(version).not.toBeNull();
    
    // Version should match semantic versioning pattern (x.y.z)
    if (version) {
      expect(version).toMatch(/\d+\.\d+\.\d+/);
    }
  });
  
  test('should complete a full interaction flow', async ({ extensionPopupPage }) => {
    // Skip if either spin or reset button doesn't exist
    if (!await extensionPopupPage.exists(extensionPopupPage.spinButton) || 
        !await extensionPopupPage.exists(extensionPopupPage.resetButton)) {
      test.skip();
      return;
    }
    
    // Test the full interaction flow
    const success = await extensionPopupPage.testFullInteraction();
    expect(success).toBe(true);
  });
});

/**
 * Note: These tests are simplified representations of how extension testing
 * would work. In a real implementation, you would need to:
 * 
 * 1. Build the extension first
 * 2. Load it into a special browser context
 * 3. Get the actual extension ID
 * 4. Navigate to and interact with the extension pages
 * 
 * See the test-fixtures.ts file for more details on the implementation.
 */