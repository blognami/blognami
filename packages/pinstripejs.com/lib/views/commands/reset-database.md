---
menu:
    path: ["Commands", "reset-database"]
---
# reset-database Command

> **Note**: This command is implemented as part of the `@pinstripe/database` package and needs to be included in your project for it to be available.

## Interface

The command resets the database by dropping and reinitializing it with the following signature:

```bash
pinstripe reset-database
```

### Parameters

This command takes no parameters.

### Examples

```bash
# Reset the database completely
pinstripe reset-database

# Run programmatically in code
await this.runCommand('reset-database');
```

## Description

The `reset-database` command is a **destructive database operation** that completely resets your database by:

1. **Dropping the database** - Removes all tables, data, and schema
2. **Reinitializing the database** - Runs migrations and seeds to restore the schema and initial data

This command is equivalent to running `drop-database` followed by `initialize-database` in sequence.

⚠️ **Warning**: This operation is irreversible. All data will be permanently lost.

## When to Use

### Development Environment
- **Reset development state** - Clear all test data and start fresh with clean schema
- **Testing cleanup** - Reset database state between test runs or test suites
- **Schema troubleshooting** - Resolve database corruption or migration issues

### Database Maintenance
- **Fresh start** - Complete database reset when switching between feature branches
- **Migration testing** - Test migration scripts from a clean state
- **Development workflow** - Quickly restore to a known good database state

## Safety Considerations

- **Production warning** - Never run this command in production environments
- **Backup first** - Always backup important data before resetting
- **Double-check environment** - Verify you're in the correct environment (development/test)
- **No confirmation prompt** - Command executes immediately without confirmation

## Related Commands

- **`drop-database`** - Drop database only (first half of reset operation)
- **`initialize-database`** - Initialize database only (second half of reset operation)
- **`migrate-database`** - Apply database migrations only
- **`seed-database`** - Populate database with initial data only