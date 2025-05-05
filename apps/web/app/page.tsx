import Link from 'next/link';
import { Button } from '@repo/ui';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center text-center">
        <h1 className="mb-8 text-4xl font-bold">🚀 Turbo Modern Starter</h1>
        <p className="mb-8 text-xl">
          A cutting-edge monorepo starter with TypeScript, Next.js, Tailwind CSS, Directus CMS, Turborepo, Vitest, Playwright, and GitHub Actions.
        </p>
        <div className="flex flex-row justify-center gap-4">
          <Link href="/module">
            <Button>Try Module Demo</Button>
          </Link>
          <a href="https://github.com/CodingButterBot/turbo-modern-starter" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">View on GitHub</Button>
          </a>
        </div>
      </div>
    </main>
  );
}