---
menus:
    sidebar: ["Services", "database"]
---
# database Service

The `database` service provides access to the application's database layer, offering a high-level ORM-like interface for interacting with MySQL and SQLite databases. It supports dynamic table access, relationship queries through nested object syntax, migrations, transactions, and optional multi-tenancy.

## Interface

The database service provides the following interface:

### Core Methods
- `database.run(query)` - Execute raw SQL queries (string or array format)
- `database.migrate()` - Run database migrations
- `database.drop()` - Drop all database tables
- `database.reset()` - Reset database schema cache after manual schema changes
- `database.destroy()` - Close database connection
- `database.lock(fn)` - Execute function with database lock
- `database.transaction(fn)` - Execute function within transaction

### Dynamic Table Access
- `database[tableName]` - Access table by name (returns Table instance)
- `database.table(name, fn)` - Create table instance with optional callback (used in migrations)
- `database.union(name)` - Create union query across multiple tables
- `database.singleton(name)` - Access singleton record (auto-created if missing)

### Schema Information
- `database.info` - Object containing table/singleton mappings
- `database.getUnixTimestamp()` - Get current database timestamp

### Multi-tenant Support
- `database.withoutTenantScope` - Access database without tenant filtering

## Table Methods

Tables accessed via `database[tableName]` provide:

### Query Methods
- `table.where(conditions)` - Add WHERE conditions
- `table.orderBy(column, direction)` - Add ORDER BY clause  
- `table.paginate(page, pageSize, skipCount)` - Add pagination (page defaults to 1, pageSize to 10)
- `table.all()` - Get all matching records
- `table.first()` - Get first matching record (automatically applies LIMIT 1)
- `table.count()` - Count matching records

### CRUD Operations
- `table.insert(fields, options)` - Insert new record
- `table.update(fields, options)` - Update matching records
- `table.delete()` - Delete matching records

### Dynamic Scopes
Tables automatically generate query scopes for each column that can be used within `where()` conditions:
- `table.where({ columnName: value })` - WHERE column = value
- `table.where({ columnNameNe: value })` - WHERE column != value
- `table.where({ columnNameGt: value })` - WHERE column > value
- `table.where({ columnNameLt: value })` - WHERE column < value
- `table.where({ columnNameGe: value })` - WHERE column >= value
- `table.where({ columnNameLe: value })` - WHERE column <= value
- `table.where({ columnNameBeginsWith: value })` - WHERE column LIKE 'value%'
- `table.where({ columnNameEndsWith: value })` - WHERE column LIKE '%value'
- `table.where({ columnNameContains: value })` - WHERE column LIKE '%value%'

**Array Values**: When passing an array as the value, multiple conditions are created:
- `table.where({ columnName: [val1, val2] })` - WHERE (column = val1 OR column = val2)
- `table.where({ columnNameNe: [val1, val2] })` - WHERE (column != val1 AND column != val2)

**Relationship Queries**: Use nested objects to query across relationships:
- `table.where({ relationshipName: { columnName: value } })` - Join with related table and filter

## Examples

### Basic Table Operations

```javascript
// Access users table
const users = this.database.users;

// Insert a new user
const user = await this.database.users.insert({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin'
});

// Find users by email
const user = await this.database.users.where({ email: 'john@example.com' }).first();

// Find all admin users
const admins = await this.database.users.where({ role: 'admin' }).all();

// Update user
await this.database.users.where({ id: user.id }).update({
    name: 'Jane Doe'
});

// Delete user
await this.database.users.where({ id: user.id }).delete();
```

### Dynamic Column Scopes

```javascript
// Using generated scopes for different column types
const posts = await this.database.posts
    .where({ title: 'My Post' })           // WHERE title = 'My Post'
    .where({ status: ['published', 'draft'] })  // WHERE (status = 'published' OR status = 'draft')
    .where({ createdAtGt: '2023-01-01' })    // WHERE createdAt > '2023-01-01'
    .all();

// Multiple conditions in single where() call
const users = await this.database.users
    .where({ 
        emailNe: 'admin@example.com',  // WHERE email != 'admin@example.com'
        role: 'user'                   // AND role = 'user'
    })
    .all();

// Or chained where() calls
const users2 = await this.database.users
    .where({ emailNe: 'admin@example.com' })  // WHERE email != 'admin@example.com'
    .where({ role: 'user' })                  // AND role = 'user'
    .all();
```

### Real-world Dynamic Scope Examples

```javascript
// Find posts excluding current post and filtering by date
const previousPost = await this.database.posts
    .where({ 
        idNe: post.id, 
        publishedAtLt: post.publishedAt 
    })
    .orderBy('publishedAt', 'desc')
    .first();

const nextPost = await this.database.posts
    .where({ 
        idNe: post.id, 
        publishedAtGt: post.publishedAt 
    })
    .orderBy('publishedAt', 'asc')
    .first();

// Find users excluding current user with admin role
const adminUsers = await this.database.users
    .where({ 
        idNe: currentUserId, 
        role: 'admin' 
    })
    .all();

// Complex validation queries
const duplicateSlug = await this.database.pageables
    .where({ 
        idNe: pageable.id, 
        slug: pageable.slug 
    })
    .count();
```

