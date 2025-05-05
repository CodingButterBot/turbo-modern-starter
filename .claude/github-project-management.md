# GitHub Project Management

This document outlines the key information for managing GitHub Projects in the turbo-modern-starter repository.

## Project Information

- **Project Name**: Turbo Modern Starter Implementation
- **Project ID**: PVT_kwHODHqkes4A4KTr
- **Status Field ID**: PVTSSF_lAHODHqkes4A4KTrzgtLOB4

## Status Values

| Status Name | Status ID | Description |
|-------------|-----------|-------------|
| Todo | f75ad846 | Work not yet started |
| In Progress | 47fc9ee4 | Work actively being done |
| Pending Review | a352001e | Work completed and waiting for review |
| Done | 98236657 | Work completed and approved |
| On Hold | 0888ff68 | Work paused or delayed |

## Item Management

Items in the GitHub Project should be maintained with accurate status values. The script `.claude/scripts/update-project-statuses.js` can be used to update status values programmatically.

### Status Update Workflow

1. **Check current status**: Use GitHub web interface to check current item status
2. **Update script**: Modify the `ITEMS_TO_UPDATE` object in the script to include items that need updates
3. **Run script**: Execute the script from the repository root using `node .claude/scripts/update-project-statuses.js`
4. **Verify changes**: Confirm the updates appear correctly in the GitHub Project board

## Current Items (as of last update)

| Number | Title | Status | Item ID |
|--------|-------|--------|---------|
| #61 | Implement extension UI component library | Done | PVTI_lAHODHqkes4A4KTrzgZ_xhs |
| #62 | Add i18n support to browser extension | Todo | PVTI_lAHODHqkes4A4KTrzgZ_xh4 |
| #63 | Implement extension data synchronization | Todo | PVTI_lAHODHqkes4A4KTrzgZ_xh8 |
| #64 | Implement extension UI component library (PR) | Pending Review | PVTI_lAHODHqkes4A4KTrzgZ_xvM |
| #65 | Standardize GitHub project workflow | In Progress | PVTI_lAHODHqkes4A4KTrzgZ_x1M |
| #66 | Add GitHub project workflow guidelines (PR) | Pending Review | PVTI_lAHODHqkes4A4KTrzgZ_x1o |

## Best Practices

1. **Always maintain accurate status values** in the project board
2. **Create issues for all features/bugs** before starting work
3. **Link PRs to their corresponding issues** for better tracking
4. **Update status promptly** when work status changes
5. **Use the scripts in the `.claude` directory** for automated management tasks