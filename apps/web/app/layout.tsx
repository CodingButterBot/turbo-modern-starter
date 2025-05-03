import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Turbo Modern Starter',
  description: 'A cutting-edge monorepo starter with TypeScript, Next.js, Tailwind CSS, Directus CMS, Turborepo, Vitest, Playwright, and GitHub Actions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}