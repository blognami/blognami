---
menus:
    sidebar: ["Commands", "drop-database"]
---
# drop-database Command

> **Note**: This command is implemented as part of the `@pinstripe/database` package and needs to be included in your project for it to be available.

## Interface

The command drops the database with the following signature:

```bash
pinstripe drop-database
```

### Parameters

No parameters required.

### Examples

```bash
# Drop the current database
pinstripe drop-database
```

## Description

The `drop-database` command is a **destructive database operation** that completely removes the database and all its data. This command:

1. **Drops all tables** - Removes all database tables and their structure
2. **Deletes all data** - Permanently removes all stored data
3. **Clears schema** - Removes any database schema information

⚠️ **Warning**: This operation is irreversible. All data will be permanently lost.

## Use Cases

### Development Environment
- **Reset development state** - Clear all test data and start fresh
- **Schema changes** - Remove database before applying new migrations
- **Testing cleanup** - Reset database state between test runs

### Database Maintenance
- **Fresh start** - Complete database reset for development
- **Migration testing** - Test migration scripts on clean database
- **Troubleshooting** - Resolve database corruption issues

## Safety Considerations

- **Production warning** - Never run this command in production environments
- **Backup first** - Always backup important data before dropping
- **Double-check environment** - Verify you're in the correct environment
- **No confirmation prompt** - Command executes immediately without confirmation

## Related Commands

- **`initialize-database`** - Create database schema and initial data after dropping
- **`reset-database`** - Combines drop-database and initialize-database operations
- **`migrate-database`** - Apply database migrations to rebuild schema
- **`seed-database`** - Populate database with seed data