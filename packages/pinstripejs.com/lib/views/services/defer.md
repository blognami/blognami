---
sidebar:
    category: ["Services", "defer"]
---
# defer Service

## Interface

```javascript
defer(fn, path = [])
```

- **`fn`** (`Function`): A function that returns the value to be deferred
- **`path`** (`Array`, optional): Internal parameter for tracking property access chain
- **Returns**: A proxy object that defers execution until accessed

## Description

The `defer` service is a lazy evaluation utility that postpones the execution of expensive operations until their results are actually needed. It creates a proxy object that intercepts property access and method calls, building up a chain of operations that are only executed when the final result is awaited or accessed.

This service is particularly useful for:
- **Lazy loading**: Deferring expensive computations or I/O operations
- **Dependency resolution**: Resolving services that may depend on other async services
- **Performance optimization**: Avoiding unnecessary work when results might not be used
- **Async chaining**: Building complex async operation chains that execute efficiently

## Key Features

- **Lazy Execution**: Functions are only called when results are actually needed
- **Property Access**: Supports chaining property access before execution
- **Method Calls**: Can defer method calls with arguments
- **Async Support**: Fully compatible with async/await patterns
- **Error Handling**: Provides clear error messages when trying to access undefined values
- **Path Tracking**: Maintains execution path for debugging

## Examples

### Basic Lazy Evaluation

```javascript
export default {
    create(){
        // Defer expensive computation
        return this.defer(() => {
            console.log('Computing expensive value...');
            return Math.random() * 1000;
        });
    }
}

// Usage in view
export default {
    async render(){
        const expensiveValue = await this.expensiveService;
        // Only now is the computation performed
        return this.renderHtml`<p>Value: ${expensiveValue}</p>`;
    }
}
```

### Service Dependencies

```javascript
// User service that depends on session
export default {
    create(){
        return this.defer(async () => {
            const session = await this.session;
            if(!session) return;
            return session.user;
        });
    }
}

// Usage with conditional access
export default {
    async render(){
        const user = await this.user;
        if(user) {
            return this.renderHtml`<p>Welcome, ${user.name}!</p>`;
        }
        return this.renderView('login');
    }
}
```

### Function Wrapping

```javascript
// Defer function creation until needed
export default {
    create(){
        return this.defer(() => (...args) => Html.render(...args));
    }
}

// Usage
export default {
    async render(){
        const html = await this.renderHtml`<h1>Title</h1>`;
        return html;
    }
}
```

### Property Chain Access

```javascript
const deferred = defer(() => ({
    user: {
        profile: {
            name: 'John Doe',
            email: 'john@example.com'
        },
        async getSettings(){
            return { theme: 'dark', language: 'en' };
        }
    }
}));

// Chain property access - execution deferred until await
const userName = await deferred.user.profile.name;
// Result: "John Doe"

// Method calls in chain
const settings = await deferred.user.getSettings();
// Result: { theme: 'dark', language: 'en' }
```

### Database Service Pattern

```javascript
export default {
    create(){
        return this.defer(async () => {
            // Only connect to database when actually needed
            this.database = await Database.new(
                await this.context.root.getOrCreate("databaseClient", async () =>
                    Client.new(await this.config.database)
                ),
                this.context
            );

            // Handle multi-tenant setup
            if(this.database.info.tenants){
                const tenantId = this.initialParams._headers['x-tenant-id'];
                if(tenantId) {
                    const tenant = await this.database.tenants.where({ id: tenantId }).first();
                    if(tenant) this.database.tenant = tenant;
                }
            }

            return this.database;
        });
    }
}
```

### Conditional Execution

```javascript
// Boolean service using defer
export default {
    create(){
        return this.defer(async () => !!(await this.user));
    }
}

// Usage
export default {
    async render(){
        if(await this.isSignedIn) {
            return this.renderView('dashboard');
        }
        return this.renderView('login');
    }
}
```

### Environment-Specific Behavior

```javascript
export default {
    create(){
        if(this.isClient) {
            return this.defer(async () => {
                // Client-side implementation
                if(!this.context.root.hasOwnProperty('environment')){
                    const response = await fetch('/_pinstripe/_shell/environment.json');
                    this.context.root.environment = await response.json();
                }
                return this.context.root.environment;
            });
        }
        
        return this.defer(async () => {
            // Server-side implementation
            return process.env.NODE_ENV ?? 'development';
        });
    }
}
```

### Delegation Pattern

```javascript
// Service that delegates to another service
export default {
    create(){
        return (...args) => this.defer(() => this.renderViews(...args));
    },

    async renderViews(...args){
        const lastArg = args[args.length - 1];
        const params = typeof lastArg == 'object' && !Array.isArray(lastArg) ? args.pop() : {};
        const out = [];
        for(const name of await this.matchViews(...args)){
            out.push(await this.renderView(name, params));
        }
        return out;
    }
}
```

### Self-Reference Pattern

```javascript
// Service that returns itself wrapped in defer
export default {
    create(){
        return this.defer(() => this);
    },
    
    build(name = 'window', options = {}){
        return Bundle.create(name).build(options);
    }
}

// Usage
export default {
    async render(){
        const bundler = await this.bundler;
        const bundle = bundler.build('admin');
        return this.renderHtml`<script src="${bundle.url}"></script>`;
    }
}
```

## Error Handling

The defer service provides helpful error messages when trying to access undefined values:

```javascript
const deferred = defer(() => undefined);

try {
    await deferred.someProperty;
} catch(error) {
    // Error: Can't unwrap deferred object.someProperty (object is undefined).
}
```

The error message includes the full property path that was attempted, making debugging easier.

## Performance Considerations

- **Lazy Evaluation**: Operations are only performed when results are actually needed
- **Caching**: The function result is cached after first execution
- **Memory Efficiency**: Avoids creating expensive objects until necessary
- **Async Optimization**: Works efficiently with async/await patterns
- **Path Building**: Property access chains are built efficiently using arrays

## Return Value Details

The defer service returns a Proxy object that:
- Intercepts all property access and method calls
- Builds an execution path as an array
- Only executes the original function when awaited
- Supports both sync and async operations
- Maintains proper `this` context for method calls

## Common Use Cases

### Service Initialization
- Database connections that should only be established when needed
- Configuration loading that depends on environment
- Authentication services that check session state

### Resource Management
- File system operations that may not be needed
- Network requests that should be conditional
- Expensive computations that might be cached

### Dependency Injection
- Services that depend on other async services
- Circular dependency resolution
- Optional service dependencies

### Performance Optimization
- Lazy loading of heavy resources
- Conditional service initialization
- Deferring expensive operations until required