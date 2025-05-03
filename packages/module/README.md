# @repo/module

This package provides the core module logic for the Turbo Modern Starter, independent of any UI framework.

## Features

- `RandomModule`: A class that selects options from a provided list (supports both uniform and weighted random selection)
- CSV Parser: Utility for parsing CSV content into module options
- TypeScript types: Full type definitions for all module components

## Usage

### Basic Usage

```typescript
import { RandomModule } from '@repo/module';

// Create a new module with some options
const options = [
  { label: 'Apple' },
  { label: 'Banana' },
  { label: 'Cherry' }
];

const module = new RandomModule(options);

// Spin to get a random option (uniform distribution)
const result = module.spin();
console.log(`The result is: ${result.label}`);
```

### Weighted Random Selection

```typescript
import { RandomModule } from '@repo/module';

// Create a module with weighted options
const options = [
  { label: 'Common Option', weight: 5 },
  { label: 'Uncommon Option', weight: 2 },
  { label: 'Rare Option', weight: 1 }
];

const module = new RandomModule(options);

// Spin with weights (higher weights = higher probability)
const result = module.spinWeighted();
console.log(`The result is: ${result.label}`);
```

### Parsing CSV Data

```typescript
import { parseOptionsCSV, RandomModule } from '@repo/module';

// CSV with header
const csvData = `label,weight
Option A,5
Option B,2
Option C,1`;

// Parse CSV into options
const options = parseOptionsCSV(csvData);

// Create module with the parsed options
const module = new RandomModule(options);
const result = module.spinWeighted();
```

## API Reference

### RandomModule

- `constructor(options: ModuleOption[])`: Creates a new module with the provided options
- `spin(): ModuleOption`: Selects a random option (uniform distribution)
- `spinWeighted(): ModuleOption`: Selects a random option, considering weights if specified
- `getOptions(): ModuleOption[]`: Returns a copy of all options
- `addOption(option: ModuleOption): void`: Adds a new option to the list
- `removeOption(label: string): boolean`: Removes an option by label

### CSV Parser

- `parseOptionsCSV(csvData: string): ModuleOption[]`: Parses CSV text into module options

### Types

- `ModuleOption`: Interface representing an option with required `label` property and optional `weight`