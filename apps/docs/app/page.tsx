import { Button } from '@repo/ui';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center text-center">
        <h1 className="mb-8 text-4xl font-bold">📚 Turbo Modern Starter Docs</h1>
        <p className="mb-8 text-xl">
          Comprehensive documentation for the Turbo Modern Starter project.
        </p>
        <div className="flex flex-row justify-center gap-4">
          <Link href="/docs">
            <Button>View Documentation</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}