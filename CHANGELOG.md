# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Theme system with light, dark, and system modes
- ThemeSelector component for theme management UI
- Complete TypeScript conversion of extension components
- Directus CMS integration for extension

### Fixed
- Extension UI issues in options.html and sidepanel.html
- manifest.json missing from extension build
- Button state toggling in DirectusSettings component
- Dark mode support in extension UI
- Theme persistence between sessions
- Theme transitions for smoother experience

### Changed
- Migrated all JavaScript files to TypeScript
  - App.jsx → App.tsx
  - DirectusSettings.jsx → DirectusSettings.tsx
  - ModuleComponent.jsx → ModuleComponent.tsx
  - main.jsx → main.tsx
  - directus-client.js → TypeScript implementation
  - vite.config.js → vite.config.ts
- Improved build process to include all necessary files
- Enhanced extension packaging

## [0.0.1] - 2025-05-04

### Added
- Initial monorepo structure with Turborepo
- Base extension implementation
- Web app implementation
- Documentation site
- Shared packages structure

### Changed
- None (initial release)

### Deprecated
- None

### Removed
- None

### Fixed
- None

### Security
- None