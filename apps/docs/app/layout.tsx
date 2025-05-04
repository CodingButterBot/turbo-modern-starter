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
      <body>
        <div className="flex">
          <div className="min-h-screen w-64 bg-gray-100 p-4">
            <h2 className="mb-4 text-xl font-bold">Documentation</h2>
            <nav>
              <ul>
                <li><a href="/docs" className="hover:underline">Home</a></li>
                <li><a href="/docs/getting-started/installation" className="hover:underline">Installation</a></li>
                <li><a href="/docs/guides/ui-components" className="hover:underline">UI Components</a></li>
                <li><a href="/docs/guides/extension-development" className="hover:underline">Extension Development</a></li>
              </ul>
            </nav>
          </div>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
