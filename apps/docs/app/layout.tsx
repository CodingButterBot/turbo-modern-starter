import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Turbo Modern Starter - Documentation',
  description: 'Documentation for the Turbo Modern Starter monorepo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
