import { MDXContent } from 'fumadocs-mdx/runtime/async';
import { notFound } from 'next/navigation';
import { getPage, getPages } from '@/lib/source';

interface Props {
  params: {
    slug: string[];
  };
}

export default function Page({ params }: Props) {
  const page = getPage(params.slug);

  if (page == null) {
    notFound();
  }

  return <MDXContent {...page} />;
}

export function generateStaticParams() {
  return getPages().map((page) => ({
    slug: page.slugs,
  }));
}