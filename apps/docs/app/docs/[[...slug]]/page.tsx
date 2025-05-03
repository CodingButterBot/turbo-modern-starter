import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import { Metadata } from "next";

interface PageProps {
  params: {
    slug?: string[];
  };
}

export default async function Page({ params }: PageProps) {
  const page = source.getPage(params.slug);
  
  if (!page) {
    notFound();
  }
  
  const Content = page.data.body;
  
  return (
    <DocsPage toc={page.data.toc} fullWidth={page.data.fullWidth}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description && (
        <DocsDescription>{page.data.description}</DocsDescription>
      )}
      <DocsBody>
        <Content />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateStaticParams();
}

export function generateMetadata({ params }: PageProps): Metadata {
  const page = source.getPage(params.slug);
  
  if (!page) {
    return {};
  }
  
  return {
    title: page.data.title,
    description: page.data.description
  };
}