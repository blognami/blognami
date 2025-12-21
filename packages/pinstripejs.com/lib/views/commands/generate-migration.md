---
menu:
    path: ["Commands", "generate-migration"]
---
# generate-migration Command

> **Note**: This command is implemented as part of the `@pinstripe/database` package and needs to be included in your project for it to be available.

## Interface

The command creates a new database migration file with the following signature:

```bash
pinstripe generate-migration [suffix] [--table <table_name>] [--fields <field_definitions>]
```

### Parameters

- **`suffix`** (optional) - The suffix for the migration name (converted to snake_case). If ending with "_to_tablename", the table name will be inferred
- **`--table <table_name>`** (optional) - The table name for the migration. Can be inferred from suffix
- **`--fields <field_definitions>`** (optional) - Field definitions in format "name:type name:type" (e.g., "name:string age:integer")

### Examples

```bash
# Create a basic migration
pinstripe generate-migration add_users_table

# Create a migration with table name inferred from suffix
pinstripe generate-migration add_columns_to_users

# Create a migration with explicit table and fields
pinstripe generate-migration add_user_fields --table users --fields "email:string created_at:datetime"

# Create a migration with multiple fields
pinstripe generate-migration setup_posts --table posts --fields "title:string content:text published:boolean"
```

## Description

The `generate-migration` command is a **database scaffolding tool** that creates timestamped migration files for database schema changes. It automatically:

1. **Normalizes naming** - Converts the suffix to snake_case format
2. **Generates timestamped files** - Creates uniquely named migration files with Unix timestamp prefix
3. **Creates migration directory** - Sets up `lib/migrations/` directory structure
4. **Sets up file importer** - Creates `_file_importer.js` if it doesn't exist
5. **Provides starter code** - Includes migration structure with field definitions when specified

## Generated Files

```
lib/migrations/
├── _file_importer.js           # Migration base class import (created if needed)  
└── 1728471234_suffix_name.js   # Your timestamped migration file
```

## Generated Migration Structure

### Basic Migration
```javascript
export default {
    async migrate(){
        
    }
};
```

### Migration with Table and Fields
```javascript
export default {
    async migrate(){
        await this.database.table('users', async users => {
            await users.addColumn('email', 'string');
            await users.addColumn('created_at', 'datetime');
        });
    }
};
```

## Usage in Application

After generating a migration, you can:

1. **Customize the implementation** by editing the `migrate()` method
2. **Run migrations** via the database migration system
3. **Add complex schema changes** like indexes, foreign keys, and data transformations

## Field Types

Supported field types include:

### Text Types
- `string` - Variable length text (VARCHAR 255)
- `text` - Long text content (LONGTEXT/TEXT)

### Numeric Types  
- `integer` - Whole numbers (INT)
- `decimal` - Decimal numbers with precision
- `float` - Floating point numbers

### Date/Time Types
- `date` - Date only (YYYY-MM-DD)
- `datetime` - Date and time stamps

### Other Types
- `boolean` - True/false values
- `binary` - Binary data (files, images, etc.)

### Key Types (Auto-managed)
- `primary_key` - Auto-incrementing primary key
- `alternate_key` - UUID-based alternate key  
- `foreign_key` - References to other tables

## Related Commands

- **`list-commands`** - List all available commands in the project
- **`generate-service`** - Generate business logic services