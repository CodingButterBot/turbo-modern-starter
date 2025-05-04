import React from 'react';

// Simple MDX content component that renders the content
export const MDXContent = ({ code }: { code: any }) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {code && <p>MDX Content would render here</p>}
    </div>
  );
};