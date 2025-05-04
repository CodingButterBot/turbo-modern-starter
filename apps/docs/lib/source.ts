import { createMDXSource } from 'fumadocs-mdx/dist';
import { loadPages } from 'fumadocs-core/dist/source';
import config from '../source.config';

export const { getPage, getPages, pageTree } = loadPages({
  source: createMDXSource(config),
});