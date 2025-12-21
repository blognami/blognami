---
menu:
    path: ["Commands", "initialize-database"]
---
# initialize-database Command

> **Note**: This command is implemented as part of the `@pinstripe/database` package and needs to be included in your project for it to be available.

## Interface

The command initializes the database schema and data with the following signature:

```bash
pinstripe initialize-database
```

### Parameters

This command takes no parameters.

### Examples

```bash
# Initialize the database
pinstripe initialize-database
```

## Description

The `initialize-database` command is a **database setup tool** that prepares your database for use by:

1. **Running migrations** - Executes all pending database migrations to create/update the schema
2. **Seeding data** - Populates the database with initial data (if seeding logic is implemented)

This command is equivalent to running both `migrate-database` and `seed-database` commands in sequence.

## When to Use

### Initial Setup
- After creating a new project with `generate-project`
- When setting up the database for the first time
- Before starting development on a fresh database

### Environment Setup
- When deploying to a new environment (staging, production)
- After cloning a project repository
- When switching between database configurations

## Database Requirements

The command requires:
- **Database connection** - Configured in `pinstripe.config.js`
- **Migration files** - Located in `lib/migrations/` (if any exist)
- **Seed files** - Located in `lib/seeds/` (if custom seeding is implemented)

## Related Commands

- **`migrate-database`** - Runs database migrations only
- **`seed-database`** - Seeds database with initial data only  
- **`reset-database`** - Drops tables and reinitializes the database
- **`generate-migration`** - Creates new database migration files
- **`generate-project`** - Automatically runs this command during project setup