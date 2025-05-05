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
const ORGANIZATION = process.env.ORGANIZATION || 'CodingButterBot';
const REPOSITORY = process.env.REPOSITORY || 'turbo-modern-starter';

// Status option IDs - these need to be updated with your actual project's status field option IDs
const STATUS_OPTIONS = {
  TODO: '47fc9ee4',      // Todo status ID
  IN_PROGRESS: 'f75ad846', // In Progress status ID
  DONE: '98236657',      // Done status ID
  REVIEW: '47fc9ee5'     // Review status ID
};

// GraphQL client with authentication
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GITHUB_TOKEN}`,
  },
});

/**
 * Gets items from a GitHub project
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
                    title
                    number
                    state
                    repository {
                      name
                    }
                  }
                  ... on PullRequest {
                    title
                    number
                    state
                    isDraft
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

    return organization.projectV2;
  } catch (error) {
    console.error('Error fetching project items:', error.message);
    throw error;
  }
}

/**
 * Updates the status of a project item
 */
async function updateItemStatus(itemId, statusFieldId, optionId) {
  try {
    const result = await graphqlWithAuth(`
      mutation {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: "${PROJECT_ID}"
            itemId: "${itemId}"
            fieldId: "${statusFieldId}"
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
  const content = item.content;
  
  // For pull requests
  if (content && content.__typename === 'PullRequest') {
    if (content.state === 'MERGED' || content.state === 'CLOSED') {
      return STATUS_OPTIONS.DONE;
    } else if (content.isDraft) {
      return STATUS_OPTIONS.IN_PROGRESS;
    } else {
      return STATUS_OPTIONS.REVIEW;
    }
  } 
  // For issues
  else if (content && content.__typename === 'Issue') {
    if (content.state === 'CLOSED') {
      return STATUS_OPTIONS.DONE;
    }
    
    // Check if any PR references this issue
    // This would require additional API calls - for simplicity, we'll leave issues as TODO
    // unless they're closed
    return STATUS_OPTIONS.TODO;
  }
  
  // Default case
  return STATUS_OPTIONS.TODO;
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Fetching project items...');
    const project = await getProjectItems();
    
    // Find the Status field
    const statusField = project.fields.nodes.find(field => field.name === 'Status');
    if (!statusField) {
      throw new Error('Status field not found in the project');
    }
    
    console.log('Status field found:', statusField.id);
    
    // Map the status options from the project
    for (const option of statusField.options) {
      switch (option.name.toLowerCase()) {
        case 'todo':
          STATUS_OPTIONS.TODO = option.id;
          break;
        case 'in progress':
          STATUS_OPTIONS.IN_PROGRESS = option.id;
          break;
        case 'done':
          STATUS_OPTIONS.DONE = option.id;
          break;
        case 'review':
          STATUS_OPTIONS.REVIEW = option.id;
          break;
      }
    }
    
    console.log('Status options mapped:', STATUS_OPTIONS);
    
    // Process each item
    const items = project.items.nodes;
    let updatedCount = 0;
    
    for (const item of items) {
      if (!item.content || item.content.repository.name !== REPOSITORY) {
        continue; // Skip items not from our repository
      }
      
      console.log(`Processing item: ${item.content.title} (#${item.content.number})`);
      
      // Get the current status if it exists
      const statusValue = item.fieldValues.nodes.find(value => 
        value.field && value.field.name === 'Status'
      );
      const currentStatus = statusValue ? statusValue.name : null;
      
      // Determine the appropriate status
      const newStatusId = determineItemStatus(item);
      
      // Update if status is different or not set
      if (!currentStatus) {
        console.log(`Setting status for item #${item.content.number}`);
        await updateItemStatus(item.id, statusField.id, newStatusId);
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} items`);
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

main();