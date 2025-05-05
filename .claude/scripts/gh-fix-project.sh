#!/bin/bash

# gh-fix-project.sh
# A script to fix project issues using the GitHub CLI

set -e

# Configuration
PROJECT_NUMBER=4
OWNER="CodingButterBot"
REPO="turbo-modern-starter"

echo "Fetching closed issues..."
CLOSED_ISSUES=$(gh issue list --repo "$OWNER/$REPO" --state closed --json number,title --limit 100)
CLOSED_ISSUE_COUNT=$(echo "$CLOSED_ISSUES" | jq '. | length')
echo "Found $CLOSED_ISSUE_COUNT closed issues"

echo "Fetching closed PRs..."
CLOSED_PRS=$(gh pr list --repo "$OWNER/$REPO" --state closed --json number,title --limit 100)
CLOSED_PR_COUNT=$(echo "$CLOSED_PRS" | jq '. | length')
echo "Found $CLOSED_PR_COUNT closed PRs"

echo "Fetching project items..."
PROJECT_ITEMS=$(gh api graphql -f query='
query($owner: String!, $number: Int!) {
  user(login: $owner) {
    projectV2(number: $number) {
      id
      items(first: 100) {
        nodes {
          id
          content {
            ... on Issue {
              number
              title
              closed
            }
            ... on PullRequest {
              number
              title
              closed
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
' -F owner="$OWNER" -F number=$PROJECT_NUMBER)

echo "Parsing project data..."
PROJECT_ID=$(echo "$PROJECT_ITEMS" | jq -r '.data.user.projectV2.id')
echo "Project ID: $PROJECT_ID"

# Extract the Status field ID and options
STATUS_FIELD=$(echo "$PROJECT_ITEMS" | jq -r '.data.user.projectV2.fields.nodes[] | select(.name == "Status")')
STATUS_FIELD_ID=$(echo "$STATUS_FIELD" | jq -r '.id')
echo "Status Field ID: $STATUS_FIELD_ID"

# Find the Done option ID
DONE_OPTION=$(echo "$STATUS_FIELD" | jq -r '.options[] | select(.name == "Done" or .name == "Completed")')
DONE_OPTION_ID=$(echo "$DONE_OPTION" | jq -r '.id')
DONE_OPTION_NAME=$(echo "$DONE_OPTION" | jq -r '.name')
echo "Done Option: $DONE_OPTION_NAME (ID: $DONE_OPTION_ID)"

# Process closed issues and PRs
echo "Processing project items..."
COUNT=0
FIXED=0

for ITEM in $(echo "$PROJECT_ITEMS" | jq -c '.data.organization.projectV2.items.nodes[]'); do
  ITEM_ID=$(echo "$ITEM" | jq -r '.id')
  CONTENT=$(echo "$ITEM" | jq '.content')
  
  if [ "$CONTENT" = "null" ]; then
    continue
  fi

  NUMBER=$(echo "$CONTENT" | jq -r '.number')
  TITLE=$(echo "$CONTENT" | jq -r '.title')
  IS_CLOSED=$(echo "$CONTENT" | jq -r '.closed')
  
  # Get current status
  CURRENT_STATUS=""
  FIELD_VALUES=$(echo "$ITEM" | jq '.fieldValues.nodes[]')
  if [ -n "$FIELD_VALUES" ]; then
    CURRENT_STATUS=$(echo "$FIELD_VALUES" | jq -r 'select(.field.name == "Status") | .name')
  fi
  
  # Process closed items that don't have "Done" status
  if [ "$IS_CLOSED" = "true" ] && [ "$CURRENT_STATUS" != "$DONE_OPTION_NAME" ]; then
    COUNT=$((COUNT+1))
    echo "Fixing item #$NUMBER: $TITLE (currently: $CURRENT_STATUS)"
    
    # Update the status to Done
    RESULT=$(gh api graphql -f query='
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: { 
          singleSelectOptionId: $optionId
        }
      }) {
        projectV2Item {
          id
        }
      }
    }
    ' -F projectId="$PROJECT_ID" -F itemId="$ITEM_ID" -F fieldId="$STATUS_FIELD_ID" -F optionId="$DONE_OPTION_ID")
    
    if echo "$RESULT" | grep -q "projectV2Item"; then
      echo "  Success!"
      FIXED=$((FIXED+1))
    else
      echo "  Failed: $RESULT"
    fi
  fi
done

echo ""
echo "Summary:"
echo "- Found $COUNT closed items with incorrect status"
echo "- Successfully fixed $FIXED items"

if [ $COUNT -eq 0 ]; then
  echo "All closed items already have Done status. Board is clean!"
fi