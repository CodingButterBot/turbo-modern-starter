/**
 * @typedef {'default' | 'compact' | 'grouped'} SettingsPanelVariant
 * The layout variant of the settings panel
 * - 'default': Standard layout with each setting on its own row
 * - 'compact': Condensed layout with controls aligned to the right
 * - 'grouped': Settings grouped by category with section headers
 */

/**
 * @typedef {Object} SettingItem
 * An individual setting item
 * 
 * @property {string} id - Unique identifier for the setting
 * @property {string} label - Display label for the setting
 * @property {string} [description] - Optional description text
 * @property {string} [category] - Optional category for grouping (used in 'grouped' variant)
 * @property {React.ReactNode} control - The control element (toggle, input, etc.)
 */

/**
 * @typedef {Object} SettingsPanelProps
 * Properties for the SettingsPanel component
 * 
 * @property {Array<SettingItem>} settings - Array of setting objects
 * @property {string} [title='Settings'] - Panel title
 * @property {React.ReactNode} [footer] - Optional footer content (like save/cancel buttons)
 * @property {SettingsPanelVariant} [variant='default'] - Layout variant
 * @property {string} [className] - Additional CSS classes
 */

export default {};