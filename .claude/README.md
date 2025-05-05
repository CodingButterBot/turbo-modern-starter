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

## GitHub Actions Workflow

These scripts are used in the `.github/workflows/project-management.yml` workflow, which:

1. Updates project statuses automatically on push, PR activity, and issue activity
2. Optionally updates priorities when manually triggered
3. Verifies all statuses are consistent

## Usage with GitHub Actions

Run the workflow manually:
```
gh workflow run project-management.yml
```

To update both statuses and priorities:
```
gh workflow run project-management.yml -f update-priorities=true
```