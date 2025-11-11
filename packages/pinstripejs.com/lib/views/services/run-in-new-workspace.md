---
menus:
    sidebar: ["Services", "runInNewWorkspace"]
---
# runInNewWorkspace Service

The `runInNewWorkspace` service provides **workspace isolation** by executing functions in completely fresh workspace contexts. It's essentially a convenient wrapper around `Workspace.run()` that creates a new, isolated environment for function execution without affecting the current workspace state.

## Interface

```javascript
this.runInNewWorkspace(fn)
```

- **`fn`** (`AsyncFunction`): The function to execute in a new workspace context
- **Returns**: Promise resolving to the return value of the function

### Function Signature

```javascript
await this.runInNewWorkspace(async function() {
    // Function executes in a fresh workspace context
    // `this` refers to the new workspace instance
    // Has access to all services: this.database, this.sendMail, etc.
    return result;
});
```

## Description

The `runInNewWorkspace` service provides **complete workspace isolation** by:

1. **Creates fresh workspace contexts** with completely isolated state and resources
2. **Preserves service availability** ensuring the new workspace has access to all services
3. **Manages context lifecycle** with automatic cleanup when the function completes
4. **Enables safe concurrent operations** by preventing state conflicts between contexts
5. **Isolates database connections** and other shared resources per workspace
6. **Handles errors gracefully** with proper resource cleanup even on failures

The service is particularly useful for:
- **Background task execution** that shouldn't affect the current request context
- **Database locking scenarios** where operations need separate connection pools
- **Email sending** or other I/O operations that can run independently
- **Parallel processing** where multiple operations need isolated state
- **User notification systems** that process data independently of user actions
- **Testing scenarios** where clean state isolation is required

## Key Features

### Complete Isolation
- Each function execution gets a fresh workspace instance
- No shared state between the current workspace and the new one
- Separate database connections and resource pools
- Independent service instances

### Resource Management
- Automatic resource cleanup when function completes
- Proper error isolation - failures don't affect calling context
- Memory management with context destruction after execution

### Service Availability
- All services are available in the new workspace context
- Database, email, configuration, and custom services work normally
- Service instances are fresh but fully configured

## Examples

### Background User Notifications

```javascript
// Send notifications without blocking the main request
export default {
    async success({ id }) {
        // Trigger notifications in background without affecting response
        this.notifyUsers({ commentId: id, currentUserId: await this.user.id });
        
        return this.renderRedirect({ target: '_top' });
    },

    async notifyUsers({ commentId, currentUserId }) {
        await this.runInNewWorkspace(async function() {
            // Runs in isolated context - won't affect main request
            const comment = await this.database.comments.where({ id: commentId }).first();
            if (!comment) return;
            
            const users = await this.database.users.where({ 
                idNe: currentUserId, 
                role: 'admin' 
            }).all();
            
            for (const user of users) {
                await user.notify(({ line }) => {
                    line(`New comment: ${comment.body}`);
                });
            }
        });
    }
};
```

### Email Sending in Background

```javascript
// Send welcome email without blocking sign-in flow
export default {
    async signInUser(email) {
        const user = await this.database.users.where({ email }).first();
        
        // Send welcome email in background
        this.runInNewWorkspace(({ sendMail }) => sendMail({ 
            to: email,
            subject: 'Welcome!',
            text({ line }) {
                line('Welcome to our platform!');
            }
        }));
        
        // Continue with main flow immediately
        return this.renderRedirect({ url: '/dashboard' });
    }
};
```

### Database Locking with Isolation

```javascript
// Prevent database lock conflicts in tests
test('database.lock with workspace isolation', () => Workspace.run(async function() {
    await Promise.all([
        // Lock in current workspace
        this.database.lock(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        }),
        
        // Lock in separate workspace - won't conflict
        this.runInNewWorkspace(async function() {
            await this.database.lock(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
            });
        })
    ]);
}));
```

### Multi-User Processing

```javascript
// Process subscriber notifications independently
export default {
    async notifySubscribers() {
        const { id: postId, _url: baseUrl } = this.params;
        
        await this.runInNewWorkspace(async function() {
            const post = await this.database.posts.where({ id: postId }).first();
            if (!post) return;
            
            const { title, slug } = post;
            const url = new URL(`/${slug}`, baseUrl);
            
            // Process subscribers in batches
            let page = 1;
            while (true) {
                const users = await this.database.users
                    .where({ subscriptions: { tier: ['free', 'paid'] } })
                    .paginate(page, 100)
                    .all();
                    
                if (users.length === 0) break;
                
                for (const user of users) {
                    await user.notify(({ line }) => {
                        line(`New post: "${title}"`);
                        line(`Read at: ${url}`);
                    });
                }
                
                page++;
            }
        });
    }
};
```

### Parallel Data Processing

```javascript
// Process multiple data streams concurrently
export default {
    async processUserData(userIds) {
        // Process each user in isolated workspace to prevent conflicts
        const results = await Promise.all(
            userIds.map(userId =>
                this.runInNewWorkspace(async function() {
                    const user = await this.database.users.where({ id: userId }).first();
                    
                    // Complex processing that might conflict if shared
                    await this.runCommand('generate-user-report', { userId });
                    await this.runCommand('update-user-metrics', { userId });
                    
                    return { userId, processed: true };
                })
            )
        );
        
        return results;
    }
};
```

