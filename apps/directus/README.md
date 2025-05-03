# Directus CMS Backend

This directory contains configuration to run a Directus instance for Turbo Modern Starter.

## Running Directus

Ensure you have Docker installed. Then run:

```bash
docker-compose up -d
```

This will start a Directus server on [http://localhost:8055](http://localhost:8055). The first startup will create an admin user with the credentials specified in `docker-compose.yml` (default: admin@example.com / password123).

## Configuration

* The Directus service is configured to use SQLite (the database file is stored in the Docker volume `directus_data`). This is for development convenience. In production, you might use a Postgres or MySQL service and adjust `DB_CLIENT` and related env vars.
* Update `.env` or `docker-compose.yml` to change configurations (such as admin credentials or enable/disable features).

## Using Directus

Directus provides a web UI at the URL above. Log in with the admin credentials, then you can create collections (tables) for storing module options, results, or any other content. For example, you might create a collection `module_options` to store predefined sets of options.

The Next.js web app can communicate with Directus via the REST or GraphQL API. For instance, to fetch data, use the base URL `http://localhost:8055` (in development). In the web app, this can be configured via an environment variable like `NEXT_PUBLIC_DIRECTUS_URL`.

## Example Schema

Here's a suggested schema to implement in Directus for this project:

1. **module_collections** - Sets of options for the module
   - `id` (Primary Key)
   - `name` (String) - Name of the collection
   - `description` (Text) - Description of the collection
   - `created_by` (User) - Creator of the collection
   - `created_at` (Datetime) - Creation timestamp

2. **module_options** - Individual options within a collection
   - `id` (Primary Key)
   - `collection` (M2O to module_collections) - The collection this option belongs to
   - `label` (String) - The text of the option
   - `weight` (Number, optional) - Weight for weighted selections
   - `sort` (Number) - Sort order in the collection

3. **module_results** - Records of past spins (if tracking history)
   - `id` (Primary Key)
   - `collection` (M2O to module_collections) - The collection used
   - `selected_option` (M2O to module_options) - The option that was selected
   - `created_at` (Datetime) - When the selection happened
   - `user` (User, optional) - Who performed the selection

## Directus and Monorepo

Note that Directus runs as a separate service and is not a TypeScript project. It does not partake in the Turborepo pipeline except being documented and controlled via this configuration.

You can stop the Directus service with:

```bash
docker-compose down
```

All data will persist in the Docker volume. To reset data, remove the volume via:

```bash
docker-compose down -v
```

Be careful: removing the volume will delete the SQLite database.