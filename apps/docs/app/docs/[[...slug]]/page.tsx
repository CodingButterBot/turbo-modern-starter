import { notFound } from 'next/navigation';
import { getPage, getPages } from '@/lib/source';
import { MDXRemote } from '@fumadocs/mdx-remote';

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

  return (
    <div className="mdx-content">
      <MDXRemote source={page.body} />
    </div>
  );
}

export function generateStaticParams() {
  return getPages().map((page) => ({
    slug: page.slugs,
  }));
}