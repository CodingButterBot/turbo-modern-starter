import { notFound } from 'next/navigation';
import { getPage, getPages } from '@/lib/source';

interface Props {
  params: {
    slug: string[];
  };
}

export default function Page({ params }: Props) {
  // Default params.slug to an empty array if it's undefined
  const slug = params?.slug || [];
  const page = getPage(slug);

  if (page == null) {
    notFound();
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      <p className="mb-4 text-gray-600">{page.description}</p>
      <div dangerouslySetInnerHTML={{ __html: page.body }} />
    </div>
  );
}

export function generateStaticParams() {
  return getPages().map((page) => ({
    slug: page.slugs,
  }));
}