// Type augmentation for testing-library/jest-dom
// This extends the existing assertions from vitest to include
// the custom matchers from jest-dom

import '@testing-library/jest-dom';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = unknown> extends TestingLibraryMatchers<T, void> {
    // Additional matchers not covered by TestingLibraryMatchers
    toBeInTheDoc(): T;
  }
}