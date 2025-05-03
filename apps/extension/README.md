# Browser Extension for Turbo Modern Starter

This directory contains the browser extension for the Turbo Modern Starter project. The extension is built using:

- React 19
- Vite
- Tailwind CSS
- Chrome Extension Manifest V3
- @crxjs/vite-plugin for extension bundling

## Development

To start development:

```bash
# From the root of the monorepo
pnpm dev --filter extension

# Or from this directory
pnpm dev
```

This will build the extension in watch mode, which will rebuild automatically when you make changes.

## Loading the Extension

1. Build the extension: `pnpm build`
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` directory from this folder
5. The extension should now be loaded and can be accessed from the extensions menu

## Features

- Simple random selection using the shared module logic
- Consistent styling with the main app through shared UI components
- Light/dark mode using Tailwind

## Building for Production

```bash
pnpm build
```

This will create a production build in the `dist` directory, which can be zipped and submitted to browser extension stores.