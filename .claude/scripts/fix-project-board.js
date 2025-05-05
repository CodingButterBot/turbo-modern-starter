#!/usr/bin/env node

/**
 * fix-project-board.js
 * 
 * Direct fix for project board issues, forcing all closed items to Done status.
 * This script specifically targets the problem of closed items appearing in wrong columns.
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
const ORGANIZATION = process.env.ORGANIZATION || 'CodingButterBot';
const REPOSITORY = process.env.REPOSITORY || 'turbo-modern-starter';

// GraphQL client with authentication
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GITHUB_TOKEN}`,
  },
});

/**
 * Gets project field information to identify status and priority fields and their options
 */
async function getProjectFields() {
  try {
    const { organization } = await graphqlWithAuth(`
      query {
        organization(login: "${ORGANIZATION}") {
          projectV2(number: ${PROJECT_ID.split('_').pop()}) {
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
                ... on ProjectV2Field {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `);

    return organization.projectV2.fields.nodes;
  } catch (error) {
    console.error('Error fetching project fields:', error.message);
    throw error;
  }
}

/**
 * Gets all items from the project with detailed information
 */
async function getProjectItems() {
  try {
    const { organization } = await graphqlWithAuth(`
      query {
        organization(login: "${ORGANIZATION}") {
          projectV2(number: ${PROJECT_ID.split('_').pop()}) {
            id
            items(first: 100) {
              nodes {
                id
                content {
                  ... on Issue {
                    id
                    title
                    number
                    state
                    closed
                    repository {
                      name
                    }
                    url
                  }
                  ... on PullRequest {
                    id
                    title
                    number
                    state
                    closed
                    merged
                    isDraft
                    repository {
                      name
                    }
                    url
                  }
                }
                fieldValues(first: 10) {
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

    return organization.projectV2.items.nodes;
  } catch (error) {
    console.error('Error fetching project items:', error.message);
    throw error;
  }
}

/**
 * Updates a field value for a project item
 */
async function updateItemField(itemId, fieldId, optionId) {
  try {
    const result = await graphqlWithAuth(`
      mutation {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: "${PROJECT_ID}"
            itemId: "${itemId}"
            fieldId: "${fieldId}"
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
    return { error: error.message };
  }
}

/**
 * Determines the status ID to use based on item state
 */
function getStatusIdForItem(item, statusOptions, doneStatusId) {
  if (!item.content) {
    return null;
  }

  const isClosed = item.content.closed;
  const isMerged = item.content.merged;
  
  // Force closed or merged items to Done status
  if (isClosed || isMerged) {
    return doneStatusId;
  }
  
  // For open items, keep current status if present
  const currentStatus = getCurrentFieldValue(item, 'Status');
  if (currentStatus) {
    const matchingOption = statusOptions.find(o => 
      o.name.toLowerCase() === currentStatus.toLowerCase()
    );
    if (matchingOption) {
      return matchingOption.id;
    }
  }
  
  // Default open items to Todo
  const todoOption = statusOptions.find(o => 
    o.name.toLowerCase() === 'todo' || o.name.toLowerCase() === 'to do'
  );
  return todoOption ? todoOption.id : null;
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
    
    // Find Status field and its options
    const statusField = fields.find(field => field.name === 'Status');
    if (!statusField) {
      throw new Error('Status field not found in the project');
    }
    
    const statusOptions = statusField.options || [];
    console.log('Status field ID:', statusField.id);
    console.log('Status options:', statusOptions.map(o => `${o.name}: ${o.id}`).join(', '));
    
    // Find Done status option
    const doneOption = statusOptions.find(o => 
      o.name.toLowerCase() === 'done' || o.name.toLowerCase() === 'completed'
    );
    if (!doneOption) {
      throw new Error('Done status option not found');
    }
    console.log('Done status ID:', doneOption.id);
    
    // Get all project items
    console.log('Fetching project items...');
    const items = await getProjectItems();
    
    // Filter items from our repository
    const repoItems = items.filter(item => 
      item.content && item.content.repository.name === REPOSITORY
    );
    
    console.log(`Found ${repoItems.length} items from ${REPOSITORY}`);
    
    // Find all closed items with wrong status
    const closedItemsWithWrongStatus = repoItems.filter(item => {
      if (!item.content) return false;
      
      const isClosed = item.content.closed;
      const isMerged = item.content.merged;
      const currentStatus = getCurrentFieldValue(item, 'Status');
      
      return (isClosed || isMerged) && 
             (!currentStatus || currentStatus.toLowerCase() !== 'done');
    });
    
    console.log(`Found ${closedItemsWithWrongStatus.length} closed items with wrong status`);
    
    // Update all items to ensure correct status
    console.log('\nUpdating items...');
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const item of repoItems) {
      const itemId = item.id;
      const contentType = item.content ? item.content.__typename : 'Unknown';
      const contentNumber = item.content ? item.content.number : 'N/A';
      const contentTitle = item.content ? item.content.title : 'Unknown';
      
      // Determine appropriate status
      const statusId = getStatusIdForItem(item, statusOptions, doneOption.id);
      if (!statusId) {
        console.log(`Skipping ${contentType} #${contentNumber}: Could not determine appropriate status`);
        continue;
      }
      
      // Always update status to ensure consistency
      console.log(`Updating ${contentType} #${contentNumber}: "${contentTitle}"`);
      const result = await updateItemField(itemId, statusField.id, statusId);
      
      if (result.error) {
        console.error(`  Error: ${result.error}`);
        errorCount++;
      } else {
        console.log(`  Success: Updated status`);
        updatedCount++;
      }
    }
    
    console.log('\nSummary:');
    console.log(`- Updated ${updatedCount} items`);
    console.log(`- Encountered ${errorCount} errors`);
    console.log(`- Found ${closedItemsWithWrongStatus.length} closed items with incorrect status`);
    
    if (closedItemsWithWrongStatus.length > 0) {
      console.log('\nClosed items that had incorrect status:');
      closedItemsWithWrongStatus.forEach(item => {
        const contentType = item.content.__typename;
        const contentNumber = item.content.number;
        const contentTitle = item.content.title;
        const currentStatus = getCurrentFieldValue(item, 'Status') || 'None';
        
        console.log(`- ${contentType} #${contentNumber}: "${contentTitle}" (Current status: ${currentStatus})`);
      });
    }
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

main();