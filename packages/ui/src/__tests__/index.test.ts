import { describe, it, expect } from 'vitest';

import * as UI from '../index';

describe('UI Library Exports', () => {
  it('exports Button component and related utilities', () => {
    expect(UI.Button).toBeDefined();
    expect(UI.buttonVariants).toBeDefined();
  });

  it('exports utility functions', () => {
    expect(UI.cn).toBeDefined();
    expect(typeof UI.cn).toBe('function');
  });
});