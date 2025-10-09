---
sidebar:
    category: ["Commands", "list-migrations"]
---
# list-migrations Command

> **Note**: This command is implemented as part of the `@pinstripe/database` package and needs to be included in your project for it to be available.

## Interface

The command lists all available database migrations with the following signature:

```bash
pinstripe list-migrations
```

### Parameters

This command takes no parameters.

### Examples

```bash
# List all migrations in the project
pinstripe list-migrations
```

## Description

The `list-migrations` command is a **database inspection tool** that displays all migration files available in the current project. It scans the `lib/migrations/` directory and shows:

1. **Migration names** - All timestamped migration files in the project
2. **Colored output** - Migration names displayed in green for easy reading
3. **Clean formatting** - Organized list with proper spacing

## Sample Output

```
The following migrations are available:

  * 1728471234_create_users_table
  * 1728471567_add_email_to_users  
  * 1728472890_create_posts_table
  * 1728473145_add_published_to_posts
```

## Common Use Cases

- **Before running migrations** - See what migrations are available to execute
- **Project overview** - Understand the database schema evolution
- **Debugging** - Verify migration files are properly detected
- **Development workflow** - Check migration status during development

## Related Commands

- **`generate-migration`** - Create new database migration files
- **`initialize-database`** - Set up database schema and run migrations
- **`generate-model`** - Generate model classes that use migrated tables