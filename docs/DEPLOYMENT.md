# Deployment Workflow

This document explains the automated deployment process for the Turbo Modern Starter monorepo.

## Overview

The repository uses GitHub Actions to automate the build and deployment process for all applications:

- Web Application (Next.js)
- Documentation Site (Next.js + Fumadocs)
- Browser Extension (Vite)

## Workflow Configuration

The deployment workflow is defined in `.github/workflows/deploy.yml` and includes the following key features:

### Triggers

The workflow is triggered on:

- Push to the `main` branch
- New version tags (`v*`)
- Manual dispatch with environment selection

### Key Jobs

1. **Build**
   - Builds all applications and packages
   - Runs lint and type checking
   - Caches build artifacts
   - Packages the browser extension

2. **Deploy Web App**
   - Deploys the web application to Vercel
   - Supports both production and preview deployments
   - Uses environment variables for configuration

3. **Deploy Documentation**
   - Deploys the documentation site to Vercel
   - Supports both production and preview deployments
   - Uses environment variables for configuration

4. **Publish Extension**
   - Runs only for version tags
   - Creates a GitHub release with the packaged extension

## Required Secrets

The following secrets must be configured in your GitHub repository:

- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_WEB_PROJECT_ID`: Project ID for the web application
- `VERCEL_DOCS_PROJECT_ID`: Project ID for the documentation site

## Environments

The workflow supports two deployment environments:

1. **Production**
   - Used for deployments from the `main` branch and version tags
   - Deploys to production environments in Vercel

2. **Staging**
   - Used for preview deployments
   - Can be selected when manually triggering the workflow

## Manual Deployment

To manually trigger a deployment:

1. Go to the "Actions" tab in your GitHub repository
2. Select the "Deploy" workflow
3. Click "Run workflow"
4. Select the branch and environment
5. Click "Run workflow" to start the deployment

## Monitoring Deployments

Deployment status and URLs can be monitored in:

1. The GitHub Actions workflow run page
2. The Vercel dashboard for your projects

## Troubleshooting

Common issues and solutions:

### Build Failures

- Check the build logs for errors
- Verify that all dependencies are installed
- Ensure environment variables are set correctly

### Deployment Failures

- Verify Vercel token and project IDs
- Check for Vercel service status issues
- Ensure the project configuration in Vercel is correct

### Extension Packaging Issues

- Check the extension build logs
- Verify that the extension manifest is correctly configured

## Best Practices

1. Always run tests locally before pushing to `main`
2. Use semantic versioning for release tags
3. Monitor deployment logs for any warnings or errors
4. Keep secrets secure and rotate them periodically