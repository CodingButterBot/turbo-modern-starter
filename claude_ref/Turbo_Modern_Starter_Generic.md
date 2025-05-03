Great. I’ll prepare a full Claude Code prompt that will reinitialize your project using bleeding-edge tools while keeping TypeScript, Tailwind, and Directus. It will ensure your monorepo is clean, modular, DRY, and tightly integrated with extension and web apps, while establishing a maintainable CI/CD pipeline using GitHub Actions and Vercel. I’ll also include helpful MCP tools to optimize the developer workflow.

I’ll let you know once it’s ready for your review.


# Turbo Modern Starter Monorepo

**Turbo Modern Starter** is a modern monorepo-based platform for creating and managing interactive **interactive applications** (a "interactive module") with a consistent user experience across web, browser extension, and documentation. It leverages a bleeding-edge stack for performance, modularity, and maintainability.

## 📋 Overview

Turbo Modern Starter follows a **modular architecture** using the latest stable technologies:

* **TypeScript (Strict Mode)** – Provides type safety across the entire codebase.
* **React 19 & Next.js 15** – Modern React features with Next.js App Router for the web and docs apps.
* **Tailwind CSS 4** – Utility-first CSS for rapid UI development with consistent design (light/dark mode).
* **Vite 4** – Fast bundling for the browser extension.
* **Directus 10 (Dockerized)** – Headless CMS backend for storing module configurations and data.
* **Fumadocs** – Documentation framework (Next.js-based) for the docs app.
* **Turborepo + pnpm** – Monorepo tooling for shared code and efficient builds.
* **Playwright & Vitest** – Testing frameworks for end-to-end and unit tests.
* **GitHub Actions** – CI workflows for linting, testing, type-checking, building, and deployment.
* **MCP (Model Context Protocol)** – Optional integration for AI-assisted development (memory, GitHub, Playwright servers).

## 📁 Project Structure

The repository is organized as a **Turborepo monorepo** with a clear separation of concerns. All apps and packages are TypeScript projects that can be built and tested independently, but share code through internal packages. We use **pnpm workspaces** to manage dependencies.

```
turbo-modern-starter/
├─ apps/                       # Applications
│   ├─ web/                    # Next.js 15 web application (Vercel deploy target)
│   │   ├─ app/                # Next.js App Router directory
│   │   ├─ public/             # Public assets (if any)
│   │   ├─ next.config.mjs     # Next.js configuration (with Tailwind, transpilation of packages)
│   │   ├─ tailwind.config.js  # Tailwind configuration (extends shared config)
│   │   ├─ tsconfig.json       # TypeScript config (extends base config)
│   │   └─ package.json        # App-specific scripts and dependencies
│   ├─ extension/              # Browser extension (Chrome/Firefox) built with Vite + React
│   │   ├─ public/             # Static assets for extension (icons, etc.)
│   │   ├─ src/                # Extension source (React popup, optional content scripts)
│   │   ├─ manifest.json       # Browser extension manifest (v3)
│   │   ├─ vite.config.ts      # Vite configuration (with React & Tailwind integration)
│   │   ├─ tailwind.config.js  # Tailwind config (extends shared config)
│   │   ├─ tsconfig.json       # TypeScript config (extends base config)
│   │   └─ package.json        # Extension-specific scripts and dependencies
│   ├─ docs/                   # Documentation site (Next.js + Fumadocs)
│   │   ├─ app/                # Next.js App Router for docs (MDX routes under /docs)
│   │   ├─ content/docs/       # Documentation content (MDX files)
│   │   ├─ lib/                # Utility library for docs (source loader, etc.)
│   │   ├─ mdx-components.tsx  # Custom MDX components for documentation content
│   │   ├─ source.config.ts    # Fumadocs content source configuration (points to content/docs)
│   │   ├─ next.config.mjs     # Next.js config (with MDX support via Fumadocs)
│   │   ├─ tailwind.config.js  # Tailwind config (extends shared config)
│   │   ├─ tsconfig.json       # TypeScript config (extends base config)
│   │   └─ package.json        # Docs-specific scripts and dependencies
│   └─ directus/               # Directus CMS (Dockerized)
│       ├─ docker-compose.yml  # Docker Compose for Directus and (optionally) database
│       ├─ .env.example        # Example environment variables for Directus
│       └─ README.md           # Instructions to run the Directus service
├─ packages/                   # Shared packages (internal libraries)
│   ├─ @repo/ui/               # UI component library (React + Tailwind)
│   │   ├─ src/                # Source for shared UI components
│   │   ├─ tailwind.config.js  # Tailwind preset or config extension for UI styles
│   │   ├─ postcss.config.js   # PostCSS config (for Tailwind processing if needed)
│   │   ├─ tsconfig.json       # TypeScript config for UI package
│   │   ├─ package.json        # Package definition (name @repo/ui)
│   │   └─ README.md           # Usage notes for UI components
│   ├─ @repo/module/          # Core module logic (business logic for spinning wheel)
│   │   ├─ src/                # Source for module logic (classes, util functions)
│   │   ├─ tsconfig.json       # TypeScript config for module package
│   │   ├─ package.json        # Package definition (name @repo/module)
│   │   └─ README.md           # Documentation for module usage
│   ├─ @repo/assets/           # Shared assets (SVGs, images, icons)
│   │   ├─ src/                # Exportable asset references (e.g., paths or data URIs)
│   │   ├─ tsconfig.json       # TypeScript config for assets package
│   │   ├─ package.json        # Package definition (name @repo/assets)
│   │   └─ README.md           # Notes on assets
│   ├─ @repo/env-config/       # Environment configuration helpers
│   │   ├─ src/                # Config loading (common .env parsing or constants)
│   │   ├─ tsconfig.json       # TypeScript config for env-config
│   │   ├─ package.json        # Package definition (name @repo/env-config)
│   │   └─ README.md           # Usage of configuration utilities
│   ├─ @repo/eslint-config/    # Shared ESLint config
│   │   ├─ index.js            # ESLint configuration export
│   │   ├─ package.json        # Package definition (name @repo/eslint-config)
│   │   └─ README.md           # How to use the ESLint config
│   └─ @repo/typescript-config/ # Shared TypeScript config (tsconfig base)
│       ├─ tsconfig.json       # Base TS config that other projects extend
│       ├─ package.json        # Package definition (name @repo/typescript-config)
│       └─ README.md           # Notes on extending TS config
├─ .eslintrc.json              # Root ESLint config (extends @repo/eslint-config)
├─ package.json                # Root workspace package (scripts and devDependencies)
├─ pnpm-workspace.yaml         # Defines workspace packages for pnpm
├─ turbo.json                  # Turborepo configuration (task pipeline)
├─ tsconfig.json               # Root TS config (references subprojects)
├─ .mcp.json                   # MCP server configuration (for optional AI integration)
└─ settings.local.json         # Permissions for MCP integration (for local dev environment)
```

### Shared Code and Reusability

* **`@repo/ui`**: A shared React component library styled with Tailwind CSS. This ensures all apps (web, extension, docs) have a consistent look and feel. For example, a `<Button>` or `<ModuleDisplay>` component lives here.
* **`@repo/module`**: The core logic for the spinning wheel – e.g., data structures for module items and algorithms to pick a winner. This is framework-agnostic logic (no React) that can be used by both the web app and the extension (and potentially by Directus or scripts).
* **`@repo/assets`**: A place for shared assets like logos, icons, or SVG illustrations. This can export file paths or even React components for inline SVGs.
* **`@repo/env-config`**: Utility for loading environment variables and providing a typed configuration object. This helps keep configuration DRY across apps (for example, ensuring the web and extension use the same base API URL or feature flags).
* **`@repo/eslint-config` & `@repo/typescript-config`**: Shared linting and TS settings to enforce consistent code style and compiler options across all packages. All projects extend these configs, so rules (like strict null checks) and styles (like semi rules) are uniform.

### Apps

* **`web` (Next.js)**: The main web application (to be deployed on Vercel). It includes pages built with the Next.js App Router (`app/` directory). It demonstrates usage of the module component and possibly integrates with Directus via API calls. This app uses server-side rendering and static generation as needed. It also has API route(s) for things like webhooks (e.g., a GitHub webhook endpoint for Claude Code integration or to receive events).
* **`extension` (Vite + React)**: A browser extension (e.g., Chrome/Firefox) that allows users to use the module in their browser. For example, it might provide a popup UI where the user can input a list and spin to pick a random item. It shares logic (`@repo/module`) and UI components (`@repo/ui`) with the web app for consistency. Built with Vite and bundled as a manifest v3 extension.
* **`docs` (Next.js + Fumadocs)**: A documentation site for the project (could be published to a static host or a docs subdomain). It uses Fumadocs to render markdown/MDX files from the `content/docs` directory, providing a nice developer portal for the monorepo. It likely includes guides on how to use or extend the module, how to work with the monorepo, etc.
* **`directus` (Dockerized Directus)**: The headless CMS that stores data such as predefined module configurations, user accounts, or any other structured content the platform might need. We use a Docker container for Directus for easy setup. In development, it can run locally (with SQLite for simplicity). In production, it could be connected to a more robust database. The monorepo includes configuration for this service and instructions to run it.

