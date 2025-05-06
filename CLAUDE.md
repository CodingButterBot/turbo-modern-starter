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

## Development Log Guidelines

### Overview
Development logs provide a structured audio and text record of progress and decision-making. These logs are stored outside the git repository to preserve them across branch changes.

### Log Location
- All development logs are stored in `/home/codingbutter/GitHub/dev_log/`
- Logs are organized by date using a year-month/day folder structure (e.g., `/dev_log/2025-05/05/`)
- Each day has a consolidated `log.md` file containing all entries for that day
- Audio files are stored alongside the log.md file in the same directory

### Log Format
Each log entry in the log.md file must include:
1. Timestamped header in the format: `### [HH:MM:SS] Entry Title`
2. Audio file reference link: `[YYYYMMDD_HHMMSS_topic-identifier.mp3](./YYYYMMDD_HHMMSS_topic-identifier.mp3)`
3. GitHub issue/PR references (if applicable): `[#XX](https://github.com/CodingButterBot/turbo-modern-starter/issues/XX)`
4. Transcript of the audio log in a markdown code block

### Audio Log Requirements
- Each audio log should be 60-90 seconds in length
- Use Sebastian Lague's voice (voice ID: tAblEwhJ8ycHNukBlZMA) for all audio recordings
- Audio files must be named with the pattern: `YYYYMMDD_HHMMSS_topic-identifier.mp3`
- After creating an audio file, always play it using the `mcp__elevenlabs__play_audio` tool

### Creating a New Dev Log Entry
1. Check the existing log.md file at `/home/codingbutter/GitHub/dev_log/YYYY-MM/DD/log.md` for reference
2. Generate the audio log using the ElevenLabs TTS tool with Sebastian Lague's voice
3. Rename the generated audio file to follow the convention: `YYYYMMDD_HHMMSS_topic-identifier.mp3`
4. Play the audio file to verify it was created correctly
5. Add a new entry to the log.md file with proper timestamp, audio link, and transcript
6. Update the "Summary of Work" section in log.md to include the new accomplishment

### Example Workflow
```
1. Create audio with mcp__elevenlabs__text_to_speech using Sebastian Lague's voice ID
2. Rename the file to YYYYMMDD_HHMMSS_topic-identifier.mp3
3. Play the audio file with mcp__elevenlabs__play_audio
4. Add a new entry to the day's log.md file
5. Update the Summary of Work section
```

### Log Entry Structure
```
### [HH:MM:SS] Entry Title
- **Audio**: [YYYYMMDD_HHMMSS_topic-identifier.mp3](./YYYYMMDD_HHMMSS_topic-identifier.mp3)
- **Related Issues**: [#XX](https://github.com/CodingButterBot/turbo-modern-starter/issues/XX)
- **Transcript**:
  ```
  Dev Log #XX, Month Day, Year, regarding [topic].

  [Detailed description of work completed]

  [Challenges encountered]

  [Next steps]
  ```
```

### Reference
Always check existing log entries at `/home/codingbutter/GitHub/dev_log/` for reference before creating new entries. Follow the established pattern for consistency.