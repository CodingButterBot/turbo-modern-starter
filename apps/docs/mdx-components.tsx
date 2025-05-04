import { MDXComponents } from 'fumadocs-mdx/components';
import type { MDXComponents as MDXComponentsType } from 'mdx/types';

export function useMDXComponents(components: MDXComponentsType): MDXComponentsType {
  return {
    ...MDXComponents,
    ...components,
  };
}