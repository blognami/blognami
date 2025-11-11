---
menus:
    sidebar: ["Services", "repl"]
---
# repl Service

The `repl` service provides an interactive Read-Eval-Print Loop (REPL) environment for debugging and exploring Pinstripe applications. It creates a Node.js REPL with all registered services automatically available in the context, enabling developers to interactively inspect and test application components.

## Interface

```javascript
this.repl.start()
```

- **Returns**: Promise that resolves when the REPL session ends (user exits)

## Description

The `repl` service is built on top of Node.js's native REPL module and provides:

1. **Interactive JavaScript environment** with full access to Pinstripe services
2. **Automatic service injection** making all registered services available as global variables
3. **Async/await support** for working with asynchronous service operations
4. **Custom object inspection** with support for `__inspect` and `__beforeInspect` methods
5. **VM context isolation** ensuring proper execution environment
6. **Graceful exit handling** with proper cleanup

The service is primarily used for development, debugging, and exploring application state interactively.

## Key Features

- **All Services Available**: Every service registered in `ServiceFactory.names` is automatically available as a variable
- **Async Support**: Full support for async/await operations
- **Custom Output**: Support for custom object inspection via `__inspect` methods
- **Isolated Execution**: Commands run in a VM context for safety
- **Development Tool**: Intended for development and debugging workflows

## CLI Usage

The repl service is accessed through the Pinstripe CLI:

```bash
# Start an interactive REPL session
npx pinstripe start-repl
```

## Service Implementation

The service is implemented with:

```javascript
import Repl from 'repl';
import * as vm from 'vm';
import * as util from 'util';
import { ServiceFactory } from '../service_factory.js';

export default {
    create(){
        return this;
    },
    
    async start(){
        // Implementation details...
    }
}
```

## Examples

### Basic REPL Usage

Start a REPL session and explore services:

```bash
$ npx pinstripe start-repl
pinstripe > 
```

### Exploring Database Service

```javascript
// In the REPL
pinstripe > const db = await database
pinstripe > await db.users.count()
0

pinstripe > const user = await db.users.insert({
...   name: 'Test User',
...   email: 'test@example.com'
... })

pinstripe > await db.users.count()
1

pinstripe > await db.users.where({ email: 'test@example.com' }).first()
{ id: 1, name: 'Test User', email: 'test@example.com', ... }
```

### Working with Configuration

```javascript
// Check application configuration
pinstripe > const cfg = await config
pinstripe > cfg.database
{ adapter: 'sqlite', database: 'my_app_development.db' }

pinstripe > cfg.server
{ port: 3000, limits: { ... } }
```

### Testing View Rendering

```javascript
// Render views interactively
pinstripe > const html = await renderView('users/index', { users: [] })
pinstripe > console.log(html)
<div class="users-index">...</div>

// Test view with parameters
pinstripe > await renderView('users/show', { user: { name: 'Test' } })
```

### Inspecting Project Information

```javascript
// Explore project details
pinstripe > const proj = await project
pinstripe > proj.name
'my-pinstripe-app'

pinstripe > proj.rootPath
'/path/to/my-pinstripe-app'

pinstripe > await environment
'development'
```

### Working with Models

```javascript
// Create and work with models
pinstripe > const User = createModel({
...   tableName: 'users',
...   get fullName() {
...     return `${this.firstName} ${this.lastName}`;
...   }
... })

pinstripe > const user = User.new({ firstName: 'John', lastName: 'Doe' })
pinstripe > user.fullName
'John Doe'
```

### Testing Background Jobs

```javascript
// Run background jobs interactively
pinstripe > await runBackgroundJob('send-newsletter')
Newsletter job completed successfully

// Check available background jobs
pinstripe > // Background jobs are available through the service
```

### Service Exploration

```javascript
// Explore available services
pinstripe > Object.keys(this).filter(k => typeof this[k] === 'object')
['database', 'config', 'renderView', 'environment', ...]

// Check service factory names
pinstripe > // All ServiceFactory.names are automatically available
```

## Advanced Usage Patterns

### Custom Object Inspection

Objects can implement custom inspection methods:

```javascript
// Object with custom inspection
pinstripe > const customObj = {
...   value: 'hidden',
...   __inspect() {
...     return `CustomObject(${this.value})`;
...   }
... }

pinstripe > customObj
CustomObject(hidden)
```

### Async Operations

The REPL fully supports async/await:

```javascript
// Chain async operations
pinstripe > const users = await database.then(db => db.users.limit(5).all())
pinstripe > users.length
5

// Use in complex expressions
pinstripe > const isProduction = await environment === 'production'
pinstripe > isProduction
false
```

### Workspace Context

The REPL runs within a Workspace context, giving access to all services:

```javascript
// Access workspace methods
pinstripe > await runCommand('list-services')
// Lists all available services

pinstripe > await runBackgroundJob('maintenance')
// Runs a background job
```

## Implementation Details

### Service Injection

All services are made available through property getters:

```javascript
ServiceFactory.names.forEach(name => {
    Object.defineProperty(repl.context, name, {
        get: () => this[name]
    });
});
```

### VM Context

Commands are executed in a VM context for isolation:

```javascript
result = await vm.runInContext(cmd, context);
```

### Custom Evaluation

The REPL supports custom evaluation with async support:

```javascript
async eval(cmd, context, filename, callback) {
    if(cmd.length > 1){
        let result;
        try {
            result = await vm.runInContext(cmd, context);
            if(result != null && typeof result.__beforeInspect == 'function'){
                await result.__beforeInspect();
            }
            callback(null, result);
        } catch (e) {
            callback(e);
        }
    } else {
        callback();
    }
}
```

## Use Cases

### Development and Debugging
- **Interactive Testing**: Test services and models without writing test files
- **Data Exploration**: Examine database contents and structure
- **Configuration Debugging**: Inspect configuration values and service setup

### Application Exploration
- **Service Discovery**: Explore available services and their capabilities
- **View Testing**: Test view rendering with different parameters
- **Model Validation**: Test model behavior and relationships

### Prototyping
- **Feature Development**: Prototype new features interactively
- **API Testing**: Test service APIs before writing application code
- **Data Manipulation**: Perform one-off data operations

## Best Practices

1. **Use for Development Only**: The REPL is intended for development environments only
2. **Explore Services**: Use the REPL to understand service capabilities and APIs
3. **Test Async Operations**: Take advantage of async/await support for service testing
4. **Exit Cleanly**: Use Ctrl+C or `.exit` to properly exit the REPL session

## Limitations

- **Server-Side Only**: The REPL service is not available on the client-side
- **Development Tool**: Not intended for production use
- **Single Session**: Only one REPL session can run at a time per process

## Related Services

- **`runCommand`**: Execute CLI commands from within the REPL
- **`runBackgroundJob`**: Run background jobs interactively
- **All Services**: Every registered service is automatically available

## Command Integration

The REPL is accessed through the `start-repl` command:

```javascript
// packages/pinstripe/lib/commands/start_repl.js
export default {
    async run(){
        await this.repl.start()
    }
};
```

This command is available via the Pinstripe CLI and provides the entry point to the interactive REPL environment.