# Browser Extension

A browser extension built with the Turbo Modern Starter, React, Vite, TypeScript, and Tailwind CSS.

## Features

- React UI with Tailwind CSS for the popup
- TypeScript support for type safety
- Hot reloading development environment
- Background script for persistent functionality
- Content scripts for webpage interaction
- Storage API for saving user preferences

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

If you need additional permissions, add them to the `permissions` array in `manifest.json`.

## Testing

Test your extension thoroughly in different browsers and scenarios to ensure it works correctly.

## Further Resources

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [CRXJS Vite Plugin](https://crxjs.dev/vite-plugin)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS](https://tailwindcss.com/docs)