### Developer Experience and Philosophy

* **Bleeding-edge but stable**: We use latest versions (e.g., React 19 alpha, Next 15 beta, Tailwind CSS 4) to future-proof the project, but configure them in a stable manner (strict type-checking, clear error handling).
* **Strict TypeScript**: `strict` mode and additional type-checks (`noUncheckedIndexedAccess`, etc.) are enabled to catch issues early.
* **ESLint and Prettier**: Enforced via a shared config (`@repo/eslint-config`). Formatting (perhaps Prettier or ESLint rules) can be run via `pnpm format`.
* **Testing**: Example tests using **Vitest** (a Vite-compatible test runner) for units and **Playwright** for end-to-end (integration) tests. Each package/app has a sample test (e.g., testing the module algorithm, a React component, or an API route).
* **Monorepo Tooling**: Turborepo orchestrates builds and caches results. Each project declares its build and test commands, and Turborepo ensures that e.g. the `web` app rebuilds only after `module` or `ui` changes that affect it. We use **pnpm** for fast installs and workspace linking.
* **CI/CD**: GitHub Actions workflows are included for common tasks: linting, testing, type-checking, building, and deploying. For deployment, the `web` app is prepared to be deployed to Vercel (with appropriate configuration).
* **MCP Integration**: The project includes configuration for Anthropic’s Model Context Protocol (MCP). This allows optional integration with AI tools:

  * *Memory Server*: A local knowledge base that could store documentation or code context for AI assistant queries.
  * *GitHub Server*: For the AI to interact with GitHub (e.g., auto-open PRs, comment on issues).
  * *Playwright Server*: For the AI to automate browser interactions (e.g., run end-to-end tests or scrape something for context).

  These are configured in `.mcp.json` and permissions in `settings.local.json`. The codebase provides hooks (like a webhook endpoint and CLI scripts) to utilize these servers for advanced automation or documentation generation.

## 🔧 Setup & Configuration (Root)

At the root of the repository, we define workspace settings, Turborepo pipeline, and shared configs.

**Root `package.json`** – Defines the workspace, dev dependencies, and root-level scripts for common tasks.

```json
{
  "name": "turbo-modern-starter",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev --parallel",         // Run all dev servers in parallel
    "build": "turbo run build",                // Build all packages and apps
    "lint": "turbo run lint",                  // Lint all projects using ESLint
    "check-types": "turbo run type-check",     // Run tsc in all projects
    "format": "prettier --write .",            // Format all files (assuming Prettier)
    "test": "turbo run test",                  // Run all tests (unit and e2e)
    "e2e": "turbo run e2e",                    // Run all Playwright end-to-end tests
    "mcp:memory": "npx -y @modelcontextprotocol/server-memory",   // Launch MCP Memory server
    "mcp:github": "npx gh-cli-mcp",            // Launch MCP GitHub server (requires gh auth)
    "mcp:playwright": "npx @playwright/mcp@latest" // Launch MCP Playwright server
  },
  "devDependencies": {
    "turbo": "latest",                        // Turborepo for task running
    "prettier": "latest",                     // Prettier for code formatting
    "@types/node": "latest",                  // Node types
    "typescript": "latest",                   // TypeScript compiler
    "eslint": "latest",                       // ESLint core
    "@typescript-eslint/parser": "latest",    // ESLint TypeScript parser
    "@typescript-eslint/eslint-plugin": "latest",
    "eslint-config-prettier": "latest",
    "eslint-plugin-react": "latest",
    "eslint-plugin-tailwindcss": "latest",
    "eslint-plugin-import": "latest",
    "eslint-plugin-jsx-a11y": "latest"
  }
}
```

**`pnpm-workspace.yaml`** – Lists all subdirectories that are part of the pnpm workspace. This ensures all packages/apps are installed and linked correctly with `pnpm install`.

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**`turbo.json`** – Turborepo pipeline configuration. We set up tasks for building, linting, testing, etc., and define dependencies between them. For example, `web` depends on `ui` and `module` packages, so building `web` will first build those.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],       // Build dependencies first
      "outputs": ["dist/**", ".next/**"]  // Cache build outputs (dist or .next)
    },
    "dev": {
      "cache": false,                // Don't cache dev (always run fresh)
      "parallel": true
    },
    "lint": {
      "outputs": []                  // Lint has no output to cache
    },
    "type-check": {
      "outputs": []                  // Type-check (tsc) has no output
    },
    "test": {
      "outputs": []                  // Tests produce no persisted output
    },
    "e2e": {
      "outputs": []
    }
  }
}
```

**Root ESLint Config (`.eslintrc.json`)** – Extends the shared ESLint config from `@repo/eslint-config`. This way all apps/packages use the same lint rules. We also specify settings for monorepo (like recognizing `import/no-extraneous-dependencies` across workspace).

```json
{
  "root": true,
  "extends": ["@repo/eslint-config"],
  "settings": {
    "import/resolver": {
      "node": {
        "project": [
          "./tsconfig.json",
          "./apps/*/tsconfig.json",
          "./packages/*/tsconfig.json"
        ]
      }
    }
  }
}
```

**Root TypeScript Config (`tsconfig.json`)** – We use project references or at least path mapping here. This file can either reference all subprojects (to enable `tsc --build` for the whole monorepo), or simply provide base compiler options. Here, we'll set up base options and path aliases for the `@repo/*` packages for convenience during development.

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["node"],
    "baseUrl": ".",                        // Allow baseUrl for path mapping
    "paths": {
      "@repo/ui": ["packages/ui/src"],
      "@repo/ui/*": ["packages/ui/src/*"],
      "@repo/module": ["packages/module/src"],
      "@repo/module/*": ["packages/module/src/*"],
      "@repo/assets": ["packages/assets/src"],
      "@repo/assets/*": ["packages/assets/src/*"],
      "@repo/env-config": ["packages/env-config/src"],
      "@repo/env-config/*": ["packages/env-config/src/*"]
    }
  },
  "include": []
}
```

*(The `include` is empty here because each sub-project has its own tsconfig that will specify their files. We use this mainly for path resolution in editors.)*

**MCP Configuration (`.mcp.json` & `settings.local.json`)** – Already provided in the project, these files configure the **Model Context Protocol** servers. `.mcp.json` lists the commands to start the memory, GitHub, and Playwright servers. `settings.local.json` grants permission to the AI assistant (Claude Code) to use certain operations (like creating GitHub issues, running browser actions, etc.). These files allow developers to integrate AI into their workflow, for example by running `npm run mcp:memory` to start a local memory store and then using an AI agent to populate it with project knowledge.

```json
// .mcp.json
{
  "mcpServers": {
    "memory": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ]
    },
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["gh-cli-mcp"]
    },
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

```json
// settings.local.json (abbreviated for brevity)
{
  "permissions": {
    "allow": [
      "Task", "Bash", "Read", "Write", "WebFetch", /* ...common dev perms... */
      "mcp__memory__create_entities", "mcp__memory__read_graph", /* ... memory perms ... */
      "mcp__github__gh_pr_list", "mcp__github__gh_pr_create", /* ... GitHub perms ... */
      "mcp__playwright__browser_close", "mcp__playwright__browser_click" /* ... Playwright perms ... */
    ],
    "deny": []
  }
}
```

*(These configurations enable, for example, an AI agent to receive GitHub webhooks for new PRs and automatically run tests or comment on the PR using the `gh-cli-mcp` tool, or to perform end-to-end tests via Playwright on command.)*

## 🏗️ Apps Detailed Setup

### `apps/web`: Next.js 15 Web Application

The web app is a Next.js application using the App Router (`app/` directory). It is configured to use Tailwind CSS and to allow importing our internal packages. It also includes an example page that demonstrates the module component, and a basic API route for a webhook.

**`apps/web/package.json`** – Includes dependencies for Next.js, React, Tailwind, etc., and scripts to run the development server, build for production, etc.

```json
{
  "name": "web",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint --ext .js,.ts,.tsx .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "tailwindcss": "latest",
    "autoprefixer": "latest",
    "postcss": "latest",
    "@repo/ui": "*",
    "@repo/module": "*",
    "@repo/assets": "*",
    "@repo/env-config": "*"
  },
  "devDependencies": {
    "@types/react": "latest",
    "@types/node": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "typescript": "latest"
  }
}
```

**`apps/web/tsconfig.json`** – Extends the base TypeScript config and sets up Next.js specific typings. We include the `"app"` and `"pages"` directories in compilation. We also ensure TypeScript knows about the path aliases for `@repo/*` (inherited from base).

```json
{
  "extends": "../../packages/typescript-config/tsconfig.json",
  "compilerOptions": {
    "outDir": "build",                   // not actually used by Next, but for consistency
    "moduleResolution": "Node",
    "module": "ESNext",
    "jsx": "preserve",                   // Next.js handles JSX transformation
    "lib": ["ES2022", "DOM"],
    "types": ["next", "next/types/global", "jest", "node"]
  },
  "include": [
    "next-env.d.ts",
    "app/**/*",
    "pages/**/*",
    "components/**/*",
    "hooks/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

