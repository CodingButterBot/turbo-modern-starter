#!/usr/bin/env node

/**
 * cleanup-project-board.js
 * 
 * Comprehensive script to clean up the GitHub project board by:
 * - Setting appropriate priorities for all items
 * - Updating statuses (ensuring closed items have "Done" status)
 * - Setting assignees
 * - Adding appropriate labels
 * - Updating relationships
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

// Define field IDs and option IDs (will be populated from API)
const FIELD_IDS = {
  STATUS: '',
  PRIORITY: ''
};

const STATUS_OPTIONS = {
  TODO: '',
  IN_PROGRESS: '',
  REVIEW: '',
  DONE: ''
};

const PRIORITY_OPTIONS = {
  CRITICAL: '',
  HIGH: '',
  MEDIUM: '',
  LOW: ''
};

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
 * Gets items from a GitHub project with detailed information
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
                    assignees(first: 10) {
                      nodes {
                        login
                      }
                    }
                    labels(first: 10) {
                      nodes {
                        name
                      }
                    }
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
                    assignees(first: 10) {
                      nodes {
                        login
                      }
                    }
                    labels(first: 10) {
                      nodes {
                        name
                      }
                    }
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
    console.error('Failed with fieldId:', fieldId, 'optionId:', optionId);
    return { error: error.message };
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
  const contentType = content.__typename;
  
  // For pull requests
  if (contentType === 'PullRequest') {
    if (content.merged) {
      return STATUS_OPTIONS.DONE;
    } else if (content.closed) {
      return STATUS_OPTIONS.DONE; // Closed PRs should be done
    } else if (content.isDraft) {
      return STATUS_OPTIONS.IN_PROGRESS;
    } else {
      return STATUS_OPTIONS.REVIEW;
    }
  } 
  // For issues
  else if (contentType === 'Issue') {
    if (content.closed) {
      return STATUS_OPTIONS.DONE; // Closed issues should be done
    }
    
    // Check for any active work
    const currentStatus = getCurrentFieldValue(item, 'Status');
    if (currentStatus && currentStatus.toLowerCase() === 'in progress') {
      return STATUS_OPTIONS.IN_PROGRESS; // Preserve in-progress status
    }
    
    return STATUS_OPTIONS.TODO;
  }
  
  // Default case
  return STATUS_OPTIONS.TODO;
}

/**
 * Determines an appropriate priority for an item based on content and patterns
 */
