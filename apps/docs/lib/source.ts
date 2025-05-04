import { createMDXSource } from 'fumadocs-mdx';
import { loadFiles } from 'fumadocs-core/source';
import { createSearchAPI } from 'fumadocs-core/search';
import { defineConfig } from '@/source.config';

export const { allDocs } = loadFiles(defineConfig);

export const mdxSource = createMDXSource(allDocs);

export function getPage(slug: string[]) {
  return allDocs.find(
    (page) => page.slug === (slug?.join('/') || 'index')
  );
}

export const searchAPI = createSearchAPI(allDocs);