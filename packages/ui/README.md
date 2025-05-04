# UI Package

This package contains shared UI components and styles for use across all applications in the monorepo.

## Dark Mode Support

The UI package includes built-in dark mode support using Tailwind CSS's `class` strategy.

### Usage

#### Basic Usage

To use dark mode in your components, use the `dark:` variant in your Tailwind classes:

```jsx
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  This content will adapt to dark mode
</div>
```

#### Predefined Colors

We've defined a set of common color variables for light and dark themes:

- `background-light` / `background-dark`
- `text-light` / `text-dark`
- `surface-light` / `surface-dark`
- `border-light` / `border-dark`

Example usage:

```jsx
<div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
  This component uses our theme colors
</div>
```

#### Utility Classes

- `.theme-transition` - Adds smooth transition when switching between themes

#### CSS Variables

You can also use CSS variables that automatically adapt to the current theme:

```css
.my-component {
  background-color: var(--background);
  color: var(--text);
  border-color: var(--border);
}
```

### Enabling Dark Mode

To toggle dark mode, add or remove the `dark` class from the `html` or `body` element:

```js
// Toggle dark mode
document.documentElement.classList.toggle('dark');

// Check if dark mode is enabled
const isDarkMode = document.documentElement.classList.contains('dark');

// Set based on user preference
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
```

### Persisting User Preference

To persist the user's theme preference, store it in localStorage:

```js
// Save the user's preference
localStorage.setItem('theme', 'dark');

// Apply the saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
```

For a complete implementation, use the `ThemeProvider` and `ThemeToggle` components.