# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Turbo Modern Starter is a cutting-edge monorepo starter with:
- TypeScript, React, and Next.js for web applications 
- Browser extension support with Vite
- Directus CMS integration
- Documentation site built with Next.js and MDX
- Comprehensive testing with Vitest and Playwright
- CI/CD with GitHub Actions

## Build Commands
- `pnpm dev` - Run all development servers in parallel
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Lint all projects using ESLint
- `pnpm check-types` - Run TypeScript type checking
- `pnpm format` - Format all files with Prettier
- `pnpm test` - Run all tests (unit and e2e)
- `pnpm e2e` - Run Playwright end-to-end tests
- `pnpm clean` - Clean build artifacts and node_modules

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
- `apps/` - Applications
  - `web/` - Next.js web application
  - `extension/` - Browser extension (Chrome/Edge) with React, Vite, and Tailwind
  - `docs/` - Documentation site with Next.js and MDX
  - `directus/` - Dockerized Directus CMS instance
- `packages/` - Shared packages
  - `directus-client/` - Shared Directus client for web and extension
  - Various configuration packages (ESLint, TypeScript, UI components)
- `e2e/` - End-to-end tests with Playwright

## Extension Specifics
The browser extension (`apps/extension/`) is built with:
- Manifest V3 compatibility
- React and Vite for UI components
- Tailwind CSS for styling
- Service workers for background functionality
- Side panel, popup, and options pages
- Communication between extension contexts using message passing
- Directus SDK integration for authentication and data fetching

The extension build process involves:
1. Building React components with Vite
2. Generating HTML files for popup, options, and side panel
3. Copying static assets (icons, scripts) to the dist folder
4. Running verification to ensure all required files are present

Common extension issues include:
- Service worker importScripts path errors
- HTML file generation and proper paths
- Asset copying and pathing
- Chrome extension API version compatibility

## Communication Preferences
- Always use ElevenLabs voice "Sebastian Lague" (voice ID: tAblEwhJ8ycHNukBlZMA) when generating audio responses
- When generating audio with ElevenLabs, immediately play the audio using the play_audio tool
- Always use mcp__elevenlabs__text_to_speech tool for direct verbal communication
- Always follow text_to_speech with play_audio tool to play the generated audio
- Use "\n" instead of line breaks in all text_to_speech content
- Assume the user is at their desk and will hear all audio logs
- Prefer using SDK libraries over direct API calls when available
- Check memory regularly for user preferences and previous interactions
- Provide periodic status updates on complex, multi-step tasks
- Be concise but informative in text responses

## Developer Audio Logs
Create regular audio logs in the `dev_log/` directory with the following requirements:
- Name files with format: `YYYYMMDD_HHMMSS_issue-number_brief-title.mp3`
- Save all development-related audio logs to this directory
- Delete purely conversational audio not related to development
- Link relevant GitHub issues in log metadata
- Commit audio logs to the repository
- Maintain consistent and frequent logging

### Audio Log Structure
Each dev log should follow this 60-90 second structure:
1. **Identifier** (5-10s): State log number, date, and related issue number
2. **Context** (10-15s): Briefly explain what you're working on and why
3. **Progress** (20-30s): Summarize work completed since last log
4. **Challenges** (10-15s): Mention any obstacles or insights
5. **Next Steps** (10-15s): Outline immediate plans
6. **Questions** (optional): Note any blocking issues requiring feedback

Example script:
```
"Dev Log #3, May 5th, regarding issue #42.
I'm working on fixing the extension build process to properly generate HTML files.
Since yesterday, I've implemented the post-build script that correctly copies assets and verified the manifest.json paths are working properly.
The main challenge was figuring out why relative paths weren't resolving - turns out we needed to update the base URL in the Vite config.
Next, I'll finalize the verification script and add tests to prevent regression.
Question: Should we also update the extension documentation with these changes?"
```

## MCP Integration
The project includes integration with Model Context Protocol (MCP) servers:
- Memory Server - For AI knowledge management
- GitHub Server - For repo and PR management
- Playwright Server - For browser automation and testing

## Testing Approach
- Unit tests with Vitest
- Component testing with React Testing Library
- End-to-end tests with Playwright
- Extension-specific tests for background scripts and UI components
- CI/CD integration with GitHub Actions