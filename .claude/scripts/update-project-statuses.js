#!/usr/bin/env node

/**
 * update-project-statuses.js
 * 
 * Automatically updates GitHub project item statuses based on predefined mappings.
 * This script uses the GitHub GraphQL API to update project items.
 * 
 * Environment variables:
 * - GITHUB_TOKEN: Personal access token with project access
 * - PROJECT_ID: ID of the GitHub project
 * - ORGANIZATION: GitHub organization name
 * - REPOSITORY: GitHub repository name
 */

const { graphql } = require('@octokit/graphql');
require('dotenv').config();

// Configuration
const PROJECT_ID = process.env.PROJECT_ID || 'PVT_kwHODHqkes4A4KTr';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.ORGANIZATION || 'CodingButterBot';
const REPOSITORY = process.env.REPOSITORY || 'turbo-modern-starter';

// Status field ID - will be populated from the API
let STATUS_FIELD_ID = 'PVTSSF_lAHODHqkes4A4KTrzgtLOB4';

// Status option IDs - will be populated from the API
const STATUS_OPTIONS = {
  TODO: 'f75ad846',      // Todo status ID
  IN_PROGRESS: '47fc9ee4', // In Progress status ID
  REVIEW: 'a352001e',    // Pending Review status ID
  DONE: '98236657'       // Done status ID
};

// GraphQL client with authentication
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GITHUB_TOKEN}`,
  },
});

/**
 * Gets project field information to find status field and options
 */
async function getProjectFields() {
  try {
    const { user } = await graphqlWithAuth(`
      query {
        user(login: "${OWNER}") {
          projectV2(number: 4) {
            id
            fields(first: 20) {
              nodes {
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  options {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `);

    return user.projectV2.fields.nodes;
  } catch (error) {
    console.error('Error fetching project fields:', error.message);
    throw error;
  }
}

/**
 * Gets items from a GitHub project
 */
async function getProjectItems() {
  try {
    const { user } = await graphqlWithAuth(`
      query {
        user(login: "${OWNER}") {
          projectV2(number: 4) {
            id
            items(first: 100) {
              nodes {
                id
                content {
                  ... on Issue {
                    title
                    number
                    state
                    closed
                    repository {
                      name
                    }
                  }
                  ... on PullRequest {
                    title
                    number
                    state
                    isDraft
                    closed
                    merged
                    repository {
                      name
                    }
                  }
                }
                fieldValues(first: 8) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `);

    return user.projectV2.items.nodes;
  } catch (error) {
    console.error('Error fetching project items:', error.message);
    throw error;
  }
}

/**
 * Updates the status of a project item
 */
async function updateItemStatus(itemId, optionId) {
  try {
    const result = await graphqlWithAuth(`
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
    `);

    return result;
  } catch (error) {
    console.error(`Error updating item ${itemId}:`, error.message);
    throw error;
  }
}

/**
 * Determines the appropriate status for an item based on its content
 */
function determineItemStatus(item) {
  if (!item.content) {
    return STATUS_OPTIONS.TODO;
  }

  const content = item.content;
  
  // For pull requests
  if (content.__typename === 'PullRequest') {
    if (content.merged) {
      return STATUS_OPTIONS.DONE;
    } else if (content.closed) {
      return STATUS_OPTIONS.DONE; // Closed PRs should also be Done
    } else if (content.isDraft) {
      return STATUS_OPTIONS.IN_PROGRESS;
    } else {
      return STATUS_OPTIONS.REVIEW; // Open, non-draft PRs are in review
    }
  } 
  // For issues
  else if (content.__typename === 'Issue') {
    if (content.closed) {
      return STATUS_OPTIONS.DONE;
    }
    
    // Check for any current status to preserve it if it's more advanced
    const currentStatus = getCurrentFieldValue(item, 'Status');
    
    if (currentStatus) {
      // If it's already in review or in progress, preserve that status
      if (currentStatus.toLowerCase() === 'in progress') {
        return STATUS_OPTIONS.IN_PROGRESS;
      } else if (currentStatus.toLowerCase().includes('review')) {
        return STATUS_OPTIONS.REVIEW;
      }
    }
    
    // By default, open issues are Todo
    return STATUS_OPTIONS.TODO;
  }
  
  // Default case
  return STATUS_OPTIONS.TODO;
}

/**
 * Gets the current value of a field for an item
 */
function getCurrentFieldValue(item, fieldName) {
  const fieldValue = item.fieldValues.nodes.find(node => 
    node.field && node.field.name === fieldName
  );
  return fieldValue ? fieldValue.name : null;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Fetching project fields...');
    const fields = await getProjectFields();
    
    // Find Status field and map options
    const statusField = fields.find(field => field.name === 'Status');
    if (!statusField) {
      throw new Error('Status field not found in the project');
    }
    
    STATUS_FIELD_ID = statusField.id;
    console.log('Status field found:', STATUS_FIELD_ID);
    
    // Map status options
    for (const option of statusField.options) {
      const name = option.name.toLowerCase();
      if (name === 'todo') {
        STATUS_OPTIONS.TODO = option.id;
      } else if (name === 'in progress') {
        STATUS_OPTIONS.IN_PROGRESS = option.id;
      } else if (name.includes('review') || name === 'pending review') {
        STATUS_OPTIONS.REVIEW = option.id;
      } else if (name === 'done') {
        STATUS_OPTIONS.DONE = option.id;
      }
    }
    
    console.log('Status options mapped:', STATUS_OPTIONS);
    
    // Get all project items
    console.log('Fetching project items...');
    const items = await getProjectItems();
    
    console.log(`Found ${items.length} items in the project`);
    
    // Process each item
    let updatedCount = 0;
    
    for (const item of items) {
      if (!item.content || item.content.repository.name !== REPOSITORY) {
        continue; // Skip items not from our repository
      }
      
      const itemId = item.id;
      const content = item.content;
      const contentTitle = content.title;
      const contentNumber = content.number;
      const contentType = content.__typename || (content.repository ? 'Issue' : 'Unknown');
      
      console.log(`Processing ${contentType} #${contentNumber}: ${contentTitle}`);
      
      // Get current status
      const currentStatus = getCurrentFieldValue(item, 'Status');
      console.log(`  Current status: ${currentStatus || 'Not set'}`);
      
      // Determine appropriate status
      const newStatusId = determineItemStatus(item);
      
      // Convert IDs back to names for logging
      const newStatusName = Object.keys(STATUS_OPTIONS).find(key => 
        STATUS_OPTIONS[key] === newStatusId
      );
      
      console.log(`  Appropriate status: ${newStatusName}`);
      
      // Check if status needs to be updated
      const currentStatusId = statusField.options.find(o => 
        o.name === currentStatus
      )?.id;
      
      if (currentStatusId !== newStatusId) {
        console.log(`  Updating status to ${newStatusName}...`);
        await updateItemStatus(itemId, newStatusId);
        updatedCount++;
      } else {
        console.log(`  Status already correct`);
      }
    }
    
    console.log(`Updated ${updatedCount} items`);
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

main();