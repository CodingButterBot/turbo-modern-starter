#!/usr/bin/env node

/**
 * update-project-priorities.js
 * 
 * Updates GitHub project item priorities and statuses based on predefined mappings.
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

// GraphQL client with authentication
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${GITHUB_TOKEN}`,
  },
});

// Define items to update with their priorities and statuses
// These IDs need to be updated with your actual project item IDs
const ITEMS_TO_UPDATE = [
  // Infrastructure - Critical 
  {
    id: "PVTI_lAHODHqkes4A4KTrzgZ_xhs", // UI Component Library (Issue #61)
    priority: "high",  
    status: "done"
  },
  {
    id: "PVTI_lAHODHqkes4A4KTrzgZ_xh4", // i18n Support (Issue #62)
    priority: "medium",
    status: "todo"
  },
  {
    id: "PVTI_lAHODHqkes4A4KTrzgZ_xht", // Extension Data Synchronization (Issue #63)
    priority: "medium",
    status: "todo"
  },
  {
    id: "PVTI_lAHODHqkes4A4KTrzgZ_xhu", // GitHub Actions CI/CD (Issue #64)
    priority: "critical",
    status: "in_progress"
  },
  {
    id: "PVTI_lAHODHqkes4A4KTrzgZ_xhv", // Comprehensive Testing (Issue #65)
    priority: "high",
    status: "todo"
  },
  {
    id: "PVTI_lAHODHqkes4A4KTrzgZ_xhw", // Performance Optimizations (Issue #66)
    priority: "medium",
    status: "todo"
  }
];

/**
 * Gets project field information
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
 * Updates the status of a project item
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
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Fetching project fields...');
    const fields = await getProjectFields();
    
    // Find the Status and Priority fields
    const statusField = fields.find(field => field.name === 'Status');
    const priorityField = fields.find(field => field.name === 'Priority');
    
    if (!statusField) {
      throw new Error('Status field not found in the project');
    }
    
    if (!priorityField) {
      throw new Error('Priority field not found in the project');
    }
    
    console.log('Status field found:', statusField.id);
    console.log('Priority field found:', priorityField.id);
    
    // Map status and priority options
    const statusOptions = {};
    const priorityOptions = {};
    
    for (const option of statusField.options) {
      statusOptions[option.name.toLowerCase()] = option.id;
    }
    
    for (const option of priorityField.options) {
      priorityOptions[option.name.toLowerCase()] = option.id;
    }
    
    console.log('Status options:', statusOptions);
    console.log('Priority options:', priorityOptions);
    
    // Update items
    let updatedCount = 0;
    
    for (const item of ITEMS_TO_UPDATE) {
      console.log(`Processing item: ${item.id}`);
      
      // Update status if provided
      if (item.status) {
        const statusId = statusOptions[item.status.toLowerCase()];
        if (!statusId) {
          console.error(`Status "${item.status}" not found in project options`);
          continue;
        }
        
        console.log(`Updating status to "${item.status}"`);
        await updateItemField(item.id, statusField.id, statusId);
      }
      
      // Update priority if provided
      if (item.priority) {
        const priorityId = priorityOptions[item.priority.toLowerCase()];
        if (!priorityId) {
          console.error(`Priority "${item.priority}" not found in project options`);
          continue;
        }
        
        console.log(`Updating priority to "${item.priority}"`);
        await updateItemField(item.id, priorityField.id, priorityId);
      }
      
      updatedCount++;
    }
    
    console.log(`Successfully updated ${updatedCount} items`);
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

main();