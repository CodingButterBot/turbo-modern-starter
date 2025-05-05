#!/usr/bin/env node
/**
 * GitHub Project Status Verifier
 * 
 * This script checks the status values of GitHub project items and reports any inconsistencies.
 * It queries the GitHub GraphQL API to get current status values and compares with expected values.
 * 
 * Usage:
 * ```
 * cd .claude/scripts
 * node verify-project-statuses.js
 * ```
 */

const { execSync } = require('child_process');

// Project information
const PROJECT_ID = "PVT_kwHODHqkes4A4KTr";  // Turbo Modern Starter Implementation
const STATUS_FIELD_ID = "PVTSSF_lAHODHqkes4A4KTrzgtLOB4";  // Status field

// Status options with their IDs and display names
const STATUS_OPTIONS = {
  "todo": { id: "f75ad846", name: "Todo" },
  "in_progress": { id: "47fc9ee4", name: "In Progress" },
  "review": { id: "a352001e", name: "Pending Review" },
  "done": { id: "98236657", name: "Done" },
  "on_hold": { id: "0888ff68", name: "On Hold" }
};

// Items to verify with their expected statuses
// This can be updated manually or generated based on repository state
const ITEMS_TO_VERIFY = {
  "#61 (Issue)": { 
    id: "PVTI_lAHODHqkes4A4KTrzgZ_xhs", 
    expected: "done",
    title: "Implement extension UI component library"
  },
  "#62 (Issue)": { 
    id: "PVTI_lAHODHqkes4A4KTrzgZ_xh4", 
    expected: "todo",
    title: "Add i18n support to browser extension"
  },
  "#63 (Issue)": { 
    id: "PVTI_lAHODHqkes4A4KTrzgZ_xh8", 
    expected: "todo",
    title: "Implement extension data synchronization"
  },
  "#64 (PR)": { 
    id: "PVTI_lAHODHqkes4A4KTrzgZ_xvM", 
    expected: "review",
    title: "Implement extension UI component library"
  },
  "#65 (Issue)": { 
    id: "PVTI_lAHODHqkes4A4KTrzgZ_x1M", 
    expected: "in_progress",
    title: "Standardize GitHub project workflow"
  },
  "#66 (PR)": { 
    id: "PVTI_lAHODHqkes4A4KTrzgZ_x1o", 
    expected: "review",
    title: "Add GitHub project workflow guidelines"
  }
};

/**
 * Get the current status of a project item from GitHub
 * @param {string} itemId - The ID of the project item
 * @returns {Promise<object>} - The status information { status: string, statusId: string }
 */
async function getItemStatus(itemId) {
  // GraphQL query to get item status
  const query = `
    query {
      node(id: "${itemId}") {
        ... on ProjectV2Item {
          id
          fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
              optionId
            }
          }
        }
      }
    }
  `;
  
  try {
    // Execute GraphQL query using GitHub CLI
    const command = `gh api graphql -f query='${query}'`;
    const result = execSync(command).toString();
    const data = JSON.parse(result);
    
    // Check if the status field is set
    if (data?.data?.node?.fieldValueByName) {
      return {
        status: data.data.node.fieldValueByName.name,
        statusId: data.data.node.fieldValueByName.optionId
      };
    } else {
      return { status: "Not set", statusId: null };
    }
  } catch (error) {
    console.error(`Error fetching status for item ${itemId}: ${error.message}`);
    return { status: "Error", statusId: null };
  }
}

/**
 * Get the expected status name from the key
 * @param {string} statusKey - The status key (e.g., "todo", "in_progress")
 * @returns {string} - The status display name
 */
function getStatusName(statusKey) {
  return STATUS_OPTIONS[statusKey]?.name || statusKey;
}

/**
 * Verify the status of a single item
 * @param {string} label - The display label for the item
 * @param {object} itemData - The item data with ID and expected status
 * @returns {Promise<object>} - Verification result
 */
async function verifyItem(label, itemData) {
  const { id, expected, title } = itemData;
  const currentStatus = await getItemStatus(id);
  
  const expectedName = getStatusName(expected);
  const isConsistent = currentStatus.status === expectedName;
  
  return {
    label,
    title,
    expected: expectedName,
    current: currentStatus.status,
    isConsistent
  };
}

/**
 * Main function to verify all project item statuses
 */
async function main() {
  console.log("\nGitHub Project Status Verifier\n");
  
  // Check if GitHub CLI is authenticated
  try {
    execSync('gh auth status');
  } catch (error) {
    console.error("Error: GitHub CLI is not authenticated.");
    console.error("Please login with: gh auth login");
    return;
  }
  
  console.log("Verifying project item statuses...\n");
  
  // Verify each item
  const results = [];
  let inconsistentCount = 0;
  
  for (const [label, itemData] of Object.entries(ITEMS_TO_VERIFY)) {
    const result = await verifyItem(label, itemData);
    results.push(result);
    
    if (!result.isConsistent) {
      inconsistentCount++;
    }
  }
  
  // Display results in a table
  console.log("Status Verification Results:");
  console.log("─".repeat(80));
  console.log(
    [
      "Item".padEnd(15),
      "Title".padEnd(35),
      "Expected".padEnd(15),
      "Current".padEnd(15)
    ].join("")
  );
  console.log("─".repeat(80));
  
  for (const result of results) {
    const statusIndicator = result.isConsistent ? "✓" : "✗";
    console.log(
      [
        `${result.label} ${statusIndicator}`.padEnd(15),
        (result.title || "").slice(0, 32).padEnd(35),
        result.expected.padEnd(15),
        result.current.padEnd(15)
      ].join("")
    );
  }
  
  console.log("─".repeat(80));
  
  // Summary
  console.log("\nSummary:");
  console.log(`Total items checked: ${results.length}`);
  console.log(`Consistent statuses: ${results.length - inconsistentCount}`);
  
  if (inconsistentCount > 0) {
    console.log(`Inconsistent statuses: ${inconsistentCount}`);
    console.log("\nTo fix inconsistent statuses, run:");
    console.log("node .claude/scripts/update-project-statuses.js");
  } else {
    console.log("\nAll item statuses are consistent!");
  }
}

// Run the script
main().catch(error => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});