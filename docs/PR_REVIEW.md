# Pull Request Review Process

This document outlines the PR review process for the Turbo Modern Starter monorepo, including automated PR review using Claude.

## Automated PR Review Script

The repository includes a script for automated PR review using Claude:

```bash
pnpm pr:review
```

This script will:
1. Run Claude with a specialized prompt
2. Analyze all open PRs and their associated CI job results
3. Comment on related issues with necessary fixes if jobs fail
4. Add appropriate issues to the project board when needed

## When to Use Automated PR Review

Use the automated PR review in these situations:

1. After creating new PRs or updating existing ones
2. When CI checks fail on a PR
3. At the end of development sessions to catch any pending issues
4. During regular repository maintenance

## Manual PR Review Process

For manual PR reviews, follow these steps:

1. **Checkout the PR branch**
   ```bash
   gh pr checkout <PR-NUMBER>
   ```

2. **Run tests locally**
   ```bash
   pnpm test
   pnpm e2e
   ```

3. **Review code changes**
   ```bash
   gh pr diff <PR-NUMBER>
   ```

4. **Add comments or request changes**
   ```bash
   gh pr comment <PR-NUMBER> -b "Your comment"
   ```

## PR Approval Process

PRs require:
1. Passing CI checks
2. Passing tests (unit and E2E)
3. Code review approval
4. Issues to be properly linked

## Merge Strategy

Once approved, PRs should be merged with:

1. **Squash and merge** for small bug fixes
2. **Create a merge commit** for feature branches with multiple meaningful commits

## Best Practices

1. Keep PRs focused on a single issue or feature
2. Ensure all checklist items in the issue are completed
3. Update issue status to "Pending Review" when PR is ready
4. Update issue status to "Done" when PR is merged
5. Use meaningful commit messages that reference issues
6. Run automated PR review before requesting manual review