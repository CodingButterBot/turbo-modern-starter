import { defineConfig as defineDocsConfig } from 'fumadocs-core/config';

export const defineConfig = defineDocsConfig({
  baseUrl: '/docs',
  rootDir: './content/docs',
  name: 'docs'
});