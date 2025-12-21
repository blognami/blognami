---
menu:
    path: ["Commands", "migrate-database"]
---
# migrate-database Command

> **Note**: This command is implemented as part of the `@pinstripe/database` package and needs to be included in your project for it to be available.

## Interface

The command applies pending database migrations with the following signature:

```bash
pinstripe migrate-database
```

### Parameters

None - this command takes no parameters.

### Examples

```bash
# Apply all pending migrations
pinstripe migrate-database

# Run programmatically in code
await this.runCommand('migrate-database');
```

## Description

The `migrate-database` command is a **database schema management tool** that:

1. **Creates migration tracking table** - Sets up `appliedMigrations` table if it doesn't exist
2. **Scans migration files** - Discovers all migration files in `lib/migrations/`
3. **Applies pending migrations** - Runs only migrations that haven't been applied yet
4. **Tracks applied migrations** - Records each migration's schema version to prevent re-execution
5. **Maintains order** - Executes migrations in chronological order based on timestamp

## Migration Process

The command follows this sequence:

1. **Initialize tracking** - Creates `appliedMigrations` table with `schemaVersion` column
2. **Load migrations** - Imports all migration files from the project's `lib/migrations/` directory  
3. **Sort by timestamp** - Orders migrations by their Unix timestamp prefix
4. **Check status** - Queries which migrations have already been applied
5. **Execute pending** - Runs the `migrate()` method for each unapplied migration
6. **Record completion** - Inserts the schema version into `appliedMigrations` table

## Development vs Production

### Development Environment
- **Verbose logging** - Shows "Applying migration: [name]" for each migration
- **Automatic execution** - Often run automatically during project initialization

### Production Environment  
- **Silent execution** - No console output during migration process
- **Manual control** - Typically run explicitly during deployment

## Migration File Structure

Migrations are expected in this format:

```javascript
// lib/migrations/1728471234_create_users_table.js
export default {
    async migrate(){
        await this.database.table('users', async users => {
            await users.addColumn('name', 'string');
            await users.addColumn('email', 'string');
            await users.addColumn('created_at', 'datetime');
        });
    }
};
```

## Safety Features

- **Idempotent execution** - Safe to run multiple times; skips already-applied migrations
- **Sequential processing** - Migrations run in strict chronological order
- **Transaction safety** - Each migration runs within its own context
- **Error prevention** - Stops on first migration failure to prevent partial application

## Related Commands

- **`generate-migration`** - Create new migration files
- **`initialize-database`** - Runs migrations and seeds (includes this command)
- **`seed-database`** - Populate database with initial data
- **`drop-database`** - Remove database (requires re-migration)