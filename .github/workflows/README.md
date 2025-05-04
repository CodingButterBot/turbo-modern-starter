# GitHub Action Workflows

This directory contains GitHub Action workflows for CI/CD processes in the Turbo Modern Starter monorepo.

## Available Workflows

- **CI (`ci.yml`)**: Runs on every push to main and pull request. Performs build and basic test.
- **Tests (`test.yml`)**: Runs unit tests with coverage reporting.
- **E2E Tests (`e2e.yml`)**: Runs end-to-end tests using Playwright.
- **Deploy (`deploy.yml`)**: Handles building and deploying applications to their respective targets.

## Deployment Workflow

The deployment workflow (`deploy.yml`) is designed to:

1. Build all applications and packages in the monorepo
2. Deploy web and docs applications to Vercel
3. Package and publish the browser extension (for version tags)

### Required Secrets

To use the deployment workflow, add these secrets to your GitHub repository:

```
VERCEL_TOKEN=your_vercel_api_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_WEB_PROJECT_ID=your_web_project_id
VERCEL_DOCS_PROJECT_ID=your_docs_project_id
```

### Workflow Triggers

The deployment workflow runs on:
- Pushes to `main` branch
- Version tags (`v*`)
- Manual workflow dispatch

## Continuous Integration Workflow

The CI workflow (`ci.yml`) runs on all branches and handles:
- Dependency installation
- Linting and type checking
- Building all packages and applications

## Testing Workflows

- **Unit Tests (`test.yml`)**: Runs Vitest tests and reports coverage to Codecov
- **E2E Tests (`e2e.yml`)**: Runs Playwright tests for all applications

## Caching Strategy

All workflows utilize caching for:
- PNPM store
- Build artifacts
- Playwright browsers

This ensures fast and efficient workflow execution.

## Customization

To customize these workflows, modify the YAML files in this directory. Refer to the GitHub Actions documentation for more information on available actions and syntax.