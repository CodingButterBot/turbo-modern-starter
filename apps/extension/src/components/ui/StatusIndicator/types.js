/**
 * @typedef {'online' | 'offline' | 'warning' | 'error' | 'loading' | 'idle'} StatusType
 * The type of status to display
 * - 'online': Green indicator for connected/active status
 * - 'offline': Gray indicator for disconnected/inactive status
 * - 'warning': Yellow indicator for warning status
 * - 'error': Red indicator for error status
 * - 'loading': Blue indicator for loading status
 * - 'idle': Light gray indicator for idle status
 */

/**
 * @typedef {'sm' | 'md' | 'lg'} StatusIndicatorSize
 * The size of the status indicator
 * - 'sm': Small
 * - 'md': Medium (default)
 * - 'lg': Large
 */

/**
 * @typedef {Object} StatusIndicatorProps
 * Properties for the StatusIndicator component
 * 
 * @property {StatusType} status - Status type to display
 * @property {StatusIndicatorSize} [size='md'] - Size of the indicator
 * @property {string} [label] - Optional label text
 * @property {boolean} [pulse=false] - Whether the indicator should have a pulsing animation
 * @property {string} [className] - Additional CSS classes
 */

export default {};