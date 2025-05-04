import { MDXComponents } from 'fumadocs-mdx/dist/components';
import type { MDXComponents as MDXComponentsType } from '@mdx-js/react';

export function useMDXComponents(components: MDXComponentsType): MDXComponentsType {
  return {
    ...MDXComponents,
    ...components,
  };
}