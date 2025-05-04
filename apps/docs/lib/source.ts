import { createMDXSource } from 'fumadocs-mdx';
import { loadPages } from 'fumadocs-core/source';
import config from '../source.config';

export const { getPage, getPages, pageTree } = loadPages({
  source: createMDXSource(config),
});