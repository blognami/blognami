---
sidebar:
    category: ["Commands", "generate-model"]
---
# generate-model Command

> **Note**: This command is implemented as part of the `@pinstripe/database` package and needs to be included in your project for it to be available.

## Interface

The command creates a new model file and associated migration with the following signature:

```bash
pinstripe generate-model <name> [fields]
```

### Parameters

- **`name`** (required) - The name of the model to create (in snake_case)
- **`fields`** (optional) - Field definitions for the model's table (e.g., "name:string age:integer")

### Examples

```bash
# Create a basic model
pinstripe generate-model user

# Create a model with fields
pinstripe generate-model user "name:string email:string age:integer"

# Create a blog post model
pinstripe generate-model post "title:string content:text published:boolean"
```

## Description

The `generate-model` command is a **data modeling tool** that creates:

1. **Model file** - Generates `lib/models/{name}.js` with basic structure
2. **Migration file** - Automatically creates associated migration if the table doesn't exist
3. **File importer** - Sets up `lib/models/_file_importer.js` if it doesn't exist

## Generated Files

### Model File (`lib/models/{name}.js`)
```javascript
export default {
    // Model definition goes here
};
```

### Migration File (`lib/migrations/{timestamp}_create_{name}.js`)
```javascript
export default {
    async migrate(){
        await this.database.table('ModelName', async ModelName => {
            await ModelName.addColumn('name', 'string');
            await ModelName.addColumn('email', 'string');
            await ModelName.addColumn('age', 'integer');
        });
    }
};
```

### File Importer (`lib/models/_file_importer.js`)
```javascript
export { Row as default } from '@pinstripe/database';
```

## Field Types

See [generate-migration#heading-field-types](generate-migration#heading-field-types) for supported field types in the `fields` parameter.

## Related Commands

- **`list-models`** - List all available database models
- **`list-migrations`** - List all database migrations
- **`migrate-database`** - Run pending migrations to update database schema