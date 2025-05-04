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

  return (
    <div className="markdown-content">
      <h1>{page.title}</h1>
      <p>{page.description}</p>
      <div dangerouslySetInnerHTML={{ __html: page.body }} />
    </div>
  );
}

export function generateStaticParams() {
  return getPages().map((page) => ({
    slug: page.slugs,
  }));
}