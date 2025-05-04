import type { PageTree } from 'fumadocs-core';
import { createConfig, getPageNav, Layout } from 'fumadocs-ui/layout';
import { pageTree } from '@/lib/source';

export const config = createConfig({
  tree: pageTree as PageTree,
});