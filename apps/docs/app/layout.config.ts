import type { PageTree } from 'fumadocs-core/types';
import { createConfig } from 'fumadocs-ui/dist/layout';
import { pageTree } from '@/lib/source';

export const config = createConfig({
  tree: pageTree as PageTree,
});