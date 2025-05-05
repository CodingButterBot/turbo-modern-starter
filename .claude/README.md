# Claude Helper Tools

This directory contains helper scripts and tools created by Claude AI to assist with project management and automation for the Turbo Modern Starter project.

## Project Management Scripts

Scripts in the `scripts` directory help automate GitHub project management tasks:

### Update Project Statuses

`scripts/update-project-statuses.js` - Automatically updates GitHub project item statuses based on their current state.

**Usage:**
```bash
node scripts/update-project-statuses.js
```

**Environment Variables:**
- `GITHUB_TOKEN`: Personal access token with project access
- `PROJECT_ID`: ID of the GitHub project (default: PVT_kwHODHqkes4A4KTr)
- `ORGANIZATION`: GitHub organization name (default: CodingButterBot)
- `REPOSITORY`: GitHub repository name (default: turbo-modern-starter)

### Verify Project Statuses

`scripts/verify-project-statuses.js` - Checks for inconsistencies between item states and their status values.

**Usage:**
```bash
node scripts/verify-project-statuses.js
```

**Environment Variables:**
Same as above.

### Update Project Priorities

`scripts/update-project-priorities.js` - Updates priorities and statuses for predefined project items.

**Usage:**
```bash
node scripts/update-project-priorities.js
```

**Environment Variables:**
Same as above.

### Cleanup Project Board

`scripts/cleanup-project-board.js` - Comprehensive cleanup script that ensures all items have appropriate priorities, statuses, and other metadata.

**Usage:**
```bash
node scripts/cleanup-project-board.js
```

**Environment Variables:**
Same as above.

### Fix Project Board

`scripts/fix-project-board.js` - Direct fix for project board issues, forcing all closed items to "Done" status and fixing incorrect statuses.

**Usage:**
```bash
node scripts/fix-project-board.js
```

**Environment Variables:**
Same as above.

### Generate Workflow Badges

`scripts/generate-workflow-badges.js` - Creates GitHub Actions workflow status badges to display in README.md.

**Usage:**
```bash
node scripts/generate-workflow-badges.js --output README.md
```

## GitHub Actions Workflow

These scripts are used in the `.github/workflows/project-management.yml` workflow, which provides several options:

1. Updates project statuses automatically on push, PR activity, and issue activity
2. Performs a comprehensive board cleanup when manually triggered with the cleanup option
3. Optionally updates priorities when manually triggered
4. Verifies all statuses are consistent
5. Generates workflow status badges for the README

## Usage with GitHub Actions

Run the workflow with default options (board cleanup):
```
gh workflow run project-management.yml
```

Run with specific options:
```
gh workflow run project-management.yml -f cleanup-board=true
gh workflow run project-management.yml -f update-priorities=true
```