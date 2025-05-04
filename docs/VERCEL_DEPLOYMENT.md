# Vercel Deployment Configuration

This document provides instructions for setting up Vercel projects for the web application and documentation site in the Turbo Modern Starter monorepo.

## Project Configuration

### Web Application (apps/web)

1. **Create a new project in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Select the repository

2. **Configure build settings**:
   - Set the Framework Preset to "Next.js"
   - Set the Root Directory to "apps/web"
   - Vercel should automatically detect the `vercel.json` configuration

3. **Environment Variables**:
   - Add any required environment variables for the web application

### Documentation Site (apps/docs)

1. **Create a new project in Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." > "Project"
   - Import your GitHub repository (if not already imported)
   - Select the repository

2. **Configure build settings**:
   - Set the Framework Preset to "Next.js"
   - Set the Root Directory to "apps/docs"
   - Vercel should automatically detect the `vercel.json` configuration

3. **Environment Variables**:
   - Add any required environment variables for the documentation site

## Vercel.json Configuration

The repository includes the following configuration files:

- `/vercel.json`: Root configuration for the monorepo
- `/apps/web/vercel.json`: Configuration for the web application
- `/apps/docs/vercel.json`: Configuration for the documentation site

### Turborepo Remote Caching

To enable Turborepo Remote Caching with Vercel:

1. Generate a Turborepo API token in the Vercel dashboard:
   - Go to Account Settings > Tokens > Create
   - Copy the generated token

2. Add the token to your CI environment:
   ```bash
   pnpm turbo login
   pnpm turbo link
   ```

## Domains and URLs

### Production Domains

After deploying, configure your domains:

1. Go to your project settings in Vercel
2. Navigate to the "Domains" tab
3. Add your custom domains:
   - Web app: `app.yourdomain.com`
   - Docs: `docs.yourdomain.com`

### Preview Deployments

Vercel will automatically create preview deployments for pull requests. The URLs will be in the format:
- `project-name-git-branch-username.vercel.app`

## Additional Configuration

### Branch Deployments

The configuration enables automatic deployments for:
- `main` branch
- `feature/complete-implementation` branch

To enable deployments for other branches, modify the `git.deploymentEnabled` section in the respective `vercel.json` files.

### Troubleshooting

If you encounter issues with the build:

1. Check the build logs in Vercel dashboard
2. Ensure all required dependencies are installed
3. Verify environment variables are set correctly
4. Make sure the monorepo structure is correctly referenced

## References

- [Vercel Monorepo Documentation](https://vercel.com/docs/monorepos)
- [Turborepo with Vercel](https://turbo.build/repo/docs/ci/vercel)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)