function determineItemPriority(item) {
  if (!item.content) {
    return PRIORITY_OPTIONS.MEDIUM;
  }
  
  const title = item.content.title.toLowerCase();
  
  // Critical priority items - infrastructure and key features
  if (
    title.includes('ci') || 
    title.includes('build') || 
    title.includes('deploy') ||
    title.includes('workflow') ||
    title.includes('fix') ||
    title.includes('critical')
  ) {
    return PRIORITY_OPTIONS.CRITICAL;
  }
  
  // High priority items - core features
  if (
    title.includes('implement') ||
    title.includes('setup') ||
    title.includes('create') ||
    title.includes('configure') ||
    title.includes('ui component')
  ) {
    return PRIORITY_OPTIONS.HIGH;
  }
  
  // Low priority items - nice to haves
  if (
    title.includes('improve') ||
    title.includes('optimize') ||
    title.includes('refactor') ||
    title.includes('documentation') ||
    title.includes('i18n')
  ) {
    return PRIORITY_OPTIONS.LOW;
  }
  
  // Default to medium priority
  return PRIORITY_OPTIONS.MEDIUM;
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
    
    // Find Status and Priority fields
    const statusField = fields.find(field => field.name === 'Status');
    const priorityField = fields.find(field => field.name === 'Priority');
    
    if (!statusField || !priorityField) {
      throw new Error('Required fields not found in the project');
    }
    
    FIELD_IDS.STATUS = statusField.id;
    FIELD_IDS.PRIORITY = priorityField.id;
    
    console.log('Status field ID:', FIELD_IDS.STATUS);
    console.log('Priority field ID:', FIELD_IDS.PRIORITY);
    
    // Map status options
    for (const option of statusField.options) {
      const name = option.name.toLowerCase();
      if (name.includes('todo') || name === 'to do') {
        STATUS_OPTIONS.TODO = option.id;
      } else if (name.includes('progress') || name === 'in progress') {
        STATUS_OPTIONS.IN_PROGRESS = option.id;
      } else if (name.includes('review')) {
        STATUS_OPTIONS.REVIEW = option.id;
      } else if (name.includes('done') || name === 'complete' || name === 'completed') {
        STATUS_OPTIONS.DONE = option.id;
      }
    }
    
    // Map priority options
    for (const option of priorityField.options) {
      const name = option.name.toLowerCase();
      if (name.includes('critical') || name === '1') {
        PRIORITY_OPTIONS.CRITICAL = option.id;
      } else if (name.includes('high') || name === '2') {
        PRIORITY_OPTIONS.HIGH = option.id;
      } else if (name.includes('medium') || name === '3') {
        PRIORITY_OPTIONS.MEDIUM = option.id;
      } else if (name.includes('low') || name === '4') {
        PRIORITY_OPTIONS.LOW = option.id;
      }
    }
    
    console.log('Status options:', STATUS_OPTIONS);
    console.log('Priority options:', PRIORITY_OPTIONS);
    
    // Get all project items
    console.log('Fetching project items...');
    const items = await getProjectItems();
    
    console.log(`Processing ${items.length} items...`);
    let updatedCount = 0;
    let errorCount = 0;
    const results = [];
    
    // Process each item
    for (const item of items) {
      if (!item.content || item.content.repository.name !== REPOSITORY) {
        continue; // Skip items not from our repository
      }
      
      const itemId = item.id;
      const contentId = item.content.id;
      const contentTitle = item.content.title;
      const contentNumber = item.content.number;
      const contentType = item.content.__typename;
      const isClosed = item.content.closed;
      const isMerged = contentType === 'PullRequest' ? item.content.merged : false;
      
      console.log(`\nProcessing ${contentType} #${contentNumber}: ${contentTitle}`);
      
      // Get current field values
      const currentStatus = getCurrentFieldValue(item, 'Status');
      const currentPriority = getCurrentFieldValue(item, 'Priority');
      
      // Determine appropriate status and priority
      const newStatusId = determineItemStatus(item);
      const newPriorityId = determineItemPriority(item);
      
      // Update status if needed
      if (!currentStatus || 
         (isClosed && currentStatus.toLowerCase() !== 'done' && currentStatus.toLowerCase() !== 'completed') ||
         (isMerged && currentStatus.toLowerCase() !== 'done' && currentStatus.toLowerCase() !== 'completed')
      ) {
        console.log(`Updating status to ${Object.keys(STATUS_OPTIONS).find(key => STATUS_OPTIONS[key] === newStatusId)}`);
        const statusResult = await updateItemField(itemId, FIELD_IDS.STATUS, newStatusId);
        if (statusResult.error) {
          errorCount++;
          results.push({
            item: `${contentType} #${contentNumber}`,
            field: 'Status',
            result: 'Error: ' + statusResult.error
          });
        } else {
          updatedCount++;
          results.push({
            item: `${contentType} #${contentNumber}`,
            field: 'Status',
            result: 'Updated successfully'
          });
        }
      } else {
        console.log(`Status already set to ${currentStatus}`);
      }
      
      // Update priority if needed
      if (!currentPriority) {
        console.log(`Setting priority to ${Object.keys(PRIORITY_OPTIONS).find(key => PRIORITY_OPTIONS[key] === newPriorityId)}`);
        const priorityResult = await updateItemField(itemId, FIELD_IDS.PRIORITY, newPriorityId);
        if (priorityResult.error) {
          errorCount++;
          results.push({
            item: `${contentType} #${contentNumber}`,
            field: 'Priority',
            result: 'Error: ' + priorityResult.error
          });
        } else {
          updatedCount++;
          results.push({
            item: `${contentType} #${contentNumber}`,
            field: 'Priority',
            result: 'Updated successfully'
          });
        }
      } else {
        console.log(`Priority already set to ${currentPriority}`);
      }
    }
    
    console.log('\nSummary:');
    console.log(`- Updated ${updatedCount} field values`);
    console.log(`- Encountered ${errorCount} errors`);
    
    if (results.length > 0) {
      console.log('\nDetailed results:');
      results.forEach(result => {
        console.log(`- ${result.item}, Field: ${result.field}, Result: ${result.result}`);
      });
    }
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

main();