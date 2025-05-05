#!/usr/bin/env node

/**
 * quick-fix-project-board.js
 * 
 * A simpler script that uses the GitHub REST API to update closed items on the project board
 * to have the "Done" status. This script avoids the GraphQL API complexity.
 */

const { Octokit } = require('@octokit/rest');
require('dotenv').config();

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'CodingButterBot';
const REPO = 'turbo-modern-starter';

// Create Octokit instance
const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

/**
 * Gets all closed issues and PRs
 */
async function getClosedItems() {
  // Get closed issues
  const { data: closedIssues } = await octokit.issues.listForRepo({
    owner: OWNER,
    repo: REPO,
    state: 'closed',
    per_page: 100
  });
  
  console.log(`Found ${closedIssues.length} closed issues/PRs`);
  return closedIssues;
}

/**
 * Gets all project items
 */
async function getProjectItems() {
  try {
    // Use REST API to list projects
    const { data: projects } = await octokit.projects.listForRepo({
      owner: OWNER,
      repo: REPO
    });
    
    const project = projects.find(p => p.name === 'Turbo Modern Starter Implementation');
    if (!project) {
      throw new Error('Project not found');
    }
    
    console.log(`Found project: ${project.name} (${project.id})`);
    
    // Get project columns
    const { data: columns } = await octokit.projects.listColumns({
      project_id: project.id
    });
    
    console.log(`Found ${columns.length} columns`);
    
    // Find the "Done" column
    const doneColumn = columns.find(column => 
      column.name.toLowerCase() === 'done' || 
      column.name.toLowerCase() === 'completed'
    );
    
    if (!doneColumn) {
      throw new Error('Done column not found');
    }
    
    console.log(`Found Done column: ${doneColumn.name} (${doneColumn.id})`);
    
    // Get all cards for all columns
    let allCards = [];
    for (const column of columns) {
      const { data: cards } = await octokit.projects.listCards({
        column_id: column.id
      });
      
      allCards = allCards.concat(cards.map(card => ({
        ...card,
        column_name: column.name,
        column_id: column.id
      })));
    }
    
    console.log(`Found ${allCards.length} total cards`);
    
    return { 
      project,
      columns,
      doneColumn,
      cards: allCards
    };
  } catch (error) {
    console.error('Error fetching project data:', error.message);
    throw error;
  }
}

/**
 * Moves a card to the Done column
 */
async function moveCardToDone(card, doneColumnId) {
  try {
    await octokit.projects.moveCard({
      card_id: card.id,
      position: 'top',
      column_id: doneColumnId
    });
    
    return true;
  } catch (error) {
    console.error(`Error moving card ${card.id}:`, error.message);
    return false;
  }
}

/**
 * Extracts the issue number from a content URL
 */
function getIssueNumberFromUrl(url) {
  const match = url.match(/\/issues\/(\d+)$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  const prMatch = url.match(/\/pull\/(\d+)$/);
  if (prMatch) {
    return parseInt(prMatch[1], 10);
  }
  
  return null;
}

/**
 * Main function
 */
async function main() {
  try {
    // Get all closed issues and PRs
    console.log('Fetching closed issues and PRs...');
    const closedItems = await getClosedItems();
    
    // Get project data
    console.log('Fetching project data...');
    const { doneColumn, cards } = await getProjectItems();
    
    // Find cards that need to be moved
    const cardsToMove = [];
    
    for (const card of cards) {
      // Skip cards already in the Done column
      if (card.column_id === doneColumn.id) {
        continue;
      }
      
      // Skip cards without content
      if (!card.content_url) {
        continue;
      }
      
      // Get issue/PR number from URL
      const itemNumber = getIssueNumberFromUrl(card.content_url);
      if (!itemNumber) {
        continue;
      }
      
      // Check if this card is for a closed item
      const matchingItem = closedItems.find(item => item.number === itemNumber);
      if (matchingItem) {
        cardsToMove.push({
          card,
          item: matchingItem
        });
      }
    }
    
    console.log(`Found ${cardsToMove.length} cards to move to Done column`);
    
    // Move cards to Done column
    let successCount = 0;
    let errorCount = 0;
    
    for (const { card, item } of cardsToMove) {
      console.log(`Moving #${item.number}: ${item.title} to Done column`);
      const success = await moveCardToDone(card, doneColumn.id);
      
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }
    
    console.log('\nSummary:');
    console.log(`- Successfully moved ${successCount} cards to Done column`);
    console.log(`- Failed to move ${errorCount} cards`);
    
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

main();