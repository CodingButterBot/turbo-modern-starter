import { describe, it, expect } from 'vitest';
import { RandomModule } from '../RandomModule';
import { ModuleOption } from '../types';

describe('RandomModule', () => {
  it('throws error if initialized with empty array', () => {
    expect(() => new RandomModule([])).toThrow();
  });

  it('returns one of the options when spun', () => {
    const options = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
    const module = new RandomModule(options);
    const result = module.spin();
    
    // The result should be one of the inputs
    const labels = options.map(o => o.label);
    expect(labels).toContain(result.label);
  });

  it('distributes results roughly uniformly', () => {
    const options = Array.from({ length: 5 }, (_, i) => ({ label: `Option${i}` }));
    const module = new RandomModule(options);
    
    // Spin 100 times and ensure all options came up at least once (very high probability)
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) {
      seen.add(module.spin().label);
    }
    
    expect(seen.size).toBe(options.length);
  });

  it('respects weights in weighted spinning', () => {
    const options: ModuleOption[] = [
      { label: 'Rare', weight: 1 },
      { label: 'Common', weight: 9 }
    ];
    
    const module = new RandomModule(options);
    const results: Record<string, number> = {};
    
    // Spin many times to see distribution
    const spins = 1000;
    for (let i = 0; i < spins; i++) {
      const result = module.spinWeighted();
      results[result.label] = (results[result.label] || 0) + 1;
    }
    
    // Common should appear more often than Rare (approx 9:1 ratio)
    expect(results['Common']).toBeGreaterThan(results['Rare']);
    
    // Rough ratio check (allow some variance due to randomness)
    const ratio = results['Common'] / results['Rare'];
    expect(ratio).toBeGreaterThan(5); // Should be close to 9, but allow variance
  });

  it('allows adding new options', () => {
    const options = [{ label: 'A' }, { label: 'B' }];
    const module = new RandomModule(options);
    
    module.addOption({ label: 'C' });
    
    const allOptions = module.getOptions();
    expect(allOptions).toHaveLength(3);
    expect(allOptions.map(o => o.label)).toContain('C');
  });

  it('allows removing options by label', () => {
    const options = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
    const module = new RandomModule(options);
    
    const removed = module.removeOption('B');
    
    expect(removed).toBe(true);
    expect(module.getOptions()).toHaveLength(2);
    expect(module.getOptions().map(o => o.label)).not.toContain('B');
  });

  it('returns false when removing non-existent option', () => {
    const options = [{ label: 'A' }, { label: 'B' }];
    const module = new RandomModule(options);
    
    const removed = module.removeOption('Z');
    
    expect(removed).toBe(false);
    expect(module.getOptions()).toHaveLength(2);
  });
});