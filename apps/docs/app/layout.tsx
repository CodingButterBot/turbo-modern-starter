import { ReactNode } from "react";
import "./globals.css";
import { DocsLayout, RootProvider } from "fumadocs-ui/layout";
import { source } from "@/lib/source";
import { baseOptions } from "./layout.config";

export const metadata = {
  title: "Turbo Modern Starter Documentation",
  description: "Documentation for the Turbo Modern Starter monorepo",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-white dark:bg-gray-900">
        <RootProvider>
          <DocsLayout tree={source.pageTree} {...baseOptions}>
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}