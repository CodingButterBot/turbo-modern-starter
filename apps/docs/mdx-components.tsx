import type { MDXComponents } from 'mdx/types';
import { useMDXComponents } from 'fumadocs-mdx/mdx-components';

export function MDXComponents(components: MDXComponents): MDXComponents {
  return useMDXComponents(components);
}