### Testing with Clean State

```javascript
// Each test gets completely isolated database state
import { Workspace } from 'pinstripe';

test('user creation', () => Workspace.run(async function() {
    // Main test workspace
    const user1 = await this.database.users.insert({ name: 'User 1' });
    
    // Isolated test - won't see user1
    await this.runInNewWorkspace(async function() {
        const count = await this.database.users.count(); // 0
        const user2 = await this.database.users.insert({ name: 'User 2' });
        // user2 won't be visible in main workspace
    });
    
    // Back in main workspace - only sees user1
    const mainCount = await this.database.users.count(); // 1
}));
```

## Implementation Details

The service is implemented as a simple wrapper around the `Workspace.run()` method:

```javascript
// packages/pinstripe/lib/services/run_in_new_workspace.js
import { Workspace } from '../workspace.js';

const runInNewWorkspace = fn => Workspace.run(fn);

export default {
    meta(){
        this.addToClient(); // Available in browser contexts
    },
    
    create(){
        return runInNewWorkspace;
    }
};
```

### Underlying Workspace.run() Process

1. **Import Resolution**: Ensures all modules are loaded with `importAll()`
2. **Context Creation**: Creates a new `Context` instance for resource management
3. **Workspace Instantiation**: Creates a new workspace instance with the context
4. **Function Execution**: Calls the provided function with the workspace as `this`
5. **Resource Cleanup**: Automatically destroys the context and cleans up resources

### Context Lifecycle

```javascript
// Simplified internal flow
async run(fn) {
    await importAll();
    return await Context.new().run(async context => {
        const workspace = this.new(context);
        try {
            return await fn.call(workspace, workspace);
        } finally {
            // Context.run() handles cleanup automatically
            await context.destroy();
        }
    });
}
```

## Use Cases

### Background Processing
- **Email delivery** without blocking user responses
- **User notifications** that can be processed asynchronously
- **Data exports** or report generation
- **Image processing** or file uploads

### Concurrency Control
- **Database locking** scenarios where separate connections prevent conflicts
- **Multi-tenant processing** where each tenant needs isolated context
- **Parallel operations** that might interfere with shared state
- **Resource-intensive operations** that need dedicated connections

### Testing Scenarios
- **Test isolation** ensuring tests don't affect each other
- **Database state management** with clean slate for each test case
- **Service mocking** where different tests need different service configurations
- **Integration testing** with controlled environment setup

### Development Tools
- **REPL experimentation** where you want to test without affecting current state
- **Database migrations** that need isolated transaction contexts
- **Development utilities** that manipulate data independently

## Performance Considerations

### Resource Overhead
- Each workspace creates new service instances and database connections
- Context creation has overhead - use judiciously for truly isolated operations
- Consider connection pool limits when running many concurrent workspaces

### Memory Management
- Workspaces are automatically cleaned up after function completion
- Long-running functions should be mindful of memory usage
- Large data processing should consider streaming or batching

### Database Connections
- Each workspace gets separate database connections
- Connection pools may limit concurrent workspace count
- Database locks work independently across workspaces

## Related Services

- **`runCommand`** - Executes commands in forked contexts (lighter isolation)
- **`runBackgroundJob`** - Executes background jobs using workspace isolation internally
- **`database`** - Benefits from workspace isolation for connection management
- **`bot`** - Uses workspace isolation for scheduled job execution

## Best Practices

### Use for True Isolation Needs
Only use `runInNewWorkspace` when you need complete isolation:

```javascript
// Good: Background processing that shouldn't affect request
await this.runInNewWorkspace(async function() {
    await this.sendMail({ to: user.email, subject: 'Welcome!' });
});

// Overkill: Simple data access that doesn't need isolation
const user = await this.database.users.where({ id }).first();
```

### Error Handling
Wrap calls in try-catch when you need to handle failures:

```javascript
try {
    await this.runInNewWorkspace(async function() {
        await this.processLargeDataset();
    });
} catch (error) {
    console.error('Background processing failed:', error);
    // Handle gracefully without affecting main flow
}
```

### Resource Awareness
Be mindful of resource usage with concurrent workspaces:

```javascript
// Good: Process in controlled batches
const batches = chunk(userIds, 10);
for (const batch of batches) {
    await Promise.all(batch.map(userId =>
        this.runInNewWorkspace(async function() {
            await this.processUser(userId);
        })
    ));
}

// Problematic: May exhaust connection pool
await Promise.all(allUserIds.map(userId =>
    this.runInNewWorkspace(async function() {
        await this.processUser(userId);
    })
));
```

### Context Awareness
Remember that workspaces are completely isolated:

```javascript
// Variables from parent context are not automatically available
const currentUser = await this.user;

await this.runInNewWorkspace(async function() {
    // currentUser is not available here
    // Must re-fetch or pass as parameter
    const user = await this.database.users.where({ id: currentUser.id }).first();
});
```

## Client-Side Availability

The service is marked with `addToClient()`, making it available in browser environments for client-side workspace isolation needs.