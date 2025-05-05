# .claude

This directory contains tools and scripts created by Claude to help manage the repository. These tools are designed to automate common tasks and improve workflow efficiency.

## Directory Structure

- `scripts/` - Contains executable scripts for various maintenance tasks
  - `update-project-statuses.js` - Updates GitHub project item statuses via GraphQL API

## Usage

Scripts in this directory are designed to be run from the repository root:

```bash
# Make scripts executable if needed
chmod +x .claude/scripts/update-project-statuses.js

# Run a script
node .claude/scripts/update-project-statuses.js
```

## Adding New Scripts

When adding new scripts to this directory:

1. Place them in the appropriate subdirectory
2. Include clear documentation in the script header
3. Update this README.md file
4. Make scripts executable if applicable

## Maintenance

Scripts in this directory are maintained by Claude and the repository maintainers. If you find issues or have suggestions for improvements, please create an issue in the repository.