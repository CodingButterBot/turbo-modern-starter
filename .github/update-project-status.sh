#!/bin/bash
# Script to update GitHub project item statuses

# Project ID and field ID
PROJECT_ID="PVT_kwHODHqkes4A4KTr"
STATUS_FIELD_ID="PVTSSF_lAHODHqkes4A4KTrzgtLOB4"

# Status option IDs
TODO="f75ad846"       # Todo
IN_PROGRESS="47fc9ee4"  # In Progress
REVIEW="a352001e"     # Pending Review
DONE="98236657"       # Done
ON_HOLD="0888ff68"    # On Hold

# Update an item's status
update_status() {
  item_id=$1
  option_id=$2
  
  echo "Updating item $item_id to status option $option_id..."
  
  # Generate a mutation query
  mutation="mutation {
    updateProjectV2ItemFieldValue(
      input: {
        projectId: \"$PROJECT_ID\"
        itemId: \"$item_id\"
        fieldId: \"$STATUS_FIELD_ID\"
        value: {
          singleSelectOptionId: \"$option_id\"
        }
      }
    ) {
      projectV2Item {
        id
      }
    }
  }"
  
  # Escape the mutation for use with curl
  escaped_mutation=$(echo "$mutation" | sed 's/"/\\"/g' | tr -d '\n')
  
  # Send the GraphQL mutation
  curl -s -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Content-Type: application/json" \
    https://api.github.com/graphql \
    -d "{\"query\": \"$escaped_mutation\"}"
  
  echo -e "\nStatus updated\n"
}

# You need to set your GitHub token
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Please set the GITHUB_TOKEN environment variable"
  exit 1
fi

# Update item statuses - replace these with your actual item IDs
# Issue #61 (UI component library) - In Progress
update_status "PVTI_lAHODHqkes4A4KTrzgZ_xhs" "$IN_PROGRESS"

# PR #64 (UI component library implementation) - Pending Review
update_status "PVTI_lAHODHqkes4A4KTrzgZ_xvM" "$REVIEW"

# Issue #59 (Side panel) - In Progress
update_status "PVTI_lAHODHqkes4A4KTrzgZ_siQ" "$IN_PROGRESS"

# PR #60 (Side panel implementation) - Pending Review
update_status "PVTI_lAHODHqkes4A4KTrzgZ_tp0" "$REVIEW"

# Issue #62 (i18n support) - Todo
update_status "PVTI_lAHODHqkes4A4KTrzgZ_xh4" "$TODO"

# Issue #63 (Data sync) - Todo
update_status "PVTI_lAHODHqkes4A4KTrzgZ_xh8" "$TODO"

# Issue #65 (GitHub workflow) - In Progress
update_status "PVTI_lAHODHqkes4A4KTrzgZ_x1M" "$IN_PROGRESS"

# PR #66 (GitHub workflow guidelines) - Pending Review
update_status "PVTI_lAHODHqkes4A4KTrzgZ_x1o" "$REVIEW"

echo "All items updated"