/**
 * @typedef {'default' | 'outline' | 'flat'} CardVariant
 * The visual style variant of the card
 * - 'default': Standard card with shadow
 * - 'outline': Card with a visible border and no shadow
 * - 'flat': Card with background color but no border or shadow
 */

/**
 * @typedef {Object} CardProps
 * Properties for the Card component
 * 
 * @property {React.ReactNode} children - Card content
 * @property {string} [title] - Optional card title
 * @property {React.ReactNode} [action] - Optional action element (button, link, etc.)
 * @property {CardVariant} [variant='default'] - Card style variant
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [hoverable=false] - Whether the card should have hover effects
 * @property {boolean} [clickable=false] - Whether the card is clickable (adds pointer cursor)
 */

export default {};