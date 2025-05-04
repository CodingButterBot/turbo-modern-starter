# Required GitHub Secrets

This document outlines the secrets required for the GitHub Actions workflows in this repository.

## Deployment Secrets

The following secrets are required for the deployment workflow:

| Secret Name | Description | How to Obtain |
|-------------|-------------|---------------|
| `VERCEL_TOKEN` | API token for Vercel deployments | Go to Vercel dashboard → Settings → Tokens → Create new token |
| `VERCEL_ORG_ID` | Your Vercel organization ID | Go to Vercel dashboard → Settings → General → Your ID (at bottom) |
| `VERCEL_WEB_PROJECT_ID` | Project ID for web app | Create project in Vercel, then go to Project Settings → General → Project ID |
| `VERCEL_DOCS_PROJECT_ID` | Project ID for docs site | Create project in Vercel, then go to Project Settings → General → Project ID |

## Testing Secrets

The following secrets are used in the testing workflows:

| Secret Name | Description | How to Obtain |
|-------------|-------------|---------------|
| `CODECOV_TOKEN` | Token for uploading coverage reports | Go to Codecov dashboard → Repository settings → Upload token |

## Setting Up Secrets

To add these secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Select "Secrets and variables" → "Actions" from the sidebar
4. Click "New repository secret"
5. Enter the secret name and value
6. Click "Add secret"

## Security Considerations

- Never commit these secrets to the repository
- Regularly rotate your tokens and update the secrets
- Use the least privileged tokens possible
- Consider setting up OIDC authentication for more secure deployments

## Vercel Project Setup

When setting up your Vercel projects, ensure:

1. Both web and docs projects are linked to the same GitHub repository
2. Root directory is set to the correct path (apps/web or apps/docs)
3. Framework preset is set to Next.js
4. Environment variables are properly configured in Vercel dashboard