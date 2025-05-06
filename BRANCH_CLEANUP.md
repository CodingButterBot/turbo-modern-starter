# GitHub Branch Cleanup Plan

## Current Status
As of May 5, 2025, the repository contains over 20 branches and 6 open pull requests. This creates complexity and makes it difficult to track progress effectively.

## Open Pull Requests
| PR | Title | Branch | Opened | Status |
|----|-------|--------|--------|--------|
| #78 | Fix Extension UI Issues and Build Process | fix/extension-build-issues | 2025-05-05 | **Current Branch** |
| #77 | Implement Directus CMS integration | feature/directus-implementation | 2025-05-05 | Review |
| #68 | Project Automation and Enhanced GitHub Actions | feature/project-automation | 2025-05-05 | Review |
| #67 | Add GitHub project management automation | feature/add-project-automation | 2025-05-05 | Review |
| #60 | Add side panel to browser extension | feature/extension-side-panel | 2025-05-04 | Review |
| #58 | Add browser extension implementation | feature/browser-extension-implementation | 2025-05-04 | Review |

## Recommended Merge Order

### Extension-Related PRs
1. **#58: Browser Extension Implementation** (Base Implementation)
2. **#60: Side Panel Feature** (Builds on #58)
3. **#78: Extension Build Fixes** (Our current work)

### Project Automation PRs
1. **#67: GitHub Project Management**
2. **#68: Enhanced GitHub Actions**

### CMS Integration
1. **#77: Directus CMS Integration**

## Branch Cleanup Recommendations

### Branches to Keep
- `main` - Main development branch
- `fix/extension-build-issues` - Our current working branch
- Branches with active PRs (listed above)

### Branches to Delete (After Merging PRs)
- All feature branches with merged PRs
- Duplicate or abandoned branches:
  - `chore/add-github-workflow-guide`
  - `chore/cleanup-project-structure`
  - `feature/61-extension-component-library` (superseded by #58 and #60)
  - `feature/add-pr-review-script` (consider integrating with #67)
  - `feature/complete-implementation` (too broad)
  - `feature/integrated-fixes` (too generic)
  - `feature/issue-11-example-tests` (appears to be completed or abandoned)
  - `feature/issue-31-build-deploy-workflow` (superseded by #68)
  - `feature/issue-34-41-webhooks-server` (should be own PR or integrated with #77)
  - `feature/issue-38-vercel-config` (should be integrated with deploy workflow)
  - `feature/issue-8-e2e-tests` (should be in separate PR)
  - `feature/merge-remaining-prs` (use structured approach instead)
  - `fix/docs-app` (should be separate PR)
  - `fix/issue-45-ci-workflow` (superseded by #68)
  - `fix/issue-48-ci-workflow-pnpm` (superseded by #68)
  - `fix/issue-50-docs-dependencies` (should be separate PR)
  - `fix/issue-missing-test-coverage` (should be part of test PR)
  - `fix/unify-all-prs` (use structured approach instead)
  - `pr-46` (should be PR branch, not local branch)

## Branch Management Process Going Forward

### Branch Naming Convention
- `feature/[issue-number]-brief-description` - For new features
- `fix/[issue-number]-brief-description` - For bug fixes
- `chore/[issue-number]-brief-description` - For maintenance tasks
- `docs/[issue-number]-brief-description` - For documentation updates

### PR Process
1. Create branch from latest `main`
2. Implement changes
3. Create PR to `main`
4. Link PR to relevant GitHub issue(s)
5. Request review
6. Merge when approved
7. Delete branch after merging

### Branch Cleanup Schedule
- Perform branch cleanup monthly
- Delete merged branches immediately after PR is merged
- Review stale branches (no commits for 30+ days) for potential deletion

## Implementation Plan

### Phase 1: Merge Extension PRs
1. Review and merge #58 (base extension)
2. Rebase #60 on latest `main`, review and merge
3. Rebase our current PR (#78) on latest `main`, review and merge

### Phase 2: Merge Project Automation PRs
1. Review and merge #67
2. Rebase #68 on latest `main`, review and merge

### Phase 3: Merge CMS Integration
1. Review and merge #77

### Phase 4: Clean Up Branches
1. Delete all branches from the "Branches to Delete" list
2. Document remaining branches and their purpose

### Phase 5: Create Missing PRs
1. Create PRs for important work in branches without PRs
2. Close or delete branches that are no longer needed

## Timeline
- Phase 1: May 6-7, 2025
- Phase 2: May 8-9, 2025
- Phase 3: May 10-11, 2025
- Phase 4: May 12, 2025
- Phase 5: May 13-14, 2025

## Conclusion
Following this branch cleanup plan will significantly reduce complexity and improve the maintainability of the repository. The structured approach ensures that no valuable work is lost while removing the confusing array of overlapping branches.

After implementation, we should have a cleaner repository with fewer branches, all of which have clear purpose and recent activity. This will make it easier to understand the project's structure and progress.