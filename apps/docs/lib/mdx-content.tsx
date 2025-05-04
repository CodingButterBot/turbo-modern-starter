import React from 'react';

// Simple MDX content component that renders the content
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MDXContent = ({ code }: { code: unknown }) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {code ? <p>MDX Content would render here</p> : null}
    </div>
  );
};