import type { MDXComponents as MDXComponentsType } from '@mdx-js/react';
import { ReactNode } from 'react';

// Define types for component props
interface ComponentProps {
  children?: ReactNode;
  [key: string]: any;
}

// Define basic MDX components
const basicComponents = {
  h1: ({ children, ...props }: ComponentProps) => (
    <h1 className="my-4 text-3xl font-bold" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: ComponentProps) => (
    <h2 className="my-3 text-2xl font-bold" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: ComponentProps) => (
    <h3 className="my-2 text-xl font-bold" {...props}>{children}</h3>
  ),
  a: ({ children, ...props }: ComponentProps) => (
    <a className="text-blue-600 hover:underline" {...props}>{children}</a>
  ),
  p: ({ children, ...props }: ComponentProps) => (
    <p className="my-2" {...props}>{children}</p>
  ),
  code: ({ children, ...props }: ComponentProps) => (
    <code className="rounded bg-gray-100 px-1" {...props}>{children}</code>
  ),
  pre: ({ children, ...props }: ComponentProps) => (
    <pre className="my-4 overflow-auto rounded bg-gray-100 p-4" {...props}>{children}</pre>
  )
};

export function useMDXComponents(components: MDXComponentsType): MDXComponentsType {
  return {
    ...basicComponents,
    ...components,
  };
}