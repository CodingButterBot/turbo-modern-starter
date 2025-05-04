# GitHub Project Workflow Guidelines

This document outlines the standard workflow for managing tasks in the Turbo Modern Starter project using GitHub Projects, Issues, and Pull Requests.

## Issue Management

### Creating Issues

1. **Create Detailed Issues:**
   - Provide a clear, concise title
   - Include a detailed description of the work required
   - Use the template structure:
     ```
     ## Description
     [Brief overview of the task]

     ## Requirements
     - [ ] Requirement 1
     - [ ] Requirement 2
       - [ ] Sub-requirement A
       - [ ] Sub-requirement B
     - [ ] Requirement 3

     ## Technical Details
     [Technical specifics about implementation]

     ## Acceptance Criteria
     - [ ] Criteria 1
     - [ ] Criteria 2
     - [ ] Criteria 3

     ## Status
     [Current status updates]
     ```

2. **Use Checklists:**
   - Break down requirements into checkbox lists `- [ ]`
   - Create hierarchical checklists where appropriate
   - Update checkboxes as work progresses (`- [x]` for completed items)

3. **Add to Project Board:**
   - Assign all issues to the appropriate project board
   - Set the correct status (Backlog, Todo, In Progress, etc.)
   - Add relevant labels and assignees

### Updating Issues

1. **Regular Status Updates:**
   - Update the "Status" section with current progress
   - Check off completed items in checklists
   - Add comments for significant milestones or blockers

2. **Link Related PRs:**
   - Reference PRs that implement the issue using `#PR-number`
   - When a PR is created, ensure it references the issue using "Closes #issue-number"

## Branch Management

1. **Branch Naming Convention:**
   - Use the format: `feature/issue-number-brief-description`
   - Example: `feature/61-extension-ui-components`

2. **Feature Branch Workflow:**
   - Create a new branch for each issue
   - Branch from `main` (or specified base branch)
   - Keep branches focused on a single issue

## Pull Request Workflow

1. **Create Detailed PRs:**
   - Use the format:
     ```
     ## Summary
     [Brief overview of changes]

     ## Changes
     - Change 1
     - Change 2
     - Change 3

     ## Test Plan
     [How to test the changes]

     Closes #issue-number
     ```

2. **Update Project Status:**
   - When creating a PR, update the issue status to "In Review"
   - Link the PR to the project board
   - Update issue checklists to reflect the completed work

3. **PR Review Process:**
   - All PRs require at least one review
   - Address review comments promptly
   - Update the PR description if implementation details change

## Project Board States

Issues and PRs should move through these states:
1. **Backlog**: Planned but not ready to start
2. **Todo**: Ready to be worked on
3. **In Progress**: Actively being worked on
4. **In Review**: PR submitted, awaiting review
5. **Done**: Merged and deployed

## Status Updates

1. **Always keep GitHub aligned with reality:**
   - Update issue statuses in real-time as work progresses
   - Keep checklists updated to reflect current progress
   - Leave comments explaining any delays or blockers

2. **Regular Board Reviews:**
   - Review the project board before planning new work
   - Move stale issues back to appropriate states
   - Close resolved issues promptly

## Documentation

1. **Update Documentation Along with Code:**
   - Update relevant documentation in the same PR as code changes
   - Include examples for new features
   - Keep README.md and other docs current

By following these guidelines, we ensure that our GitHub Projects accurately reflect the current state of work, making it easier for everyone to understand project progress and priorities.