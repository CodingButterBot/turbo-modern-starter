#!/usr/bin/env python3
"""
Script to update GitHub project item statuses.
You need to have a GitHub token with project write access.
Set it as an environment variable GITHUB_TOKEN before running.
"""

import os
import json
import subprocess
import time

# Project information
PROJECT_ID = "PVT_kwHODHqkes4A4KTr"  # Turbo Modern Starter Implementation
STATUS_FIELD_ID = "PVTSSF_lAHODHqkes4A4KTrzgtLOB4"  # Status field

# Status options
STATUS_OPTIONS = {
    "todo": "f75ad846",       # Todo
    "in_progress": "47fc9ee4", # In Progress
    "review": "a352001e",     # Pending Review
    "done": "98236657",       # Done
    "on_hold": "0888ff68"     # On Hold
}

# Item IDs and desired statuses
ITEMS_TO_UPDATE = {
    # Issue #61 (UI component library)
    "PVTI_lAHODHqkes4A4KTrzgZ_xhs": "in_progress",
    
    # Issue #62 (i18n support)
    "PVTI_lAHODHqkes4A4KTrzgZ_xh4": "todo",
    
    # Issue #63 (Data sync)
    "PVTI_lAHODHqkes4A4KTrzgZ_xh8": "todo",
    
    # PR #64 (UI component library)
    "PVTI_lAHODHqkes4A4KTrzgZ_xvM": "review",
    
    # Issue #65 (GitHub workflow)
    "PVTI_lAHODHqkes4A4KTrzgZ_x1M": "in_progress",
    
    # PR #66 (GitHub workflow guidelines)
    "PVTI_lAHODHqkes4A4KTrzgZ_x1o": "review",
    
    # PR #67 (GitHub project automation)
    "PVTI_lAHODHqkes4A4KTrzgZ_yQc": "review"
}

def update_status(item_id, status_option):
    """Update the status of a project item."""
    option_id = STATUS_OPTIONS[status_option]
    print(f"Updating item {item_id} to status '{status_option}' (option_id: {option_id})...")
    
    # GraphQL mutation
    mutation = f"""
    mutation {{
      updateProjectV2ItemFieldValue(
        input: {{
          projectId: "{PROJECT_ID}"
          itemId: "{item_id}"
          fieldId: "{STATUS_FIELD_ID}"
          value: {{
            singleSelectOptionId: "{option_id}"
          }}
        }}
      ) {{
        projectV2Item {{
          id
        }}
      }}
    }}
    """
    
    # Execute GraphQL query
    command = ["gh", "api", "graphql", "-f", f"query={mutation}"]
    result = subprocess.run(command, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        print(f"Response: {result.stdout}")
        return False
    
    print("Status updated successfully")
    return True

def main():
    """Main function to update all project item statuses."""
    if "GITHUB_TOKEN" not in os.environ:
        print("Error: GITHUB_TOKEN environment variable not set")
        print("Please set it with: export GITHUB_TOKEN=your_token")
        return
    
    success_count = 0
    failure_count = 0
    
    for item_id, status in ITEMS_TO_UPDATE.items():
        if update_status(item_id, status):
            success_count += 1
        else:
            failure_count += 1
        
        # Sleep briefly to avoid rate limiting
        time.sleep(1)
    
    print(f"\nSummary: {success_count} items updated successfully, {failure_count} failures")

if __name__ == "__main__":
    main()