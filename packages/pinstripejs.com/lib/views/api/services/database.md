# database Service

## Interface

```javascript
{
  // Table Operations
  table(name, fn?) => Table
  union(name) => Union
  singleton(name) => Row
  
  // Query Operations
  run(query) => Promise<Array>
  
  // Transaction & Lock Operations
  transaction(fn) => Promise<any>
  lock(fn) => Promise<any>
  
  // Schema Operations
  migrate() => Promise<void>
  reset() => Promise<void>
  drop() => Promise<void>
  destroy() => Promise<void>
  
  // Metadata
  info => Object
  
  // Utility
  getUnixTimestamp() => Promise<number>
  withoutTenantScope => Database
  
  // Dynamic Table Access (via proxy)
  [tableName] => Table | Row | Union
}
```

## Description

The `database` service provides a high-level abstraction for database operations in Pinstripe applications. It acts as the primary interface for interacting with your application's database, offering both traditional table operations and advanced features like dynamic table access, transactions, migrations, and multi-tenant support.

The service uses a deferred execution model, meaning database operations are only performed when their results are actually needed. This enables efficient query building and lazy loading patterns.

Key features include:
- **Dynamic Table Access**: Access tables, models, and singletons using property syntax
- **Query Builder**: Fluent interface for building complex database queries
- **Transactions & Locking**: Safe concurrent operations with ACID guarantees
- **Schema Management**: Built-in migration and schema evolution support
- **Multi-tenant Support**: Automatic tenant scoping when enabled
- **Lazy Evaluation**: Deferred execution for optimal performance

## Table Types

The database service provides access to three types of database entities:

- **Table**: Regular database tables accessed via `database.tableName`
- **Singleton**: Single-row tables accessed via `database.singletonName`
- **Union**: Abstract tables that combine multiple related tables

## Examples

### Basic Table Operations

```javascript
// In a view or command
export default {
    async render(){
        // Insert a new record
        const user = await this.database.users.insert({
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user'
        });
        
        // Find records with conditions
        const adminUsers = await this.database.users
            .where({ role: 'admin' })
            .all();
            
        // Find single record
        const user = await this.database.users
            .where({ id: userId })
            .first();
            
        // Update records
        await this.database.users
            .where({ id: userId })
            .update({ lastLoginAt: new Date() });
            
        // Delete records
        await this.database.users
            .where({ id: userId })
            .delete();
    }
}
```

### Singleton Access

```javascript
// Access singleton configurations
export default {
    async render(){
        // Get site settings (singleton)
        const site = await this.database.site;
        console.log(site.title); // Access site title
        
        // Update singleton
        await this.database.site.update({
            title: 'New Site Title',
            description: 'Updated description'
        });
        
        // Newsletter settings
        const { enableFree, enableMonthly } = await this.database.newsletter;
    }
}
```

### Query Building

```javascript
export default {
    async render(){
        // Complex queries with conditions
        const posts = await this.database.posts
            .where({ published: true })
            .where('publishedAt', '>', new Date('2023-01-01'))
            .orderBy('publishedAt', 'desc')
            .limit(10)
            .all();
            
        // Count records
        const postCount = await this.database.posts
            .where({ published: true })
            .count();
            
        // Check if records exist
        const hasUnpublished = await this.database.posts
            .where({ published: false })
            .exists();
    }
}
```

### Transactions

```javascript
export default {
    async run(){
        // Safe transaction for related operations
        await this.database.transaction(async () => {
            const user = await this.database.users.insert({
                name: 'John Doe',
                email: 'john@example.com'
            });
            
            await this.database.profiles.insert({
                userId: user.id,
                bio: 'New user profile'
            });
            
            // Both operations succeed or both fail
        });
    }
}
```

### Locking for Concurrency

