# Contributing to Turbo Modern Starter

Thank you for considering contributing to Turbo Modern Starter! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm 7+
- Docker (for Directus CMS)

### Development Environment Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/turbo-modern-starter.git`
3. Install dependencies: `pnpm install`
4. Start the development server: `pnpm dev`

## Development Workflow

### Branch Naming Convention

- Use the format: `type/issue-number-brief-description`
- Examples:
  - `feature/42-add-dark-mode`
  - `fix/56-header-navigation-bug`
  - `docs/update-api-documentation`
  - `chore/update-dependencies`

Types:
- `feature`: New features or significant additions
- `fix`: Bug fixes
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependencies, tooling
- `refactor`: Code changes that neither fix bugs nor add features

### Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

```
type(scope): brief description

[optional body]

[optional footer]
```

Examples:
- `feat(web): add user profile page`
- `fix(ui): resolve button focus state issue`
- `docs: update API documentation`
- `chore: update dependencies`

### Pull Request Process

1. Create a new branch from `main`
2. Make your changes
3. Run tests: `pnpm test`
4. Run linting: `pnpm lint`
5. Push your branch and create a pull request
6. Fill out the pull request template

## Testing

See the [Testing Guide](./docs/testing.md) for details on running and writing tests.

## Project Structure

```
turbo-modern-starter
├── apps/                  # Applications
│   ├── docs/              # Documentation site
│   ├── extension/         # Browser extension
│   └── web/               # Web application
├── packages/              # Shared packages
│   ├── ui/                # UI components
│   ├── config/            # Shared configuration
│   └── utils/             # Utility functions
└── e2e/                   # End-to-end tests
```

### Guidelines for Adding New Components

1. Create a new directory in the appropriate package
2. Include tests for your component
3. Document your component's API
4. Ensure your component works in dark mode

### Guidelines for Adding New Packages

1. Use the package template: `pnpm create-package your-package-name`
2. Document the package's purpose and API
3. Add the package to the monorepo workspace in `pnpm-workspace.yaml`

## Documentation

- Update documentation for any features, API changes, or bug fixes
- Ensure code examples work and are up to date
- Use markdown for documentation when possible

## Releasing

The project follows [Semantic Versioning](https://semver.org/).

## Getting Help

If you have questions or need help, you can:
- Open an issue
- Reach out to maintainers

## Thank You

Your contributions are what make open source great! Thank you for your time and effort.