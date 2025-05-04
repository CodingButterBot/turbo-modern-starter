import { components as MDXComponents } from 'fumadocs-ui';
import type { MDXComponents as MDXComponentsType } from '@mdx-js/react';

export function useMDXComponents(components: MDXComponentsType): MDXComponentsType {
  return {
    ...MDXComponents,
    ...components,
  };
}