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
- `.claude/` - Helper scripts and tools managed by Claude

## Claude Helper Scripts
The `.claude/` directory contains useful scripts and tools for repository management:

- `.claude/scripts/update-project-statuses.js` - Updates GitHub project item statuses
- `.claude/scripts/verify-project-statuses.js` - Checks current status values against expected values
- Check the `.claude/README.md` file for detailed documentation on available tools

### GitHub Project Management
Before starting new development work:
1. Verify project statuses: `node .claude/scripts/verify-project-statuses.js`
2. Update statuses if needed: `node .claude/scripts/update-project-statuses.js`
3. Refer to `.claude/github-project-management.md` for detailed guidelines

**IMPORTANT**: Always use the tools in the `.claude/` directory for repository management tasks rather than creating scripts in the root directory. Keep all helper scripts organized in this dedicated location.