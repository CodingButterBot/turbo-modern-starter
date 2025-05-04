#!/bin/bash
# PR Review script using Claude
# This script runs Claude with a specific prompt to review PRs and update issues

# Text colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Running Claude PR Review...${NC}"

# Run Claude with the PR review prompt
claude -p "look over all pr request and if the jobs fail find the issues related to that pr request and comment on them with what needs to be done to fix them. either that or add any approprieate issues to the project"

echo -e "${GREEN}Claude PR review completed.${NC}"