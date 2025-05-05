# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `pnpm dev` - Run all development servers in parallel
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Lint all projects using ESLint
- `pnpm check-types` - Run TypeScript type checking
- `pnpm format` - Format all files with Prettier
- `pnpm test` - Run all tests (unit and e2e)
- `pnpm e2e` - Run Playwright end-to-end tests

## Code Style Guidelines
- Use strict TypeScript with proper type definitions
- Follow ESLint and Prettier configurations
- Use named exports instead of default exports
- Use functional components with hooks for React
- Use Tailwind CSS for styling with consistent design tokens
- Keep components small and focused on a single responsibility
- Write comprehensive unit tests with Vitest
- Handle errors explicitly, avoid silent failures
- Use meaningful variable and function names
- Follow monorepo structure with clear separation of concerns

## Repository Structure
- `apps/` - Applications (web, extension, docs, directus)
- `packages/` - Shared packages (ui, module, assets, config, etc.)
- `.claude/` - Helper scripts and tools for project management
  - `scripts/` - Contains automation scripts for GitHub project management
  - See `.claude/README.md` for details on available tools

## GitHub Project Management
- Use the project management workflow to update item statuses and priorities
- Run `gh workflow run project-management.yml` to update project statuses
- For manual updates to priorities, run `gh workflow run project-management.yml -f update-priorities=true`
- All helper scripts are located in `.claude/scripts/`