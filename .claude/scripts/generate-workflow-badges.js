#!/usr/bin/env node

/**
 * generate-workflow-badges.js
 * 
 * Generates GitHub Actions workflow status badges to include in README.md.
 * This script outputs Markdown-formatted badge links for each workflow.
 * 
 * Usage:
 * node generate-workflow-badges.js [--output README.md]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const REPOSITORY = process.env.REPOSITORY || 'turbo-modern-starter';
const OWNER = process.env.ORGANIZATION || 'CodingButterBot';
const WORKFLOWS_DIR = path.join(process.cwd(), '.github', 'workflows');
const DEFAULT_OUTPUT = null; // Output to stdout by default

// Parse command-line arguments
const args = process.argv.slice(2);
let outputFile = DEFAULT_OUTPUT;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--output' && i + 1 < args.length) {
    outputFile = args[i + 1];
    i++;
  }
}

/**
 * Converts a filename to a workflow name
 */
function getWorkflowName(filename) {
  // Remove extension and replace hyphens with spaces
  const name = path.basename(filename, '.yml').replace(/-/g, ' ');
  // Capitalize first letter of each word
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generates a badge for a workflow
 */
function generateBadge(workflowName, filename) {
  const workflowPath = encodeURIComponent(filename);
  const prettyName = getWorkflowName(filename);
  
  return `[![${prettyName}](https://github.com/${OWNER}/${REPOSITORY}/workflows/${workflowName}/badge.svg)](https://github.com/${OWNER}/${REPOSITORY}/actions/workflows/${workflowPath})`;
}

/**
 * Main function
 */
function main() {
  try {
    // Read workflow files
    const files = fs.readdirSync(WORKFLOWS_DIR).filter(file => file.endsWith('.yml'));
    
    if (files.length === 0) {
      console.error('No workflow files found in', WORKFLOWS_DIR);
      process.exit(1);
    }
    
    // Generate badges
    const badges = [];
    badges.push('# Workflow Status\n');
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(WORKFLOWS_DIR, file), 'utf8');
      const nameMatch = content.match(/name:\s*(.+)/);
      const workflowName = nameMatch ? nameMatch[1].trim() : getWorkflowName(file);
      
      badges.push(generateBadge(workflowName, file));
    }
    
    const badgeOutput = badges.join('\n');
    
    // Output badges
    if (outputFile) {
      if (fs.existsSync(outputFile)) {
        // If the file exists, read it and insert/update the badges section
        let readmeContent = fs.readFileSync(outputFile, 'utf8');
        
        const badgeSection = /<!-- workflow-badges-start -->[\s\S]*?<!-- workflow-badges-end -->/;
        
        if (badgeSection.test(readmeContent)) {
          // Update existing badges section
          readmeContent = readmeContent.replace(
            badgeSection,
            `<!-- workflow-badges-start -->\n${badgeOutput}\n<!-- workflow-badges-end -->`
          );
        } else {
          // Add badges section after the first heading
          const firstHeadingMatch = readmeContent.match(/^# .+$/m);
          if (firstHeadingMatch) {
            const pos = firstHeadingMatch.index + firstHeadingMatch[0].length;
            readmeContent = 
              readmeContent.substring(0, pos) + 
              '\n\n<!-- workflow-badges-start -->\n' + 
              badgeOutput + 
              '\n<!-- workflow-badges-end -->\n\n' + 
              readmeContent.substring(pos);
          } else {
            // If no heading, add at the beginning
            readmeContent = 
              '<!-- workflow-badges-start -->\n' + 
              badgeOutput + 
              '\n<!-- workflow-badges-end -->\n\n' + 
              readmeContent;
          }
        }
        
        fs.writeFileSync(outputFile, readmeContent);
        console.log(`Updated badges in ${outputFile}`);
      } else {
        // If file doesn't exist, just write the badges
        fs.writeFileSync(outputFile, badgeOutput);
        console.log(`Generated badges to ${outputFile}`);
      }
    } else {
      // Output to stdout
      console.log(badgeOutput);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();