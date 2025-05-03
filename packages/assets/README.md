# @repo/assets

This package contains shared assets for the Turbo Modern Starter, including logos, icons, and other visual resources.

## Features

- Shared SVG icons and logos
- Type definitions for all assets
- Both React component exports and raw path exports

## Usage

### Using SVG as React Components

```tsx
import { Logo, IconLight, IconDark, ModuleIcon } from '@repo/assets';

// Use as React components
function Header() {
  return (
    <header>
      <Logo className="w-10 h-10" />
      <h1>My App</h1>
    </header>
  );
}
```

### Using Asset Paths

```tsx
import { PATHS } from '@repo/assets';

// Use as image sources
function Logo() {
  return <img src={PATHS.LOGO_SVG} alt="Logo" />;
}
```

### TypeScript Support

The package includes TypeScript definitions for all assets, ensuring type safety when importing.

```tsx
import { AssetPath, PATHS } from '@repo/assets';

// Type-safe asset paths
const logoPath: AssetPath = 'LOGO_SVG';
const logo = PATHS[logoPath];
```

## Available Assets

### SVG Icons

- `Logo` - The main logo for the app
- `IconLight` - Light theme icon
- `IconDark` - Dark theme icon
- `ModuleIcon` - Icon for the module feature
- `Spinner` - Loading spinner animation

## Adding New Assets

1. Place new assets in the appropriate directory under `src/images/`
2. Export them in `src/index.ts`
3. Rebuild the package with `pnpm build`