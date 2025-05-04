# Extension UI Component Library

A consistent, theme-aware UI component library for the browser extension that ensures visual harmony between popup and side panel interfaces.

## Components

### ThemeProvider

A context provider that manages theme state across the extension.

```jsx
import { ThemeProvider } from '../components/ui';

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### ThemeToggle

A toggle component for switching between light and dark themes.

```jsx
import { ThemeToggle } from '../components/ui';

// Icon variant (default)
<ThemeToggle />

// Switch variant
<ThemeToggle variant="switch" />

// Button variant
<ThemeToggle variant="button" />

// Custom icons
<ThemeToggle lightIcon="🌞" darkIcon="🌚" />
```

### Card

A container component for displaying content in a themed card.

```jsx
import { Card } from '../components/ui';

// Basic usage
<Card>Card content goes here</Card>

// With title
<Card title="Card Title">Card content</Card>

// With title and action
<Card 
  title="Card Title" 
  action={<button>Action</button>}
>
  Card content
</Card>

// Different variants
<Card variant="outline">Outlined card</Card>
<Card variant="flat">Flat card</Card>

// Interactive cards
<Card hoverable={true}>Hover me</Card>
<Card clickable={true} onClick={() => console.log('Clicked')}>Click me</Card>
```

### ToggleSwitch

A switch component for boolean settings.

```jsx
import { ToggleSwitch } from '../components/ui';

// Basic usage
<ToggleSwitch 
  checked={isEnabled} 
  onChange={(e) => setIsEnabled(e.target.checked)} 
/>

// With label
<ToggleSwitch 
  label="Enable notifications" 
  checked={notifications} 
  onChange={(e) => setNotifications(e.target.checked)} 
/>

// Different sizes
<ToggleSwitch size="sm" />
<ToggleSwitch size="md" />
<ToggleSwitch size="lg" />

// Different active colors
<ToggleSwitch activeColor="primary" />
<ToggleSwitch activeColor="success" />
<ToggleSwitch activeColor="warning" />
<ToggleSwitch activeColor="error" />
```

### TabNav

A navigation component for switching between different views.

```jsx
import { TabNav } from '../components/ui';

// Define tabs
const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
];

// Basic usage
<TabNav 
  tabs={tabs} 
  activeTab={currentTab} 
  onChange={setCurrentTab} 
/>

// Different variants
<TabNav variant="pills" />
<TabNav variant="buttons" />

// Vertical orientation
<TabNav orientation="vertical" />
```

### StatusIndicator

A visual indicator for displaying status.

```jsx
import { StatusIndicator } from '../components/ui';

// Different statuses
<StatusIndicator status="online" />
<StatusIndicator status="offline" />
<StatusIndicator status="warning" />
<StatusIndicator status="error" />
<StatusIndicator status="loading" />
<StatusIndicator status="idle" />

// With label
<StatusIndicator status="online" label="Connection Status" />

// With pulsing animation
<StatusIndicator status="loading" pulse={true} />
```

### SettingsPanel

A component for displaying and managing settings.

```jsx
import { SettingsPanel, ToggleSwitch } from '../components/ui';

// Define settings
const settings = [
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Enable desktop notifications',
    control: (
      <ToggleSwitch 
        checked={notifications} 
        onChange={(e) => setNotifications(e.target.checked)} 
      />
    ),
  },
  // More settings...
];

// Basic usage
<SettingsPanel settings={settings} />

// With custom title
<SettingsPanel 
  title="Notification Settings" 
  settings={settings} 
/>

// With footer actions
<SettingsPanel 
  settings={settings}
  footer={
    <div className="flex justify-end space-x-2">
      <button>Cancel</button>
      <button>Save</button>
    </div>
  }
/>

// Different variants
<SettingsPanel variant="compact" />
<SettingsPanel variant="grouped" />
```

## Usage with ThemeContext

All components are designed to work with the ThemeContext to ensure consistent styling between light and dark modes:

```jsx
import { useTheme, Card, ThemeToggle } from '../components/ui';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Card>
      <div className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
        Current theme: {theme}
      </div>
      <ThemeToggle />
    </Card>
  );
}
```