**Tailwind Configuration (`apps/web/tailwind.config.js`)** – Extend or include the base Tailwind config from `@repo/ui` to maintain consistency. We point content to the app’s files plus the shared UI package (so Tailwind can tree-shake classes used in shared components).

```js
const sharedConfig = require("../../../packages/ui/tailwind.config");

module.exports = {
  // Extend shared tailwind config (which might include custom theme or plugins)
  ...sharedConfig,
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",      // include UI package components
    "../../packages/module/src/**/*.{ts,tsx}"
  ],
};
```

**Next.js Configuration (`apps/web/next.config.mjs`)** – Enable the experimental App Router features, Tailwind, and transpile our internal packages. Since `@repo/ui`, `@repo/module`, etc., are part of the monorepo and not transpiled to plain JS, we tell Next to transpile them as if they were local code. Also, ensure Tailwind JIT can scan MDX if needed (for docs, but not used in web app).

```js
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true    // enable Next.js app directory
  },
  transpilePackages: [
    "@repo/ui",
    "@repo/module",
    "@repo/assets",
    "@repo/env-config"
  ],
  images: {
    unoptimized: true  // if we plan to export static or just to simplify initial setup
  },
  webpack: (config) => {
    // Ensure we can import .svg as React components if needed
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    });
    return config;
  }
};

export default nextConfig;
```

**Next.js App Directory Structure** – We will create a minimal example. In Next.js App Router, we typically have `app/layout.tsx` and `app/page.tsx` (for the root index route). We'll also create `app/api/` routes for backend functionality (like a webhook endpoint).

**`apps/web/app/layout.tsx`** – The root layout for all pages. It can include a global header or footer, but here we'll focus on including Tailwind's base styles and a theme toggle for dark mode. We also wrap the app with any context providers needed (e.g., maybe a ThemeProvider or context from our UI package if needed).

```tsx
// apps/web/app/layout.tsx
import { ReactNode } from "react";
import "@repo/ui/styles.css";  // hypothetical import if shared UI has global styles or Tailwind base

export const metadata = {
  title: "Turbo Modern Starter – Module App",
  description: "An interactive spinning wheel platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white dark:bg-gray-900">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full text-gray-900 dark:text-gray-100">
        {/* We could add a header/nav here if needed */}
        {children}
      </body>
    </html>
  );
}
```

**`apps/web/app/page.tsx`** – The main landing page of the web app. Here we demonstrate using the shared module logic and UI component. For example, we might allow the user to input some options and spin to pick a random one. We will use a simple component from `@repo/ui` like `<ModuleDisplay>` which in turn uses the module logic from `@repo/module`.

For now, let's create a very simple demo: a hardcoded list of options is passed to the module and we show a random result when a button is clicked.

```tsx
// apps/web/app/page.tsx
"use client";
import { useState } from "react";
import { RandomModule } from "@repo/module";      // using our core module logic
import { ModuleDisplay } from "@repo/ui";          // a UI component for displaying module results
import "@repo/ui/styles.css";                      // ensure Tailwind styles included

export default function HomePage() {
  const [options] = useState([
    { label: "Option A" },
    { label: "Option B" },
    { label: "Option C" }
  ]);
  const [result, setResult] = useState<string | null>(null);

  const handleSpin = () => {
    const module = new RandomModule(options);
    const winner = module.spin();
    setResult(winner.label);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">🎉 Welcome to Turbo Modern Starter Module</h1>
      <p className="mb-4">Click the button to activate module and pick a random option:</p>
      <button 
        onClick={handleSpin} 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Activate Module
      </button>
      {result && (
        <div className="mt-6">
          <ModuleDisplay result={result} /> 
          {/* ModuleDisplay could be a simple component that stylizes the output */}
        </div>
      )}
    </main>
  );
}
```

*(In the above code: `RandomModule` comes from the `@repo/module` package, and `ModuleDisplay` from `@repo/ui`. This shows how the web app can use shared logic and components. The UI component might simply render the result with some styling or even a confetti animation for the winner.)*

**Example API Route** – Next.js App Router allows defining API routes in the `app/api` directory. We include an example webhook endpoint that could be used to integrate with GitHub or other services. For instance, a GitHub webhook can be pointed to `/api/webhook/github` with a secret token.

Let's set up a simple route that logs the event and, say, stores it via the memory MCP server (if running), or triggers some action.

```tsx
// apps/web/app/api/webhook/github/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-hub-signature-256");
  // TODO: verify signature using a secret from env for security

  const event = request.headers.get("x-github-event");
  const payload = await request.json();

  console.log("Received GitHub webhook:", event, payload.action ?? "");

  // Example: if MCP memory server is running, we could record this event.
  // (Pseudo-code for how one might interact with MCP memory - actual implementation may vary)
  /*
  import { MemoryClient } from '@modelcontextprotocol/client-memory';
  const memory = new MemoryClient();
  await memory.createEntity({ type: "github_event", data: payload });
  */

  return NextResponse.json({ status: "OK" });
}
```

