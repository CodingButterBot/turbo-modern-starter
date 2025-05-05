#!/usr/bin/env node

/**
 * verify-project-statuses.js
 * 
 * Verifies the status of GitHub project items and reports inconsistencies.
 * This script helps ensure that project items have appropriate statuses based on their state.
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
                    url
                  }
                  ... on PullRequest {
                    title
                    number
                    state
                    isDraft
                    repository {
                      name
                    }
                    url
                  }
                }
                fieldValues(first: 8) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
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

    return organization.projectV2;
  } catch (error) {
    console.error('Error fetching project items:', error.message);
    throw error;
  }
}

/**
 * Determines the expected status for an item based on its content
 */
function determineExpectedStatus(item) {
  const content = item.content;
  
  // For pull requests
  if (content && content.__typename === 'PullRequest') {
    if (content.state === 'MERGED' || content.state === 'CLOSED') {
      return 'Done';
    } else if (content.isDraft) {
      return 'In Progress';
    } else {
      return 'Review';
    }
  } 
  // For issues
  else if (content && content.__typename === 'Issue') {
    if (content.state === 'CLOSED') {
      return 'Done';
    }
    
    // By default, open issues are Todo
    return 'Todo';
  }
  
  // Default case
  return 'Todo';
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Fetching project items...');
    const project = await getProjectItems();
    
    // Process each item
    const items = project.items.nodes;
    let inconsistentItems = [];
    
    for (const item of items) {
      if (!item.content || item.content.repository.name !== REPOSITORY) {
        continue; // Skip items not from our repository
      }
      
      // Get the current status if it exists
      const statusValue = item.fieldValues.nodes.find(value => 
        value.field && value.field.name === 'Status'
      );
      const currentStatus = statusValue ? statusValue.name : null;
      
      // Determine the expected status
      const expectedStatus = determineExpectedStatus(item);
      
      // Check for inconsistency
      if (!currentStatus) {
        inconsistentItems.push({
          title: item.content.title,
          number: item.content.number,
          url: item.content.url,
          currentStatus: 'Not set',
          expectedStatus,
          type: item.content.__typename
        });
      } else if (currentStatus.toLowerCase() !== expectedStatus.toLowerCase()) {
        inconsistentItems.push({
          title: item.content.title,
          number: item.content.number,
          url: item.content.url,
          currentStatus,
          expectedStatus,
          type: item.content.__typename
        });
      }
    }
    
    // Report inconsistencies
    if (inconsistentItems.length > 0) {
      console.log('\nFound inconsistent status values for the following items:');
      for (const item of inconsistentItems) {
        console.log(`\n${item.type} #${item.number}: ${item.title}`);
        console.log(`URL: ${item.url}`);
        console.log(`Current Status: ${item.currentStatus}`);
        console.log(`Expected Status: ${item.expectedStatus}`);
      }
      console.log(`\nTotal inconsistencies found: ${inconsistentItems.length}`);
    } else {
      console.log('All items have consistent status values. Great job!');
    }
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

main();