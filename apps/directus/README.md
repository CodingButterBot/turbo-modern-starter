# Directus (CMS Backend)

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

Directus provides a web UI at the URL above. Log in with the admin credentials, then you can create collections (tables) for storing module options, results, or any other content. For example, you might create a collection `module_options` to store predefined sets of options for the module feature.

The Next.js web app can communicate with Directus via the REST or GraphQL API. For instance, to fetch data, use the base URL `http://localhost:8055` (in development). In the web app, this can be configured via an environment variable like `NEXT_PUBLIC_DIRECTUS_URL`.

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