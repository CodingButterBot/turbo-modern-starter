# Turbo Modern Starter

![Build Status](https://github.com/codingbutter/turbo-modern-starter/workflows/CI/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

🚀 A cutting-edge monorepo starter with TypeScript, Next.js, Tailwind CSS, Directus CMS, Turborepo, Vitest, Playwright, and GitHub Actions. Optimized for modularity, performance, and an outstanding developer experience.

## Features

- 📦 **Monorepo Structure** - Powered by Turborepo for efficient build and dependency management
- 🔷 **TypeScript** - Type-safe code across all packages and applications
- ⚛️ **Next.js Apps** - Web application with modern React features
- 🧩 **Shared Packages** - Reusable UI components, utilities, and configuration
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- 🔍 **Testing** - Comprehensive testing with Vitest and Playwright
- 🔄 **CI/CD** - Automated workflows with GitHub Actions
- 🧪 **CMS Integration** - Dockerized Directus CMS for content management
- 🌐 **Browser Extension** - Chrome extension with React and Vite

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm 7+
- Docker (for Directus CMS)

### Installation

```bash
# Clone the repository
git clone https://github.com/codingbutter/turbo-modern-starter.git
cd turbo-modern-starter

# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

## Project Structure

```
turbo-modern-starter
├── apps/                  # Applications
│   ├── docs/              # Documentation site (Next.js + Fumadocs)
│   ├── extension/         # Browser extension (Vite + React)
│   └── web/               # Web application (Next.js)
├── packages/              # Shared packages
│   ├── ui/                # UI components
│   ├── config/            # Shared configuration
│   └── utils/             # Utility functions
├── .github/               # GitHub configuration and workflows
├── e2e/                   # End-to-end tests with Playwright
└── docs/                  # Global documentation
```

## Development

```bash
# Run all development servers
pnpm dev

# Build all packages and applications
pnpm build

# Run tests
pnpm test

# Run end-to-end tests
pnpm e2e
```

## Documentation

For detailed documentation:

- [Contributing Guide](./CONTRIBUTING.md)
- [Testing Guide](./docs/testing.md)
- [Deployment Guide](./docs/deployment.md)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.