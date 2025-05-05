#!/usr/bin/env node
/**
 * GitHub Project Status Updater
 * 
 * This script updates the status values of GitHub project items using the GitHub GraphQL API.
 * It requires a GitHub token with 'project' access scope.
 * 
 * Usage:
 * ```
 * cd .claude/scripts
 * node update-project-statuses.js
 * ```
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Project information
const PROJECT_ID = "PVT_kwHODHqkes4A4KTr";  // Turbo Modern Starter Implementation
const STATUS_FIELD_ID = "PVTSSF_lAHODHqkes4A4KTrzgtLOB4";  // Status field

// Status options with their IDs
const STATUS_OPTIONS = {
  "todo": "f75ad846",       // Todo
  "in_progress": "47fc9ee4", // In Progress
  "review": "a352001e",     // Pending Review
  "done": "98236657",       // Done
  "on_hold": "0888ff68"     // On Hold
};

// Item IDs and their desired statuses
const ITEMS_TO_UPDATE = {
  // Issue #61 (UI component library) - Work is done, PR is submitted
  "PVTI_lAHODHqkes4A4KTrzgZ_xhs": "done",
  
  // Issue #62 (i18n support) - Not started yet
  "PVTI_lAHODHqkes4A4KTrzgZ_xh4": "todo",
  
  // Issue #63 (Data sync) - Not started yet
  "PVTI_lAHODHqkes4A4KTrzgZ_xh8": "todo",
  
  // PR #64 (UI component library) - Waiting for review
  "PVTI_lAHODHqkes4A4KTrzgZ_xvM": "review",
  
  // Issue #65 (GitHub workflow) - Currently being worked on
  "PVTI_lAHODHqkes4A4KTrzgZ_x1M": "in_progress",
  
  // PR #66 (GitHub workflow guidelines) - Waiting for review
  "PVTI_lAHODHqkes4A4KTrzgZ_x1o": "review"
};

/**
 * Updates the status of a specific project item
 * @param {string} itemId - The ID of the project item
 * @param {string} statusOption - The status to set (must be a key in STATUS_OPTIONS)
 * @returns {boolean} - Whether the update was successful
 */
function updateStatus(itemId, statusOption) {
  const optionId = STATUS_OPTIONS[statusOption];
  console.log(`Updating item ${itemId} to status '${statusOption}' (option_id: ${optionId})...`);
  
  // Create GraphQL mutation
  const mutation = `
    mutation {
      updateProjectV2ItemFieldValue(
        input: {
          projectId: "${PROJECT_ID}"
          itemId: "${itemId}"
          fieldId: "${STATUS_FIELD_ID}"
          value: {
            singleSelectOptionId: "${optionId}"
          }
        }
      ) {
        projectV2Item {
          id
        }
      }
    }
  `;
  
  try {
    // Execute GraphQL query using GitHub CLI
    const command = `gh api graphql -f query='${mutation}'`;
    const result = execSync(command).toString();
    console.log("Status updated successfully");
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.stdout) {
      console.error(`Response: ${error.stdout.toString()}`);
    }
    return false;
  }
}

/**
 * Main function to update all project item statuses
 */
function main() {
  // Check if GitHub CLI is authenticated
  try {
    execSync('gh auth status');
  } catch (error) {
    console.error("Error: GitHub CLI is not authenticated.");
    console.error("Please login with: gh auth login");
    return;
  }
  
  let successCount = 0;
  let failureCount = 0;
  
  // Update each item status
  for (const [itemId, status] of Object.entries(ITEMS_TO_UPDATE)) {
    if (updateStatus(itemId, status)) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Small delay to avoid rate limiting
    const waitMs = 1000;
    const start = Date.now();
    while (Date.now() - start < waitMs) {}
  }
  
  console.log(`\nSummary: ${successCount} items updated successfully, ${failureCount} failures`);
}

// Run the script
main();