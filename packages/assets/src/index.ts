// Import SVG assets
import IconDark from './images/icon-dark.svg';
import IconLight from './images/icon-light.svg';
import Logo from './images/logo.svg';
import ModuleIcon from './images/module-icon.svg';
import Spinner from './images/spinner.svg';

// Export React components for SVGs
export { IconDark, IconLight, Logo, ModuleIcon, Spinner };

// Export file paths for direct usage
export const PATHS = {
  // SVG paths
  LOGO_SVG: './images/logo.svg' as const,
  ICON_DARK_SVG: './images/icon-dark.svg' as const,
  ICON_LIGHT_SVG: './images/icon-light.svg' as const,
  MODULE_ICON_SVG: './images/module-icon.svg' as const,
  SPINNER_SVG: './images/spinner.svg' as const,
};

// Export asset types for TypeScript
export type AssetPath = keyof typeof PATHS;