import type { MDXComponents as MDXComponentsType } from '@mdx-js/react';

// Define basic MDX components
const basicComponents = {
  h1: (props: any) => <h1 className="text-3xl font-bold my-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold my-3" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold my-2" {...props} />,
  a: (props: any) => <a className="text-blue-600 hover:underline" {...props} />,
  p: (props: any) => <p className="my-2" {...props} />,
  code: (props: any) => <code className="bg-gray-100 px-1 rounded" {...props} />,
  pre: (props: any) => <pre className="bg-gray-100 p-4 rounded my-4 overflow-auto" {...props} />
};

export function useMDXComponents(components: MDXComponentsType): MDXComponentsType {
  return {
    ...basicComponents,
    ...components,
  };
}