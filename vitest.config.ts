import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
    },
    include: [
      'packages/**/src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'apps/**/src/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
    ],
  },
  resolve: {
    alias: {
      '@repo/ui': path.resolve(__dirname, 'packages/ui/src'),
      '@repo/module': path.resolve(__dirname, 'packages/module/src'),
      '@repo/assets': path.resolve(__dirname, 'packages/assets/src'),
      '@repo/env-config': path.resolve(__dirname, 'packages/env-config/src'),
    },
  },
});