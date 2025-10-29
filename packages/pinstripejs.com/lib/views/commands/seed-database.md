---
menus:
    sidebar: ["Commands", "seed-database"]
---
# seed-database Command

> **Note**: This command is implemented as part of the `@pinstripe/database` package and needs to be included in your project for it to be available.

## Interface

The command seeds the database with initial data with the following signature:

```bash
pinstripe seed-database
```

### Parameters

This command takes no parameters.

### Examples

```bash
# Seed the database with initial data
pinstripe seed-database

# Run programmatically in code
await this.runCommand('seed-database');
```

## Description

The `seed-database` command is a **database seeding tool** that populates your database with initial data. By default, the base command does nothing - projects implement custom seeding logic as needed.

## Default Implementation

The base `seed-database` command is intentionally minimal:

```javascript
export default {
    run(){
        // do nothing
    }
};
```

Projects override this command to implement custom seeding logic.

## Common Seeding Patterns

### Site Configuration
```javascript
// Update site metadata
await this.database.site.update({
    title: 'My Blog',
    description: 'Welcome to my website'
});
```

### Admin User Creation
```javascript
// Create default admin user
const user = await this.database.users.insert({
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin'
});
```

### Content Loading
```javascript
// Load content from markdown files
const contentPath = `${rootPath}/content`;
if(existsSync(contentPath)){
    await this.loadContentFromDirectory(contentPath);
}
```

### Multi-tenant Setup
```javascript
// Create default tenant
if(this.modules.includes('@pinstripe/multi-tenant')){
    await this.database.tenants.insert({
        name: 'default',
        host: 'localhost'
    });
}
```

## Environment Variables

- **`SKIP_FIXTURES`** - Set to `'true'` to skip fixture loading
- **`MODULES`** - Comma-separated list of modules to configure seeding for

## When to Use

### Development Setup
- After running `initialize-database` for the first time
- When you need fresh seed data for testing
- After database migrations that require new seed data

### Production Deployment
- Initial deployment to populate required data
- Adding reference data or default configurations

### Testing
- Setting up test fixtures before running tests
- Populating test databases with known data

## Related Commands

- **`initialize-database`** - Runs migrations and seeding (includes this command)
- **`migrate-database`** - Apply database migrations before seeding
- **`reset-database`** - Drops database and reinitializes with seeding
- **`generate-project`** - Creates a basic seed command during project setup