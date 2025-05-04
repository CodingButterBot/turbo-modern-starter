# Browser Extension

A modern browser extension built with the Turbo Modern Starter, React, Vite, TypeScript, and Tailwind CSS.

## Features

- **Popup UI**: Interactive popup with consistent branding and theme switching
- **Side Panel**: Full-featured side panel with dashboard, analytics, and settings
- **Content Scripts**: Page interaction capabilities for enhanced browsing
- **Background Service**: Persistent background service for seamless operation
- **Theme Support**: Light and dark theme with consistent styling across all components
- **Storage API**: Cross-component state persistence
- **Modern Stack**: Built with React, Tailwind CSS, and TypeScript
- **Optimized Build**: Efficient building with Vite and proper bundling

## Development

### Getting Started

To start developing the extension:

```bash
# Install dependencies
pnpm install

# Start development with hot reloading
pnpm dev
```

This will build the extension in watch mode, automatically rebuilding when changes are detected.

### Project Structure

- `/public` - Static assets like icons
- `/src` - Source code
  - `App.jsx` - Popup React component
  - `background.ts` - Extension background script
  - `content.ts` - Content script injected into pages
  - `main.tsx` - Entry point for the popup React app
  - `/components` - Reusable UI components
    - `SidePanel.jsx` - Side panel React component
  - `sidepanel-main.jsx` - Entry point for the side panel

### UI Components

The extension features several UI components, all using a consistent design system:

#### Popup

The popup is a compact interface that appears when clicking the extension icon in the browser toolbar. It provides:

- Theme toggle (light/dark)
- Quick settings adjustment
- Access to the side panel
- Action buttons for common tasks

#### Side Panel

The side panel is a full-height interface that appears on the side of the browser window. It offers:

- Dashboard with overview information
- Analytics with usage statistics
- Settings management
- Tabbed interface for easy navigation

To open the side panel programmatically:

```javascript
chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
```

### Loading the Extension in Chrome

1. Build the extension with `pnpm dev` or `pnpm build`
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked" and select the `dist` directory
5. The extension should now appear in your browser toolbar

For development, you can keep `pnpm dev` running in the background. When you make changes, the extension will be automatically rebuilt. You'll need to manually refresh the extension in Chrome by clicking the refresh icon on the extensions page.

### Packaging the Extension

To create a distributable zip file:

```bash
pnpm build
pnpm package
```

This will create an `extension.zip` file in the project root that can be submitted to browser extension stores.

## Configuration

### Manifest

The extension configuration is defined in `manifest.json`. See [Chrome Extensions Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/) for more details on available options.

### Permissions

The extension requests the following permissions:
- `storage` - To save user preferences
- `tabs` - To interact with browser tabs
- `sidePanel` - To create and manage the side panel

If you need additional permissions, add them to the `permissions` array in `manifest.json`.

## Testing

Test your extension thoroughly in different browsers and scenarios to ensure it works correctly. The suggested testing flow is:

1. Test the popup interface
2. Test the side panel functionality
3. Verify theme persistence between components
4. Check that content scripts are properly injected
5. Ensure background scripts function as expected

## Further Resources

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Chrome Side Panel Documentation](https://developer.chrome.com/docs/extensions/reference/sidePanel/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS](https://tailwindcss.com/docs)