/**
 * @typedef {'icon' | 'switch' | 'button'} ThemeToggleVariant
 * The visual variant of the theme toggle
 * - 'icon': A simple icon button
 * - 'switch': A toggle switch
 * - 'button': A full button with text and icon
 */

/**
 * @typedef {'sm' | 'md' | 'lg'} ThemeToggleSize
 * The size of the theme toggle
 * - 'sm': Small (16px)
 * - 'md': Medium (24px)
 * - 'lg': Large (32px)
 */

/**
 * @typedef {Object} ThemeToggleProps
 * Properties for the ThemeToggle component
 * 
 * @property {ThemeToggleVariant} [variant='icon'] - The visual style of the toggle
 * @property {ThemeToggleSize} [size='md'] - The size of the toggle
 * @property {string} [className] - Additional CSS classes
 * @property {string} [lightIcon='☀️'] - Icon to use in light mode
 * @property {string} [darkIcon='🌙'] - Icon to use in dark mode
 * @property {string} [lightText='Light'] - Text to display in light mode (button variant only)
 * @property {string} [darkText='Dark'] - Text to display in dark mode (button variant only)
 */

export default {};