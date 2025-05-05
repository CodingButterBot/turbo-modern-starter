/**
 * @typedef {'sm' | 'md' | 'lg'} ToggleSwitchSize
 * The size of the toggle switch
 * - 'sm': Small
 * - 'md': Medium (default)
 * - 'lg': Large
 */

/**
 * @typedef {'primary' | 'success' | 'warning' | 'error'} ToggleSwitchActiveColor
 * The color of the toggle switch when active
 * - 'primary': Primary brand color (default)
 * - 'success': Green for success/on states
 * - 'warning': Yellow for warning states
 * - 'error': Red for error/alerting states
 */

/**
 * @typedef {'left' | 'right'} ToggleSwitchLabelPosition
 * The position of the label relative to the switch
 * - 'left': Label appears before the switch
 * - 'right': Label appears after the switch (default)
 */

/**
 * @typedef {Object} ToggleSwitchProps
 * Properties for the ToggleSwitch component
 * 
 * @property {boolean} checked - Whether the switch is checked/on
 * @property {Function} onChange - Function to call when the switch state changes
 * @property {ToggleSwitchSize} [size='md'] - The size of the toggle
 * @property {ToggleSwitchActiveColor} [activeColor='primary'] - Color of the switch when active
 * @property {string} [label] - Optional label text
 * @property {ToggleSwitchLabelPosition} [labelPosition='right'] - Position of the label
 * @property {string} [className] - Additional CSS classes for the container
 * @property {string} [id] - ID for the input element, required for accessibility if using a label
 * @property {boolean} [disabled=false] - Whether the toggle switch is disabled
 */

export default {};