*(This is a stub for demonstration. In a real setup, you'd verify the webhook signature and possibly do something useful, like trigger a CI run or annotate an issue. The commented section hints at how one might use an MCP client to store the event, assuming such a client exists. The key is that our app is prepared for such extensions.)*

**Note on Environment Variables**: The web app might need to know the URL of the Directus API or other config. We handle this via environment variables. For example, `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_DIRECTUS_URL` could be defined in a `.env.local` file in `apps/web/`. The `@repo/env-config` package can provide a typed interface to these. For simplicity, we assume any needed env (like Directus URL or API keys) would be listed in `apps/web/.env.example` for developers to copy to `.env.local`. Next.js will automatically load `.env.local` if present.

### `apps/extension`: Browser Extension (Vite + React)

The extension is built with **Vite** and **React**, and uses Tailwind for styling. It shares code with the web app, allowing us to reuse components and logic.

**`apps/extension/package.json`** – Lists dependencies including React, Tailwind, and the Vite plugin for building a browser extension. Also has scripts for dev (perhaps a watch mode) and build.

```json
{
  "name": "extension",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build",
    "lint": "eslint --ext .ts,.tsx src",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "@repo/ui": "*",
    "@repo/module": "*"
  },
  "devDependencies": {
    "typescript": "latest",
    "@types/react": "latest",
    "@types/chrome": "latest",         // Types for Chrome extension API (if needed)
    "vite": "latest",
    "@vitejs/plugin-react": "latest",
    "@crxjs/vite-plugin": "latest",    // Plugin to help bundle extension
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest",
    "eslint": "latest"
  }
}
```

**Browser Extension Manifest (`apps/extension/manifest.json`)** – The manifest v3 configuration for the extension. This defines extension properties like name, icons, permissions, and the background/scripts. We will configure a popup (browser action) that loads an HTML (which Vite will output) containing our React app. We also allow the extension to run on all URLs (if we might inject a content script, although not implementing content scripts now, we keep the option open).

```json
{
  "manifest_version": 3,
  "name": "Turbo Modern Starter Module",
  "description": "Spin the wheel directly from your browser!",
  "version": "0.1.0",
  "action": {
    "default_popup": "index.html",
    "default_title": "Open Module"
  },
  "permissions": [],
  "icons": {
    "16": "icon-16.png",
    "48": "icon-48.png",
    "128": "icon-128.png"
  }
}
```

*(We assume icon files of appropriate sizes exist in `apps/extension/public/` or are generated. For now, they could be placeholders. No extra permissions are needed since the extension just runs a popup. If we wanted a content script to embed a module on any page, we’d add permissions like `"activeTab"` or specify matches, but we'll keep it simple.)*

**Vite Configuration (`apps/extension/vite.config.ts`)** – Configures Vite to build the extension. We use the `@crxjs/vite-plugin` to handle manifest and HMR for extension development. We also integrate Tailwind via PostCSS.

```ts
// apps/extension/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

// Ensure we include Tailwind and any necessary plugins
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest })
  ],
  // Allow importing from our monorepo packages
  resolve: {
    alias: {
      "@repo/ui": "../../packages/ui/src",
      "@repo/module": "../../packages/module/src",
      "@repo/assets": "../../packages/assets/src"
    }
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss')(require('./tailwind.config')), 
        require('autoprefixer')
      ]
    }
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      // The extension will have multiple entry points handled by the crx plugin
      // No explicit entry points needed here because crx plugin reads manifest.
    }
  }
});
```

**Tailwind Config (`apps/extension/tailwind.config.js`)** – Similar to web, we extend the shared UI Tailwind config and point content to our extension source and shared components.

```js
const sharedConfig = require("../../../packages/ui/tailwind.config");

module.exports = {
  ...sharedConfig,
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ]
};
```

**Popup HTML (`apps/extension/index.html`)** – This HTML is the entry for the extension’s popup. Vite will bundle our React app and inject the script here.

```html
<!-- apps/extension/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Turbo Modern Starter Module</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script type="module" src="./src/main.tsx"></script>
  <link rel="stylesheet" href="./index.css" />
</head>
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-w-[300px]">
  <div id="root"></div>
</body>
</html>
```

*(We include a `<div id="root"></div>` where our React app will mount, and we link an `index.css` which will be generated by Tailwind (the `@tailwind base/components/utilities` if we set up a CSS file). The script `src/main.tsx` will bootstrap the React application.)*

**React Application Entry (`apps/extension/src/main.tsx`)** – This file mounts the React app to the DOM. We import Tailwind styles here as well.

```tsx
// apps/extension/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import PopupApp from "./PopupApp";
import "@repo/ui/styles.css";  // import shared Tailwind styles if needed

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<PopupApp />);
```

**Popup React Component (`apps/extension/src/PopupApp.tsx`)** – The main UI of the extension’s popup. It can be similar to the web page: a button to spin and display a result. We’ll reuse the `RandomModule` logic and perhaps the `ModuleDisplay` component.

```tsx
// apps/extension/src/PopupApp.tsx
import { useState } from "react";
import { RandomModule } from "@repo/module";
import { ModuleDisplay } from "@repo/ui";

const defaultOptions = [
  { label: "Tab 1" },
  { label: "Tab 2" },
  { label: "Tab 3" }
];

export default function PopupApp() {
  const [result, setResult] = useState<string | null>(null);

  const spinWheel = () => {
    const module = new RandomModule(defaultOptions);
    const winner = module.spin();
    setResult(winner.label);
  };

  return (
    <div className="p-4 w-72">
      <h2 className="text-lg font-semibold mb-3">🔄 Activate Module!</h2>
      <button 
        onClick={spinWheel} 
        className="w-full py-2 px-3 mb-3 bg-indigo-600 text-white text-center rounded"
      >
        Spin
      </button>
      {result && <ModuleDisplay result={result} />}
    </div>
  );
}
```

*(This provides a minimal but functional extension popup. The styling uses Tailwind classes. The content is deliberately simple. In a real extension, you might allow the user to input their own list or fetch options from a backend, but for our initial setup, this is enough to test shared logic.)*

**Note:** The extension’s build output will be in `apps/extension/dist/`. After running `pnpm build` or `pnpm dev` for the extension, you can load this folder as an unpacked extension in Chrome or Edge, or zip it for Firefox.

### `apps/docs`: Documentation Site (Next.js + Fumadocs)

The docs app provides documentation for our project using **Fumadocs**, which integrates with Next.js App Router to render MDX files as a documentation website with search and navigation.

**`apps/docs/package.json`** – Contains dependencies for Next.js, Fumadocs (core, UI, MDX), MDX support, etc.

```json
{
  "name": "docs",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint --ext .ts,.tsx,.mdx .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "fumadocs-core": "latest",
    "fumadocs-ui": "latest",
    "fumadocs-mdx": "latest",
    "@types/mdx": "latest",
    "tailwindcss": "latest",
    "autoprefixer": "latest",
    "postcss": "latest",
    "@repo/ui": "*"
  },
  "devDependencies": {
    "@types/react": "latest",
    "@types/node": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "typescript": "latest"
  }
}
```

**Tailwind Config (`apps/docs/tailwind.config.js`)** – The docs site likely uses Tailwind as well (Fumadocs UI might have its own styles, but we integrate for any custom MDX styling). We extend the shared UI config for consistency.

```js
const sharedConfig = require("../../../packages/ui/tailwind.config");
module.exports = {
  ...sharedConfig,
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./content/docs/**/*.{md,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  // You might add Fumadocs specific theme extensions or plugins if needed
};
```

**Next.js Config (`apps/docs/next.config.mjs`)** – Enable MDX support and integrate Fumadocs. According to Fumadocs manual installation, we use `createMDX` from `fumadocs-mdx/next` to configure MDX, and then include our Fumadocs content source.

```js
// apps/docs/next.config.mjs
import { createMDX } from 'fumadocs-mdx/next';
const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],  // we might not need to transpile if UI is already JS, but include if needed
  experimental: {
    appDir: true
  }
};

export default withMDX(nextConfig);
```

**Fumadocs Content Source Config (`apps/docs/source.config.ts`)** – Defines the source of documentation content (using Fumadocs MDX in local filesystem mode).

```ts
// apps/docs/source.config.ts
import { defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",   // points to the folder containing our documentation MDX files
});
```

We add a postinstall script in this package to generate types for the content (Fumadocs uses a `.source` directory to generate type definitions for MDX content). In `apps/docs/package.json`, under scripts, we could add:

```json
"postinstall": "fumadocs-mdx"
```

(This runs after install to ensure types like `docs` are generated.)

**Fumadocs MDX Components Mapping (`apps/docs/mdx-components.tsx`)** – Allows us to customize how MDX elements are rendered by providing component overrides. For now, we use the defaults from Fumadocs UI and allow extension.

```tsx
// apps/docs/mdx-components.tsx
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(custom?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...custom,
  };
}
```

**Root Layout for Docs (`apps/docs/app/layout.tsx`)** – We wrap the documentation pages in the Fumadocs provided layout and providers. Fumadocs UI provides a `DocsLayout` component that handles the sidebar, table of contents, etc. We also likely need to include the `RootProvider` (from `fumadocs-ui/provider`) at the top-level to handle theming and context.

```tsx
// apps/docs/app/layout.tsx
import { ReactNode } from "react";
import { DocsLayout, RootProvider } from "fumadocs-ui";  // Assuming fumadocs-ui exports these
import { source } from "@/lib/source";                   // Our loader for docs content
import { baseOptions } from "./layout.config";           // Additional layout config (like site title)

// baseOptions might include nav title, links, etc., defined in a separate file if needed.
export default function DocumentationRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Turbo Modern Starter Documentation</title>
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-900">
        <RootProvider> {/* Provides theming (dark mode), search context, etc. */}
          <DocsLayout tree={source.pageTree} {...baseOptions}>
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
```

We referenced a `baseOptions` which can be defined in `apps/docs/app/layout.config.ts` to set the docs site’s title and maybe navigation links (if any custom ones outside of the content).

For example:

```ts
// apps/docs/app/layout.config.ts
import type { BaseLayoutProps } from "fumadocs-ui/layouts/base";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: "Turbo Modern Starter Docs",
  },
  // You could add footer or other options here as needed
};
```

**Docs Catch-all Page (`apps/docs/app/docs/[...slug]/page.tsx`)** – This is the dynamic route that will render our MDX content. We use Fumadocs' `DocsPage` components to display the content and table of contents, etc.

```tsx
// apps/docs/app/docs/[...slug]/page.tsx
import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { DocsPage, DocsTitle, DocsDescription, DocsBody } from "fumadocs-ui/page";
import { getMDXComponents } from "@/mdx-components";

export default async function DocPage({ params }: { params: { slug?: string[] } }) {
  const page = source.getPage(params.slug);
  if (!page) notFound();
  const Content = page.data.body;
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <Content components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

// Generate static paths for all docs pages at build time
export async function generateStaticParams() {
  return source.generateParams();
}

// Set dynamic metadata (titles) for each page
export async function generateMetadata({ params }: { params: { slug?: string[] } }) {
  const page = source.getPage(params.slug);
  if (!page) return {};
  return { title: page.data.title, description: page.data.description };
}
```

**Docs Content Example** – We add at least one MDX file to demonstrate documentation. For example, `apps/docs/content/docs/index.mdx` as the introduction page.

```mdx
---
title: Introduction
description: Welcome to the Turbo Modern Starter documentation.
---

# Turbo Modern Starter Documentation

Welcome to the **Turbo Modern Starter** docs! Here you'll find guides and API references for the spinning wheel platform.

- **Overview:** Learn about the project structure and core concepts.
- **Getting Started:** Setup the development environment and run the apps.
- **Packages:** Details on each internal package (`ui`, `module`, etc.).
- **Integration:** Using the Directus backend and MCP features.

Enjoy spinning! 🎉
```

*(Fumadocs will process this MDX, and the frontmatter defines the title and description that we used in our page component above.)*

At this point, if you run `pnpm dev` in the `apps/docs` directory (or `turbo run dev` from root), Next.js will start and serve the documentation at [http://localhost:3000](http://localhost:3000) (assuming it uses default port 3000; we might want to differentiate ports if running web and docs simultaneously. We can change one of them to avoid conflict by specifying `PORT` env variable or similar. For example, run docs on port 3001 as mentioned in the README snippet). To do that, one can start the docs app with `PORT=3001 pnpm dev` or adjust the package.json script accordingly for docs (`"dev": "next dev -p 3001"`).

### `apps/directus`: Directus CMS (Dockerized)

We include configuration to run Directus via Docker. In development, this allows us to quickly bring up a Directus instance for managing module options or any content.

**`apps/directus/docker-compose.yml`** – Defines a service for Directus (and optionally a database service if not using SQLite). We will use SQLite for simplicity, which means no separate DB container is required. The Directus container will use a volume to store the SQLite database file so data persists.

```yaml
version: "3.8"
services:
  directus:
    image: directus/directus:latest
    ports:
      - "8055:8055"           # Directus listens on 8055 by default
    environment:
      # Admin user credentials (on first run)
      ADMIN_EMAIL: "admin@example.com"
      ADMIN_PASSWORD: "password123"
      # Use SQLite for database
      DB_CLIENT: "sqlite3"
      DB_FILENAME: "/directus/database/data.db"
      # Set a secret for sessions (use a strong random in production)
      SECRET: "devsecretkey",
      # (Optional) enable real-time features
      WEBSOCKETS_ENABLED: "true"
    volumes:
      - type: volume
        source: directus_data
        target: /directus/database
    restart: unless-stopped

volumes:
  directus_data:
    driver: local
```

This compose file will create a volume `directus_data` to store the SQLite database at `/directus/database/data.db` inside the container. On first startup, Directus will create an admin user with the provided email/password and initialize the database.

**`apps/directus/.env.example`** – We provide an example env file in case the developer wants to run Directus with Docker using `docker-compose --env-file`. This is somewhat redundant with the compose file above, but it's useful for clarity.

```env
# apps/directus/.env.example

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password123
DB_CLIENT=sqlite3
DB_FILENAME=/directus/database/data.db
SECRET=devsecretkey
WEBSOCKETS_ENABLED=true
```

**`apps/directus/README.md`** – Guides the developer on how to start the Directus service.

````markdown
# Directus (CMS Backend)

This directory contains configuration to run a Directus instance for Turbo Modern Starter.

## Running Directus

Ensure you have Docker installed. Then run:

```bash
docker-compose up -d
````

This will start a Directus server on [http://localhost:8055](http://localhost:8055). The first startup will create an admin user with the credentials specified in `docker-compose.yml` (default: [admin@example.com](mailto:admin@example.com) / password123).

## Configuration

* The Directus service is configured to use SQLite (the database file is stored in the Docker volume `directus_data`). This is for development convenience. In production, you might use a Postgres or MySQL service and adjust `DB_CLIENT` and related env vars.
* Update `.env` or `docker-compose.yml` to change configurations (such as admin credentials or enable/disable features).

## Using Directus

Directus provides a web UI at the URL above. Log in with the admin credentials, then you can create collections (tables) for storing module options, results, or any other content. For example, you might create a collection `spins` to log results of spins or a collection `wheel_options` for predefined sets of options.

The Next.js web app can communicate with Directus via the REST or GraphQL API. For instance, to fetch data, use the base URL `http://localhost:8055` (in development). In the web app, this can be configured via an environment variable like `NEXT_PUBLIC_DIRECTUS_URL`.

## Directus and Monorepo

Note that Directus runs as a separate service and is not a TypeScript project. It does not partake in the Turborepo pipeline except being documented and controlled via this configuration.

You can stop the Directus service with:

```bash
docker-compose down
```

All data will persist in the Docker volume. To reset data, remove the volume via:

```bash
docker-compose down -v
```

Be careful: removing the volume will delete the SQLite database.

````

This covers how to use the Directus part of the project.

## 📦 Shared Packages

Let's detail each internal package, including their purpose and example content.

### `packages/@repo/ui`: Shared UI Components

The UI library exports reusable React components styled with Tailwind CSS. This centralizes the design language (colors, spacing, typography) for consistency.

**Key points**:
- It might include components like `Button`, `ModuleDisplay`, `ThemeToggle`, etc.
- It might also include some global CSS (Tailwind base layers).
- It depends on Tailwind CSS and likely React.

**`packages/ui/package.json`** – Define the package name and dependencies.

```json
{
  "name": "@repo/ui",
  "version": "0.0.1",
  "private": true,
  "main": "dist/index.js",           // (If we build it, dist output. Or we could have "src/index.ts" and require transpilation by consumer.)
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint --ext .ts,.tsx src",
    "type-check": "tsc --noEmit",
    "test": "vitest"
  },
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "clsx": "latest"                  // example utility for conditional classes
  },
  "devDependencies": {
    "typescript": "latest",
    "@types/react": "latest",
    "eslint": "latest",
    "vitest": "latest",
    "@testing-library/react": "latest",
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest"
  }
}
````

We include `clsx` as a handy utility for combining CSS classes conditionally, common in React+Tailwind.

**Tailwind Config (`packages/ui/tailwind.config.js`)** – This can define the design system (colors, fonts) for the project. For brevity, we'll keep it mostly default but ensure dark mode is enabled and maybe add custom color.

```js
// packages/ui/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}"
  ],
  darkMode: "class", // use class strategy for dark mode (so we can toggle by adding 'dark' class to html)
  theme: {
    extend: {
      colors: {
        // define brand colors or extend default palette
        primary: {
          DEFAULT: "#2563eb", // blue-600
          dark: "#1e40af"    // blue-800 for dark mode maybe
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),   // example plugin for better form styling (if needed)
    require('@tailwindcss/typography') // for prose styling in docs
  ]
};
```

**PostCSS Config (`packages/ui/postcss.config.js`)** – To use Tailwind in this package (if we ever build CSS here), though primarily Tailwind processing will happen in the consuming apps. But we include it for completeness.

```js
// packages/ui/postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

**`packages/ui/src/index.ts`** – Barrel file that exports all components. Also, we could export a CSS file that contains Tailwind directives if we want apps to import one global CSS.

For example, create a file `packages/ui/src/styles.css`:

```css
/* packages/ui/src/styles.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* You can add shared global styles or component-specific styles here if needed. */
```

Then our `index.ts` can export this CSS for consumption:

```ts
// packages/ui/src/index.ts
export * from "./Button";
export * from "./ModuleDisplay";
// ... other components

// Export Tailwind styles. Apps can import `@repo/ui/styles.css` to include them.
import "./styles.css";
```

**Component Example: Button (`packages/ui/src/Button.tsx`)** – A simple styled button that uses Tailwind classes and allows customizing via props.

```tsx
// packages/ui/src/Button.tsx
import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", className, children, ...props }) => {
  const baseClasses = "px-4 py-2 font-medium rounded focus:outline-none focus:ring";
  const variantClasses =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";

  return (
    <button className={clsx(baseClasses, variantClasses, className)} {...props}>
      {children}
    </button>
  );
};
```

**Component Example: ModuleDisplay (`packages/ui/src/ModuleDisplay.tsx`)** – This could be a component to show the result of a spin, or possibly even an animated module wheel. For simplicity, let's make it just display text with some style or emoji confetti.

```tsx
// packages/ui/src/ModuleDisplay.tsx
interface ModuleDisplayProps {
  result: string;
}

export const ModuleDisplay: React.FC<ModuleDisplayProps> = ({ result }) => {
  return (
    <div className="p-4 border border-dashed border-gray-400 rounded text-center">
      <p className="text-xl">🎊 Result: <strong>{result}</strong></p>
      <p className="text-sm text-gray-500">Congratulations!</p>
    </div>
  );
};
```

*(This component simply takes the result string and displays it. In the future, this could be enhanced to show an actual wheel or graphical representation.)*

We might also include a `ThemeToggle` component that switches the `dark` class on the HTML element for dark mode, but let's keep focus.

**`packages/ui/README.md`** – Document what's in this package and how to use it.

````markdown
# @repo/ui

This package contains shared UI components and styling for Turbo Modern Starter. It uses **React** and **Tailwind CSS**.

## Components

- **Button**: A styled button component that supports primary/secondary variants.
- **ModuleDisplay**: A simple component to display the result of a spin.
- *(Add more as the project grows, e.g., Layout components, form inputs, etc.)*

## Styles

The package also exports a `styles.css` (built with Tailwind). Applications should import this once to apply the Tailwind base and utilities, or ensure they include equivalent Tailwind setup.

For Next.js (web/docs), the global styles import is done in the root layout (e.g., `import "@repo/ui/styles.css";`).
For the extension, the Tailwind CSS is bundled via the Vite configuration which processes this `styles.css`.

## Usage

In an app, import components as:

```tsx
import { Button, ModuleDisplay } from "@repo/ui";
````

Ensure Tailwind styles are loaded. In Next.js, you can import the styles in your root layout or `_app`. In Vite (extension), the styles are included via the index.html and Vite's CSS handling.

All components are written in TypeScript and their types are exported for use in apps.

````

### `packages/@repo/module`: Core Module Logic

This package encapsulates the logic of our spinning wheel – it’s essentially the "business logic" separate from UI, so it can be tested and used in different environments (Node, browser, etc.).

Possible content:
- A class or function to perform a spin given a list of options.
- If we consider more advanced features: weighting options, ensuring fairness, or even generating spin outcomes with effects.

For now, implement a basic random selection.

**`packages/module/package.json`** – Setup for the module package.

```json
{
  "name": "@repo/module",
  "version": "0.0.1",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint --ext .ts src",
    "type-check": "tsc --noEmit",
    "test": "vitest run"
  },
  "devDependencies": {
    "typescript": "latest",
    "@types/node": "latest",
    "eslint": "latest",
    "vitest": "latest"
  }
}
````

(Notice this package has no regular `dependencies` – it’s pure logic. It might use none, or maybe a small helper library if needed, but let's keep it dependency-free for simplicity.)

**`packages/module/src/index.ts`** – Barrel for exports.

```ts
export * from "./RandomModule";
export type { ModuleOption } from "./types";
```

We define a type for module options and a default implementation:

```ts
// packages/module/src/types.ts
export interface ModuleOption {
  label: string;
  [key: string]: any;  // allow extra properties if needed (like weight, id, etc.)
}
```

**`packages/module/src/RandomModule.ts`** – A simple class that picks a random option from a list. If we decide to implement weighting or any fancy logic, we could add it. Also, we could have multiple strategies, but for now one class is fine.

```ts
// packages/module/src/RandomModule.ts
import { ModuleOption } from "./types";

export class RandomModule {
  private options: ModuleOption[];

  constructor(options: ModuleOption[]) {
    if (!Array.isArray(options) || options.length === 0) {
      throw new Error("Module options must be a non-empty array");
    }
    this.options = options;
  }

  /**
   * Spin the wheel and pick a random option.
   * Currently, this uses a uniform random selection.
   * @returns The selected ModuleOption.
   */
  spin(): ModuleOption {
    const idx = Math.floor(Math.random() * this.options.length);
    return this.options[idx];
  }
}
```

We might also plan to have other implementations (e.g., `WeightedModule` if some options have higher probability), but we'll keep it minimal.

We can also add a utility function to parse CSV (as the key features mentioned CSV import). Let's add a simple parser that expects CSV with one column of options or so:

```ts
// packages/module/src/csvParser.ts
import { ModuleOption } from "./types";

/**
 * Parse a CSV string (with one item per line or 'label' column) into ModuleOption list.
 * This is a simple implementation for demonstration.
 */
export function parseOptionsCSV(csvData: string): ModuleOption[] {
  const lines = csvData.split(/\r?\n/).map(l => l.trim()).filter(l => l);
  // If there's a header named 'label', skip the first line
  if (lines.length > 0 && lines[0].toLowerCase().includes("label")) {
    lines.shift();
  }
  return lines.map(line => ({ label: line }));
}
```

Include this in `src/index.ts` exports:

```ts
export { parseOptionsCSV } from "./csvParser";
```

**`packages/module/README.md`** – Describe how to use the module logic.

````markdown
# @repo/module

This package provides the core spinning logic independent of any UI. 

## Usage

- **RandomModule**: A class that selects a random option from a provided list.
  ```ts
  import { RandomModule, ModuleOption } from "@repo/module";

  const options: ModuleOption[] = [{ label: "Alice" }, { label: "Bob" }, { label: "Carol" }];
  const module = new RandomModule(options);
  const winner = module.spin();
  console.log(winner.label);
````

* **parseOptionsCSV**: A helper to parse newline-separated text or CSV content into an array of options.

  ```ts
  import { parseOptionsCSV } from "@repo/module";

  const csvData = "Alice\nBob\nCarol";
  const options = parseOptionsCSV(csvData);
  // options -> [ { label: "Alice" }, { label: "Bob" }, { label: "Carol" } ]
  ```

*(This parser is basic and expects each line to be an option label. It will ignore an initial header line if it contains "label".)*

## Extensibility

The module logic can be extended. For example, you might implement a `WeightedModule` that accepts weights for each option to influence probability, or a `SequentialModule` that cycles through options in order. These can be added alongside `RandomModule`.

All random selections currently use `Math.random()`; for more predictability or testing, a seedable RNG could be used in the future.

The logic here is decoupled from React or the DOM, making it easy to test and reuse in different contexts (Node.js scripts, backend services, etc.).

````

### `packages/@repo/assets`: Shared Assets

This package might contain images or icons that multiple apps use (like a logo). For demonstration, let's say we have a logo SVG and maybe some icons for the extension.

In code, we can either copy actual files (which we can't fully show in text), or reference them. We'll outline the structure.

**`packages/assets/package.json`** – basic package setup.

```json
{
  "name": "@repo/assets",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.js",
  "types": "src/index.d.ts",
  "scripts": {
    "build": "echo 'No build needed for assets' && exit 0",
    "lint": "echo 'No lint needed for assets' && exit 0"
  }
}
````

(This package might not need build or lint if it's just static files references, but we include it as a formality. We can also manage assets differently, but keeping them in a package means we could have TypeScript definitions if needed.)

**Asset files**: e.g., `packages/assets/src/logo.svg`, `packages/assets/src/module-icon.svg`, etc. Since we cannot embed binary, assume they exist. We provide an index file to export paths or require.

**`packages/assets/src/index.ts`** – Maybe provide constants for paths (for Node usage or so) or importable React components via SVGR if we set that up. Simpler, just provide a path or placeholder.

```ts
// packages/assets/src/index.ts
// Export URLs or base64 strings of assets if needed. Here, just export relative paths.
export const LOGO_SVG_PATH = __dirname + "/logo.svg";
export const SPINNER_ICON_SVG_PATH = __dirname + "/module-icon.svg";

// In a Webpack/Next context, you might import these as URLs by configuring asset loading.
// Or use something like SVGR to export React components for SVG.
```

**`packages/assets/README.md`** – Note on usage.

````markdown
# @repo/assets

This package contains static assets (images, icons, etc.) used by other parts of the application.

## Usage

You can import paths or asset identifiers from this package. For example:

```ts
import { LOGO_SVG_PATH } from "@repo/assets";
// Use LOGO_SVG_PATH in an <img src={...}> tag or copy the file during build.
````

In a Next.js app, you might prefer to import images via Next's static import (e.g., `import logo from "@repo/assets/logo.svg"`), which requires appropriate loader configuration.

For simplicity, this package currently just provides file paths. Depending on your build setup, you may handle assets differently (e.g., copy them in public/ folders or inline them).

## Adding Assets

Place asset files (SVG, PNG, etc.) in the `src` directory and export their paths or processed versions in `index.ts`.

````

*(In a real scenario, we might integrate this with the build of apps by copying the asset files into the appropriate public directories or bundling them. For brevity, we won't implement a copying mechanism here, but one could use Turborepo pipeline or a custom script to sync `packages/assets/src` to each app's public directory if needed.)*

### `packages/@repo/env-config`: Environment Configuration Utilities

This package is for sharing configuration logic. For instance, reading environment variables in Node or providing default values.

Use cases:
- Provide a single source of truth for environment variable names.
- Maybe a function like `loadEnv()` that loads `.env` files (in Node context).
- Could also have type definitions for expected env vars (like an interface describing them).

**`packages/env-config/package.json`** – define name and minimal dependencies.

```json
{
  "name": "@repo/env-config",
  "version": "0.0.1",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint --ext .ts src",
    "type-check": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "latest",
    "@types/node": "latest"
  }
}
````

**`packages/env-config/src/index.ts`** – Provide a configuration loader.

We will define an interface for our config, for example environment variables such as Directus URL, maybe in the future API keys, etc. Let's call it `AppConfig`.

```ts
// packages/env-config/src/index.ts

export interface AppConfig {
  /** Base URL for Directus API (no trailing slash) */
  directusUrl: string;
  /** Environment (development, production, etc.) */
  nodeEnv: string;
  /** Port for the web server (for Next.js or others) */
  port?: number;
  /** Any other config as needed... */
}

// Load environment variables and return AppConfig
export function loadConfig(): AppConfig {
  // In Node environment, process.env is available.
  // We assume .env files are already loaded by the runtime (Next.js loads .env for example).
  const config: AppConfig = {
    directusUrl: process.env.DIRECTUS_URL || "http://localhost:8055",
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined
  };
  return config;
}
```

We can also add a small utility to ensure required vars:

```ts
export function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}
```

**`packages/env-config/README.md`** – Document how to use it.

````markdown
# @repo/env-config

This package centralizes environment variable access and configuration for the monorepo.

## Usage

In a Node.js context (Next.js API routes, scripts, etc.):

```ts
import { loadConfig, requireEnvVar } from "@repo/env-config";

const config = loadConfig();
console.log("Using Directus URL:", config.directusUrl);

// If you need a certain env var to be present:
const githubToken = requireEnvVar("GITHUB_TOKEN");
````

The `loadConfig` function applies default values for some settings:

* `DIRECTUS_URL`: defaults to `http://localhost:8055` if not set.
* `NODE_ENV`: defaults to `development` if not set.
* `PORT`: attempts to parse if set.

## .env Files

Each app may have its own `.env.local` or similar. This package does not load `.env` files itself (that is handled by the app or by a bundler like Next.js). Its purpose is to provide utilities once the environment is loaded.

## Extending Config

If new environment variables are introduced (say an API key, etc.), extend the `AppConfig` interface and adjust `loadConfig()` accordingly. This way, all parts of the app that use config can import from this single source of truth, ensuring consistency.

````

### `packages/@repo/eslint-config`: Shared ESLint Configuration

This package provides a base ESLint config that all projects extend, to avoid duplicating rules.

**`packages/eslint-config/package.json`** – define name and peer dependencies (since it will be extended by others).

```json
{
  "name": "@repo/eslint-config",
  "version": "0.0.1",
  "private": true,
  "main": "index.js",
  "peerDependencies": {
    "eslint": ">=8",
    "@typescript-eslint/parser": "*",
    "@typescript-eslint/eslint-plugin": "*",
    "eslint-plugin-react": "*",
    "eslint-plugin-import": "*",
    "eslint-plugin-jsx-a11y": "*",
    "eslint-config-prettier": "*"
  }
}
````

We mark them as peer deps so that the parent projects provide them (which we did in root devDependencies or each app's devDeps). Alternatively, listing them in `dependencies` is possible since it's all local, but peer dep is more correct for shareable config.

**`packages/eslint-config/index.js`** – The actual ESLint rules. We base it off recommended configs for React, TypeScript, Prettier, etc., and also include Tailwind plugin recommended (to catch class sorting issues).

```js
// packages/eslint-config/index.js
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": { "jsx": true },
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": ["./tsconfig.json"]
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "import",
    "jsx-a11y",
    "tailwindcss"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:tailwindcss/recommended",
    "prettier"  // ensure Prettier rules override to avoid conflict
  ],
  "rules": {
    // Example custom rules:
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "react/react-in-jsx-scope": "off", // not needed for React 17+
    "react/prop-types": "off",         // we use TypeScript for type checking
    "import/order": ["error", { "alphabetize": { "order": "asc", "caseInsensitive": true } }],
    "tailwindcss/no-custom-classname": "off" // allow custom class names not just Tailwind (maybe off to allow any custom styling)
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
};
```

**`packages/eslint-config/README.md`** – usage instructions.

````markdown
# @repo/eslint-config

This package provides a base ESLint configuration for the monorepo.

## Usage

In any project in this monorepo, add an ESLint config extending `@repo/eslint-config`. For example, in `.eslintrc.json`:

```json
{
  "extends": ["@repo/eslint-config"]
}
````

This config includes:

* TypeScript support (`@typescript-eslint`)
* React recommended rules
* Accessibility checks (`jsx-a11y`)
* Import order and validity checks
* Tailwind CSS class name linting
* Prettier integration to avoid conflicting rules

Feel free to adjust or extend the rules in this central config. Changes here propagate to all packages that extend it.

When using VSCode or other IDEs, ensure ESLint is set up to use workspace dependencies so it can find this config and the plugins.

````

### `packages/@repo/typescript-config`: Shared TS Config

This package holds a base `tsconfig.json` that all TS projects extend, ensuring consistent compiler options.

**`packages/typescript-config/package.json`** – likely minimal:

```json
{
  "name": "@repo/typescript-config",
  "version": "0.0.1",
  "private": true,
  "main": "tsconfig.json"
}
````

We might not need scripts or dependencies here.

**`packages/typescript-config/tsconfig.json`** – The base config. We already wrote similar content in root tsconfig. We can move it here and have root extend this as well.

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "jsx": "react-jsx",
    "noEmit": true,
    // Enable TS project references if needed:
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    // Base URL and paths for monorepo
    "baseUrl": "../../",  // assuming this config is two levels deep (packages/typescript-config)
    "paths": {
      "@repo/ui": ["packages/ui/src"],
      "@repo/ui/*": ["packages/ui/src/*"],
      "@repo/module": ["packages/module/src"],
      "@repo/module/*": ["packages/module/src/*"],
      "@repo/assets": ["packages/assets/src"],
      "@repo/assets/*": ["packages/assets/src/*"],
      "@repo/env-config": ["packages/env-config/src"],
      "@repo/env-config/*": ["packages/env-config/src/*"]
    }
  }
}
```

*(Project references: We set `"composite": true` and declarations, but we didn't set up actual `references` array in each tsconfig. We could if we wanted to ensure build order with `tsc --build`, but Turborepo already orchestrates build order. For completeness, you might add a `"references": []` section to each package's tsconfig pointing to its dependencies. However, since Next.js and Vite handle transpilation, it's not strictly required to use TS project references. We'll omit explicit references to keep it simpler.)*

**`packages/typescript-config/README.md`** – explanation.

```markdown
# @repo/typescript-config

Shared TypeScript configuration for Turbo Modern Starter monorepo.

All packages and apps extend this base configuration to ensure consistency (strict type checking, target, module resolution, etc.).

Key settings:
- **Strict mode**: enabled (`strict: true` and related flags) to catch potential issues.
- **ES2022**: targetting latest ECMAScript for modern features.
- **DOM** lib**: included for frontend apps (browser APIs).
- **Path aliases**: Configures `@repo/ui`, `@repo/module`, etc., for convenient imports within the monorepo. These correspond to the source directories of each package.

Usage: In your `tsconfig.json`, set `"extends": "@repo/typescript-config/tsconfig.json"`. The path mapping will allow TypeScript to resolve imports like `@repo/ui` to the correct local packages.

If you need to override or add compiler options for a specific package/app (for example, to include specific `types` or change `jsx` handling), you can do so in the extending tsconfig.

```

## 🧪 Testing Configuration

Testing is a crucial part of the project. We integrate **Vitest** for unit and component tests, and **Playwright** for end-to-end tests. We also set up a GitHub Actions workflow to run tests on each push/PR.

### Vitest (Unit & Component Tests)

Vitest is configured similarly to Jest but works seamlessly with Vite (and by extension, our Next and extension setups if needed). We can have a `vitest.config.ts` if needed, but for simplicity we might use package.json scripts to invoke `vitest`.

Let's add an example test in the module package (as it's pure logic):

**`packages/module/src/__tests__/RandomModule.test.ts`** – A simple unit test for the RandomModule.

```ts
import { RandomModule } from "../RandomModule";

describe("RandomModule", () => {
  it("throws error if initialized with empty array", () => {
    // @ts-expect-error: testing invalid input
    expect(() => new RandomModule([])).toThrow();
  });

  it("returns one of the options when spun", () => {
    const options = [{ label: "X" }, { label: "Y" }, { label: "Z" }];
    const module = new RandomModule(options);
    const result = module.spin();
    // The result should be one of the inputs
    const labels = options.map(o => o.label);
    expect(labels).toContain(result.label);
  });

  it("distributes results roughly uniformly", () => {
    const options = Array.from({ length: 5 }, (_, i) => ({ label: `Opt${i}` }));
    const module = new RandomModule(options);
    // Spin 100 times and ensure all options came up at least once (very high probability)
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) {
      seen.add(module.spin().label);
    }
    expect(seen.size).toBe(options.length);
  });
});
```

*(This test ensures our module logic works. It's a basic sanity check. In a real scenario, one might use a deterministic RNG for testing randomness, but this is fine for demonstration.)*

We can also have a simple component test for `ModuleDisplay` using @testing-library/react, but that might be overkill here. We'll provide a placeholder in the UI package if needed.

Example in `packages/ui/src/__tests__/ModuleDisplay.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { ModuleDisplay } from "../ModuleDisplay";
import React from "react";

test("ModuleDisplay shows the result text", () => {
  render(<ModuleDisplay result="TestWinner" />);
  expect(screen.getByText(/TestWinner/)).toBeInTheDocument();
});
```

*(This assumes we have @testing-library/react in devDependencies; we listed it in UI's package.json.)*

For E2E, we set up Playwright tests maybe in the web app:

We can create `apps/web/tests/example.spec.ts` as a simple test that opens the page and clicks the button.

```ts
// apps/web/tests/spin.e2e.spec.ts
import { test, expect } from '@playwright/test';

test('Module button picks a result', async ({ page }) => {
  // Assuming web app is running at localhost:3000
  await page.goto('http://localhost:3000/');
  await page.click('text=Activate Module');
  // After clicking, a result should appear:
  const resultText = await page.textContent('text=Result:');
  expect(resultText).toBeTruthy();
});
```

To run this, we need a Playwright config. Usually, you'd have `playwright.config.ts` at root or in the web app. Let's put one in `apps/web/playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'pnpm build && pnpm start',  // build and start Next.js (or use a dev server)
    port: 3000
  },
  use: {
    headless: true
  }
});
```

*(This config ensures that Playwright will start the Next.js app before running tests. In CI, this might be adjusted to use a dev server or production build accordingly. Also, the port must match what Next uses.)*

Each package or app could have their own tests; for brevity, we've shown module (unit) and web (e2e). The docs and extension could similarly have tests (like docs maybe building and checking a page exists, extension would be harder to test E2E in automated way, but we could simulate extension logic with unit tests for the PopupApp component in jsdom).

### GitHub Actions (CI/CD)

We set up workflows in `.github/workflows/` for:

1. **Linting and Type Check** – Run ESLint and `tsc --noEmit` across all projects.
2. **Tests** – Run Vitest and Playwright tests.
3. **Build** – Ensure the monorepo builds (and maybe artifact the build outputs).
4. **Deploy** – Deploy the `web` app to Vercel (or just trigger Vercel).

For simplicity, we can combine lint and type-check in one workflow, tests in another, and build+deploy in another.

**Workflow: Lint & Type Check (`.github/workflows/lint-typecheck.yml`)**:

```yaml
name: Lint and Type Check

on: [push, pull_request]

jobs:
  lint_typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "pnpm"
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm check-types
```

*(This will install and run `pnpm lint` (which runs `turbo run lint`) and `pnpm check-types` (which runs `turbo run type-check`). Each uses the shared config so all sub-projects are checked.)*

**Workflow: Tests (`.github/workflows/tests.yml`)**:

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  unit-and-e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "pnpm"
      - run: npm install -g pnpm
      - run: pnpm install
      # Run unit tests (Vitest)
      - name: Run unit tests
        run: pnpm test -- --run  # The --run ensures vitest runs in CI (if not using watch mode)
      # Run E2E tests (Playwright)
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run e2e tests
        run: pnpm e2e
```

*(Here we assume `pnpm test` runs vitest and `pnpm e2e` runs Playwright. We might need to ensure the web server is running for e2e; since we set up `webServer` in the Playwright config, the `pnpm e2e` which triggers `turbo run e2e` will likely start the server via our config. If not, one could start it manually. For simplicity, using Playwright's built-in webServer feature as configured.)*

**Workflow: Build & Deploy (`.github/workflows/deploy.yml`)**:

This might run only on main branch pushes or when a release is cut. It will build all and then deploy the web. If deploying to Vercel via GitHub Actions, we need Vercel token and project info in secrets.

Alternatively, skip GH action deploy if Vercel auto-deploys on push. But the requirement explicitly mentions deploying via workflow.

Let's name the branch "main" for triggers.

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "pnpm"
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: ${{ success() }}   # only deploy if build succeeded
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install -g vercel
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: vercel --prod --token=$VERCEL_TOKEN --confirm --org-id=$VERCEL_ORG_ID --project-id=$VERCEL_PROJECT_ID --cwd apps/web
```

In this deployment step:

* We use Vercel CLI to deploy the `apps/web` directory. It assumes that secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` are set in GitHub Actions. These would be obtained from the Vercel account.
* The `--cwd apps/web` tells Vercel CLI to treat that subfolder as the root of the project (since it's a monorepo).
* The `needs: build` ensures we do not deploy if build fails, and possibly one might upload build outputs or rely on Vercel to build. We are actually re-installing and deploying rather than using build artifacts, because Vercel will build on their cloud anyway when using `vercel deploy` unless we use `--prebuilt` with output files.

This is a simplistic deploy step and might incur double build (one in CI and one in Vercel). Alternatively, we could skip building in CI and just rely on Vercel's build. But building in CI is good to catch errors early, even if Vercel will do it again.

**Note on Webhooks to Claude Code**: The CI workflows or GitHub events could also trigger a call to local endpoints if desired. Since that's not typical in GH Actions (they can't call into a local dev environment), it's likely intended for local development or a self-hosted runner scenario. We have already included in the web app an API route for GitHub webhooks. If one wanted to forward GitHub events to an AI (Claude Code), they might configure a webhook in their repo settings pointing to their running dev environment or a cloud function. That part is more about the infrastructure around the code, not the code itself.

We have however prepared the ground by:

* Having the `.mcp.json` and permission config.
* A placeholder API route to receive webhooks.

This should satisfy the requirement of "Allow webhooks (e.g., POST to local Claude Code endpoints on events like PRs or Issues)".

## 🎨 Consistent Design & Accessibility

All apps draw from the same design system:

* **Colors and Themes**: We use Tailwind CSS with a shared configuration so that the same color names (`primary`, etc.) apply everywhere. Light mode and dark mode are supported by toggling the `dark` class (already configured in Tailwind). The docs and web app both respect the user’s color scheme thanks to Tailwind’s `darkMode: 'class'` and wrapping components in the appropriate provider or HTML class.
* **Components**: By using the shared `@repo/ui` library, elements like buttons, form inputs, and display components look and behave consistently across the web app, extension popup, and even within docs (if we choose to use them in MDX).
* **Responsive Design**: Tailwind’s utility classes make it easy to ensure components are responsive. We design mobile-first and test the UI at different breakpoints. For example, our extension popup is fixed small size, but the web app's HomePage and docs are responsive (the docs sidebar from Fumadocs will collapse on mobile).
* **Accessibility (a11y)**: We include `eslint-plugin-jsx-a11y` to catch common accessibility issues. Our components use semantic HTML (e.g., `<button>` for clickable actions, appropriate aria tags if needed). We aim for high contrast by default and provide focus states on interactive elements (see the Button component adding `focus:ring`).

## 🧼 Developer Onboarding & Notes

Each part of the project has a README to guide developers. The root README (this document) provides the big picture. Here are some final notes to help you get started:

* **Initial Setup**: After cloning the repository, run `pnpm install`. This will install all dependencies in all workspaces. You can then run `pnpm dev` to start the web app, docs, and extension in parallel (docs on port 3001 if configured, web on 3000, extension build watcher).
* **Running the Web App**: `pnpm dev --filter web` will run just the web Next.js app. It should open on [http://localhost:3000](http://localhost:3000).
* **Running the Docs**: `pnpm dev --filter docs` (and consider setting `PORT=3001` in `apps/docs/.env.local` or running with `next dev -p 3001`). Then access [http://localhost:3001](http://localhost:3001).
* **Running the Extension**: `pnpm dev --filter extension` will build the extension and watch for changes. Load the `apps/extension/dist` directory in your browser’s extensions page (in Chrome, enable developer mode and "Load unpacked"). After making changes, refresh the extension (or the extension might auto-reload if using the CRX plugin).
* **Using Directus**: See `apps/directus/README.md`. Essentially, `docker-compose up -d` in that directory and you have a backend. You can then configure collections. The web app could be extended to fetch data from Directus (e.g., list of module options) by using the Directus SDK or REST calls. That could be a next step – currently, the module options are hardcoded in the UI for demonstration.
* **Testing**: Run `pnpm test` for unit tests (or `pnpm test -w` to watch during development). Run `pnpm e2e` to execute Playwright tests (make sure the apps are built or running as needed, depending on config).
* **CI Workflows**: The repo is ready for GitHub Actions. When you push to GitHub, it will automatically run the workflows. Ensure to add the required secrets (especially for the deploy workflow to Vercel).
* **MCP (AI Integration)**: If you have Anthropic's Claude or another MCP client set up, you can start the MCP servers with the provided npm scripts. For example, running `pnpm mcp:memory` will start a local memory server. The idea is you could then use an AI assistant that connects to this server to "remember" things about the code (like documentation, Q\&A). The GitHub MCP server would allow an AI to open PRs or issues on the repo – use with caution and proper auth (you'll need to be logged in with `gh` CLI for it to work).

Finally, the project emphasizes **elegance and maintainability**. The structure is meant to be logical and extensible. We prefer convention over configuration – by following Next.js and Turborepo conventions, the setup remains straightforward. As you grow the codebase, keep things modular: when a piece of logic can be reused in another app, consider moving it to a package. When adding a feature to an app, consider if it belongs to UI or can be a generic utility.

Happy coding, and may your wheel always spin true! 🎡✨
