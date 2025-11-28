---
menus:
    sidebar: ["Services", "database"]
---
# database

Access the application's database with an ORM-like interface supporting MySQL and SQLite.

## Interface

```javascript
// Table access
this.database.tableName              // Access table by name
this.database.table(name, fn)        // Table access with optional callback (for migrations)
this.database.union(name)            // Union query across tables with same base type
this.database.singleton(name)        // Access singleton record (auto-created if missing)

// Operations
this.database.run(query)             // Execute raw SQL
this.database.transaction(fn)        // Execute within transaction
this.database.lock(fn)               // Execute with database lock
this.database.migrate()              // Run pending migrations
this.database.drop()                 // Drop all tables
this.database.reset()                // Refresh schema cache

// Properties
this.database.info                   // Object mapping names to types ('table', 'singleton', 'union')
this.database.withoutTenantScope     // Access database without tenant filtering
```

## Table Methods

```javascript
// Querying
table.where(conditions)              // Add WHERE conditions
table.orderBy(column, direction)     // Add ORDER BY ('asc' or 'desc')
table.paginate(page, pageSize)       // Paginate results (page defaults to 1, pageSize to 10)
table.all()                          // Get all matching records
table.first()                        // Get first matching record
table.count()                        // Count matching records

// CRUD
table.insert(fields, options)        // Insert new record
table.update(fields, options)        // Update matching records
table.delete()                       // Delete matching records
```

## Dynamic Scopes

Tables automatically generate query scopes for each column:

```javascript
table.where({ column: value })           // WHERE column = value
table.where({ columnNe: value })         // WHERE column != value
table.where({ columnGt: value })         // WHERE column > value
table.where({ columnLt: value })         // WHERE column < value
table.where({ columnGe: value })         // WHERE column >= value
table.where({ columnLe: value })         // WHERE column <= value
table.where({ columnBeginsWith: value }) // WHERE column LIKE 'value%'
table.where({ columnEndsWith: value })   // WHERE column LIKE '%value'
table.where({ columnContains: value })   // WHERE column LIKE '%value%'

// Array values create OR conditions
table.where({ status: ['draft', 'published'] })  // WHERE (status = 'draft' OR status = 'published')
```

## Examples

### Basic CRUD Operations

```javascript
const { users, posts } = this.database;

// Insert
const user = await users.insert({ name: 'John', email: 'john@example.com' });

// Query
const admin = await users.where({ role: 'admin' }).first();
const allUsers = await users.all();
const count = await users.count();

// Update
await users.where({ id: user.id }).update({ name: 'Jane' });

// Delete
await users.where({ id: user.id }).delete();
```

### Filtering and Pagination

```javascript
const { posts } = this.database;

// Using dynamic scopes
const recentPosts = await posts
    .where({ status: 'published', createdAtGt: '2024-01-01' })
    .orderBy('createdAt', 'desc')
    .paginate(1, 10)
    .all();

// Chained where clauses (AND)
const filtered = await posts
    .where({ status: 'published' })
    .where({ authorIdNe: currentUserId })
    .all();
```

### Transactions

```javascript
await this.database.transaction(async () => {
    const user = await this.database.users.insert({ name: 'John', email: 'john@example.com' });
    await this.database.posts.insert({ userId: user.id, title: 'First Post' });
    // Rolls back automatically if any operation fails
});
```

### Singleton Records

```javascript
// Singleton records are auto-created on first access
const settings = await this.database.settings;
await settings.update({ siteName: 'My Site' });
```

## Configuration

Configure in `pinstripe.config.js`:

```javascript
export default {
    database: {
        // SQLite (default for development)
        adapter: 'sqlite',
        filename: 'development.db'

        // MySQL (recommended for production)
        // adapter: 'mysql',
        // host: 'localhost',
        // user: 'root',
        // password: '',
        // database: 'myapp_production'
    }
};
```

## Notes

- All insert, update, and delete operations are automatically wrapped in transactions
- Dynamic scopes are generated at runtime based on the database schema
- Use `database.reset()` after manual schema changes to refresh the cache
- Multi-tenancy is available via the `@pinstripe/multi-tenant` package
