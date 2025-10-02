# database Service

The `database` service provides access to the application's database layer, offering a high-level ORM-like interface for interacting with MySQL and SQLite databases. It supports dynamic table access, relationships, migrations, transactions, and multi-tenancy.

## Interface

The database service provides the following interface:

### Core Methods
- `database.run(query)` - Execute raw SQL queries
- `database.migrate()` - Run database migrations
- `database.drop()` - Drop all database tables
- `database.reset()` - Reset database schema cache
- `database.destroy()` - Close database connection
- `database.lock(fn)` - Execute function with database lock
- `database.transaction(fn)` - Execute function within transaction

### Dynamic Table Access
- `database[tableName]` - Access table by name (returns Table instance)
- `database.table(name, fn)` - Create table instance with optional callback
- `database.union(name)` - Create union query across multiple tables
- `database.singleton(name)` - Access singleton record (auto-created if missing)

### Schema Information
- `database.info` - Object containing table/singleton mappings
- `database.getUnixTimestamp()` - Get current database timestamp

### Multi-tenant Support
- `database.withoutTenantScope` - Access database without tenant filtering
- `database.tenant` - Current tenant context (when multi-tenancy enabled)

## Table Methods

Tables accessed via `database[tableName]` provide:

### Query Methods
- `table.where(conditions)` - Add WHERE conditions
- `table.orderBy(column, direction)` - Add ORDER BY clause
- `table.paginate(page, pageSize)` - Add pagination
- `table.all()` - Get all matching records
- `table.first()` - Get first matching record
- `table.count()` - Count matching records

### CRUD Operations
- `table.insert(fields, options)` - Insert new record
- `table.update(fields, options)` - Update matching records
- `table.delete()` - Delete matching records

### Dynamic Scopes
Tables automatically generate query scopes for each column:
- `table.columnNameEq(value)` - WHERE column = value
- `table.columnNameNe(value)` - WHERE column != value
- `table.columnNameGt(value)` - WHERE column > value
- `table.columnNameLt(value)` - WHERE column < value
- `table.columnNameIn(values)` - WHERE column IN (values)

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
const admins = await this.database.users.roleEq('admin').all();

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
    .titleEq('My Post')           // WHERE title = 'My Post'
    .statusIn(['published', 'draft'])  // WHERE status IN ('published', 'draft')
    .createdAtGt('2023-01-01')    // WHERE createdAt > '2023-01-01'
    .all();

// Multiple conditions
const users = await this.database.users
    .emailNe('admin@example.com')  // WHERE email != 'admin@example.com'
    .roleEq('user')               // AND role = 'user'
    .all();
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

// With parameters (varies by database adapter)
const user = await this.database.run('SELECT * FROM users WHERE email = ?', ['john@example.com']);
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

// Get current tenant
if (this.database.tenant) {
    console.log(`Current tenant: ${this.database.tenant.name}`);
}
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
// Using table callback for complex operations
await this.database.table('posts', async (posts) => {
    return posts
        .where({ status: 'published' })
        .orderBy('createdAt', 'desc')
        .paginate(1, 5)
        .all();
});

// Joining with tag relationships
const post = await this.database.posts.where({ id: postId }).first();
if (post) {
    // Access related tags (if relationship defined in model)
    const tags = await post.tags;
}
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
        // Use lock to prevent concurrent execution
        await this.database.lock(async () => {
            const expiredTokens = await this.database.usedHashes
                .where({ expiresAt: { '<': new Date() } })
                .all();
                
            for (const token of expiredTokens) {
                await token.delete();
            }
        });
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
- All insert/update/delete operations are wrapped in transactions
- Column scopes are dynamically generated based on database schema
- Multi-tenancy is optional and configured through the `@pinstripe/multi-tenant` package  
- The service supports both MySQL and SQLite databases with adapter-specific optimizations
- Schema changes require calling `database.reset()` to refresh the cache