### Pagination and Ordering

```javascript
// Get paginated results
const posts = await this.database.posts
    .orderBy('createdAt', 'desc')
    .paginate(2, 10)  // page 2, 10 items per page
    .all();

// Count total records
const totalPosts = await this.database.posts.count();

// Get first record
const latestPost = await this.database.posts
    .orderBy('createdAt', 'desc')
    .first();
```

### Raw SQL Queries

```javascript
// Execute raw SQL
const results = await this.database.run(`
    SELECT u.name, COUNT(p.id) as post_count 
    FROM users u 
    LEFT JOIN posts p ON u.id = p.userId 
    GROUP BY u.id
`);

// For parameterized queries, use the built-in query builder syntax
const user = await this.database.users.where({ email: 'john@example.com' }).first();
```

### Transactions

```javascript
// Execute operations within a transaction
await this.database.transaction(async () => {
    const user = await this.database.users.insert({
        name: 'John Doe',
        email: 'john@example.com'
    });
    
    await this.database.posts.insert({
        userId: user.id,
        title: 'First Post',
        body: 'Hello world!'
    });
    
    // If any operation fails, entire transaction is rolled back
});
```

### Database Locks

```javascript
// Execute with database lock (prevents concurrent access)
await this.database.lock(async () => {
    const counter = await this.database.settings.value;
    await this.database.settings.update({ 
        value: counter + 1 
    });
});
```

### Singleton Records

```javascript
// Access singleton record (auto-created if missing)
const site = await this.database.site;

// Access singleton properties
const siteTitle = await this.database.site.title;
const siteDescription = await this.database.site.navigation;

// Update singleton
await this.database.site.update({
    title: 'My Website',
    description: 'Welcome to my site'
});
```

### Multi-tenant Operations

```javascript
// Access current tenant's data (when multi-tenancy enabled)
const posts = await this.database.posts.all();  // Automatically scoped to current tenant

// Access data without tenant scope
const allPosts = await this.database.withoutTenantScope.posts.all();
```

### Database Migrations

```javascript
// Run pending migrations
await this.database.migrate();

// Drop all tables (destructive!)
await this.database.drop();

// Reset schema cache (after manual schema changes)
await this.database.reset();
```

### Schema Inspection

```javascript
// Get database schema information
console.log(this.database.info);
// Output: {
//   users: 'table',
//   posts: 'table', 
//   tags: 'table',
//   site: 'singleton',
//   ...
// }

// Check if table exists
if (this.database.info.posts === 'table') {
    // Posts table exists
}
```

### Complex Queries with Relationships

```javascript
// Using nested object syntax for relationship queries
const postsWithAppleTags = await this.database.posts
    .where({ tags: { name: 'Apple' } })
    .all();

// Multiple relationship conditions
const postsWithMultipleTags = await this.database.posts
    .where({ tags: { name: 'Apple' } })
    .where({ tags: { name: 'Orange' } })
    .all();

// Accessing related data through model relationships
const post = await this.database.posts.where({ id: postId }).first();
if (post) {
    // Access related tags (if relationship defined in model)
    const tags = await post.tags;
    const author = await post.user;
}
```

### Table Creation (Migrations)

```javascript
// Using database.table() in migrations for table creation and modification
export default {
    async migrate(){
        await this.database.table('posts', async (posts) => {
            await posts.addColumn('title', 'string');
            await posts.addColumn('body', 'text');
            await posts.addColumn('publishedAt', 'datetime', { index: true });
        });
    }
};

// Note: Tables are automatically created when the first column is added
// In most other cases, use direct table access:
// const posts = this.database.posts; // Preferred for normal operations
```

### Error Handling

```javascript
try {
    await this.database.transaction(async () => {
        await this.database.users.insert({
            email: 'duplicate@example.com'  // May violate unique constraint
        });
    });
} catch (error) {
    console.error('Database operation failed:', error.message);
    // Transaction automatically rolled back on error
}
```

### Background Jobs and Database

```javascript
// Safe database access in background jobs
export default {
    async run() {
        // Delete expired tokens using generated scope
        await this.database.usedHashes
            .where({ expiresAtLt: new Date() })
            .delete();
    }
};
```

## Database Configuration

The database service is configured through the application's config:

```javascript
// pinstripe.config.js
export default {
    database: {
        // SQLite configuration
        adapter: 'sqlite',
        filename: './development.db'
        
        // Or MySQL configuration
        // adapter: 'mysql',
        // host: 'localhost',
        // user: 'username',
        // password: 'password',
        // database: 'myapp'
    }
};
```

## Notes

- The database service automatically handles connection pooling and cleanup
- Insert, update, and delete operations are automatically wrapped in transactions
- Column scopes are dynamically generated based on database schema at runtime
- Multi-tenancy is optional and configured through the `@pinstripe/multi-tenant` package  
- The service supports both MySQL and SQLite databases with adapter-specific optimizations
- Schema changes require calling `database.reset()` to refresh the schema cache
- The `database.table(name, fn)` method is used in migrations; tables are automatically created when the first column is added