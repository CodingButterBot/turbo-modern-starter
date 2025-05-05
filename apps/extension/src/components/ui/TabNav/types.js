/**
 * @typedef {'horizontal' | 'vertical'} TabNavOrientation
 * The orientation of the tab navigation
 * - 'horizontal': Tabs are arranged horizontally (default)
 * - 'vertical': Tabs are arranged vertically
 */

/**
 * @typedef {'underline' | 'pills' | 'buttons'} TabNavVariant
 * The visual style of the tab navigation
 * - 'underline': Tabs with an underline indicator (default)
 * - 'pills': Tabs with pill-shaped background
 * - 'buttons': Tabs that look like buttons
 */

/**
 * @typedef {'sm' | 'md' | 'lg'} TabNavSize
 * The size of the tab navigation
 * - 'sm': Small
 * - 'md': Medium (default)
 * - 'lg': Large
 */

/**
 * @typedef {Object} TabItem
 * A tab item in the navigation
 * 
 * @property {string} id - Unique identifier for the tab
 * @property {string} label - Display text for the tab
 * @property {React.ReactNode} [icon] - Optional icon to display with the tab
 */

/**
 * @typedef {Object} TabNavProps
 * Properties for the TabNav component
 * 
 * @property {TabItem[]} tabs - Array of tab objects
 * @property {string} activeTab - ID of the currently active tab
 * @property {function(string): void} onChange - Function to call when a tab is changed
 * @property {TabNavOrientation} [orientation='horizontal'] - Orientation of the tabs
 * @property {TabNavVariant} [variant='underline'] - Visual style of the tabs
 * @property {TabNavSize} [size='md'] - Size of the tabs
 * @property {boolean} [fullWidth=false] - Whether tabs should take full width
 * @property {string} [className] - Additional CSS classes
 */

export default {};