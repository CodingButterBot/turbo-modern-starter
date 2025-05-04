// Simple MDX components implementation
type MDXComponents = Record<string, React.ComponentType<any>>;

export function MDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Add custom components here
    h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
    h2: (props) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
    h3: (props) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
    p: (props) => <p className="my-4" {...props} />,
    code: (props) => <code className="bg-gray-100 dark:bg-gray-800 rounded px-1" {...props} />,
  };
}