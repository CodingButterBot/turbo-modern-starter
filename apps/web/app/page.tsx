import { Button } from '@repo/ui';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-8">🚀 Turbo Modern Starter</h1>
        <p className="text-xl mb-8">
          A cutting-edge monorepo starter with TypeScript, Next.js, Tailwind CSS, Directus CMS, Turborepo, Vitest, Playwright, and GitHub Actions.
        </p>
        <div className="flex flex-row gap-4 justify-center">
          <Button>Get Started</Button>
          <Button variant="outline">Documentation</Button>
        </div>
      </div>
    </main>
  );
}