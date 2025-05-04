import '@testing-library/jest-dom';
import { expect } from 'vitest';

interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  toHaveClass(className: string): R;
  toBeDisabled(): R;
  toHaveAttribute(name: string, value?: string): R;
}