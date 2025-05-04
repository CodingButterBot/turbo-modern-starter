import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['packages/*/src/**/*.{ts,tsx}'],
      exclude: [
        'packages/*/src/**/*.test.{ts,tsx}',
        'packages/*/src/**/__tests__/**/*',
        'packages/*/src/**/*.stories.{ts,tsx}',
        'node_modules/**',
      ],
    },
  },
});