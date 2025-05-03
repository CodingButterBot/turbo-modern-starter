import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';

// Import the extension manifest
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest })
  ],
  resolve: {
    alias: {
      "@repo/ui": resolve(__dirname, "../../packages/ui/src"),
      "@repo/module": resolve(__dirname, "../../packages/module/src"),
      "@repo/assets": resolve(__dirname, "../../packages/assets/src")
    }
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss')(require('./tailwind.config.js')),
        require('autoprefixer')
      ]
    }
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      // The extension will have multiple entry points handled by the crx plugin
      // No explicit entry points needed here because crx plugin reads manifest.
    }
  }
});