# turbo-modern-starter

🚀 A cutting-edge monorepo starter with TypeScript, Next.js, Tailwind CSS, Directus CMS, Turborepo, Vitest, Playwright, and GitHub Actions. Optimized for modularity, performance, and an outstanding developer experience.

## Project Overview

This monorepo provides a comprehensive starter template for building modern web applications with a focus on performance, maintainability, and developer experience. It includes:

- **TypeScript** for type safety across the entire codebase
- **React** and **Next.js** for robust web applications using the App Router
- **Tailwind CSS** for utility-first styling with dark mode support
- **Directus CMS** (Dockerized) for content management
- **Turborepo** and **pnpm** for efficient monorepo management
- **Vitest** and **Playwright** for comprehensive testing
- **MCP Integration** for AI-assisted development

## Project Structure

- **`apps/`**: Applications
  - `web/`: Next.js web application
  - `extension/`: Browser extension (Chrome/Firefox)
  - `docs/`: Documentation site (Next.js + Fumadocs)
  - `directus/`: Dockerized Directus CMS

- **`packages/`**: Shared code
  - `@repo/ui`: Shared UI components
  - `@repo/module`: Core business logic
  - `@repo/assets`: Shared visual assets
  - `@repo/env-config`: Environment configuration
  - `@repo/eslint-config`: Shared ESLint rules
  - `@repo/typescript-config`: Shared TypeScript config

## Development

### Getting Started

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all packages and apps
pnpm build

# Run tests
pnpm test
```

### Project Links

- [GitHub Project Board](https://github.com/users/CodingButterBot/projects/4)
- [Issue Tracker](https://github.com/CodingButterBot/turbo-modern-starter/issues)

## Implementation Status

This project is under active development. You can track progress on the [GitHub Project Board](https://github.com/users/CodingButterBot/projects/4).

## License

MIT