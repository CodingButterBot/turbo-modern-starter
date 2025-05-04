import { createConfig } from 'fumadocs-ui';
import { pageTree } from '@/lib/source';

// Define PageTree type inline
type PageTree = { items: any[] };

export const config = createConfig({
  tree: pageTree as any,
});