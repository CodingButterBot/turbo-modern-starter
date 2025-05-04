import type { PageTree } from 'fumadocs-core/source';
import { createConfig } from 'fumadocs-ui';
import { pageTree } from '@/lib/source';

export const config = createConfig({
  tree: pageTree as PageTree,
});