```javascript
export default {
    async run(){
        // Prevent concurrent modifications
        await this.database.lock(async () => {
            const comment = await this.database.comments
                .where({ id: commentId })
                .first();
                
            if(comment.userId === this.session.user.id){
                await comment.delete();
            }
        });
    }
}
```

### Raw SQL Queries

```javascript
export default {
    async render(){
        // Execute raw SQL when needed
        const results = await this.database.run(`
            SELECT u.name, COUNT(p.id) as post_count 
            FROM users u 
            LEFT JOIN posts p ON u.id = p.userId 
            GROUP BY u.id
        `);
        
        // Parameterized queries
        const users = await this.database.run([
            'SELECT * FROM users WHERE role = ? AND created_at > ?',
            'admin',
            '2023-01-01'
        ]);
    }
}
```

### Database Metadata

```javascript
export default {
    async render(){
        // Get information about available tables and singletons
        console.log(this.database.info);
        // Output: {
        //   users: 'table',
        //   posts: 'table', 
        //   site: 'singleton',
        //   newsletter: 'singleton',
        //   pageables: 'union'
        // }
        
        // Check if multi-tenant is enabled
        if(this.database.info.tenants){
            const tenant = await this.database.tenants
                .where({ id: tenantId })
                .first();
        }
    }
}
```

### Migrations

```javascript
// In a migration file
export default {
    async migrate(){
        // Create table with columns
        await this.database.table('posts', async posts => {
            await posts.addColumn('userId', 'foreign_key');
            await posts.addColumn('title', 'string');
            await posts.addColumn('slug', 'string', { index: true });
            await posts.addColumn('body', 'text');
            await posts.addColumn('published', 'boolean', { 
                index: true, 
                default: false 
            });
            await posts.addColumn('publishedAt', 'datetime');
        });
    }
}
```

### Multi-tenant Operations

```javascript
export default {
    async render(){
        // Operations are automatically scoped to current tenant
        const posts = await this.database.posts.all();
        
        // Access database without tenant scoping
        const allPosts = await this.database.withoutTenantScope.posts.all();
        
        // Find tenant by host
        const tenant = await this.database.tenants
            .where({ host: 'example.com' })
            .first();
    }
}
```

### Form Integration

```javascript
export default {
    render(){
        // Use database objects directly with forms
        return this.renderForm(this.database.pages, {
            fields: [
                { name: 'userId', type: 'forced', value: this.session.user.id },
                'title',
                'body'
            ],
            success({ slug }){
                return this.renderRedirect({ url: `/${slug}` });
            }
        });
    }
}
```

### Background Jobs with Multi-tenant

```javascript
export default {
    async runBackgroundJob(name){
        // Check if multi-tenant is enabled
        if(await this.database.info.tenants){
            // Run job for each tenant
            for(let tenant of await this.database.tenants.all()){
                // Job will be scoped to this tenant
                await this.processForTenant(tenant);
            }
        } else {
            // Single tenant operation
            await this.processSingleTenant();
        }
    }
}
```

### Error Handling

```javascript
export default {
    async render(){
        try {
            const user = await this.database.users
                .where({ email: 'user@example.com' })
                .first();
                
            if(!user){
                throw new Error('User not found');
            }
            
            return user;
        } catch(error) {
            console.error('Database operation failed:', error);
            throw error;
        }
    }
}
```

## Database Commands

The database service integrates with several built-in commands:

```bash
# Run database migrations
pinstripe migrate-database

# Initialize database with migrations and seeds
pinstripe initialize-database  

# Seed database with initial data
pinstripe seed-database

# Drop all database tables
pinstripe drop-database
```

## Notes

- The database service uses deferred execution - operations are only performed when results are awaited
- All table names are automatically available as properties on the database object
- Singleton models provide single-row table access with automatic creation if needed
- Multi-tenant applications automatically scope queries to the current tenant context
- Transactions provide ACID guarantees across multiple operations
- The `lock()` method prevents concurrent access to critical sections
- Raw SQL queries can be used when the query builder is insufficient