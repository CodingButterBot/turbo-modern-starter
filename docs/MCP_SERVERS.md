# MCP Servers Configuration

This project includes NPM scripts for working with Model Context Protocol (MCP) servers, enabling AI-assisted development workflows.

## Available MCP Servers

The following MCP servers are configured:

1. **Memory Server**: Provides persistent memory capabilities for AI tools
2. **GitHub Server**: Enables AI tools to interact with GitHub repositories, issues, and PRs
3. **Playwright Server**: Allows AI tools to automate browser interactions and UI testing
4. **Claude Server**: Integrates with Claude AI model for advanced AI capabilities

## Prerequisites

Before using MCP servers, ensure you have:

1. Docker installed (for GitHub server)
2. Node.js and NPM/PNPM installed
3. Proper environment variables set for authentication:
   - `GITHUB_TOKEN` for GitHub server access

## Usage

### Starting Individual Servers

Use the following commands to start each server individually:

```bash
# Start Memory Server
pnpm mcp:memory

# Start GitHub Server
pnpm mcp:github

# Start Playwright Server
pnpm mcp:playwright

# Start Claude Server
pnpm mcp:claude
```

### Starting Multiple Servers Together

To start multiple servers simultaneously, use:

```bash
# Start Memory, GitHub, and Playwright servers
pnpm mcp:all
```

## Environment Variables

To use the GitHub MCP server, you need to set the GitHub token:

```bash
# Linux/macOS
export GITHUB_TOKEN=your_github_personal_access_token

# Windows (Command Prompt)
set GITHUB_TOKEN=your_github_personal_access_token

# Windows (PowerShell)
$env:GITHUB_TOKEN="your_github_personal_access_token"
```

## Configuration

The MCP server configurations are stored in `.mcp.json`. If you need to modify server parameters, edit this file.

## Troubleshooting

If you encounter issues:

1. Ensure Docker is running (for GitHub server)
2. Verify that environment variables are set correctly
3. Check that required ports are available (not used by other processes)
4. Look for error messages in the server output

## Additional Resources

- [Model Context Protocol Documentation](https://github.com/github/model-context-protocol)
- [GitHub MCP Server Documentation](https://github.com/github/github-mcp-server)
- [Playwright MCP Documentation](https://github.com/microsoft/playwright/tree/main/packages/mcp)