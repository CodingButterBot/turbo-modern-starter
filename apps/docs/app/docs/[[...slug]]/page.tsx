import { notFound } from 'next/navigation';

import { MDXContent } from '@/lib/mdx-content';
import { allDocs, getPage } from '@/lib/source';

interface PageProps {
  params: {
    slug: string[];
  };
}

export function generateStaticParams() {
  return allDocs.map((page) => ({
    slug: page.slug.split('/'),
  }));
}

export function generateMetadata({ params }: PageProps) {
  const page = getPage(params.slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default function Page({ params }: PageProps) {
  const page = getPage(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <MDXContent code={page.data} />
  );
}