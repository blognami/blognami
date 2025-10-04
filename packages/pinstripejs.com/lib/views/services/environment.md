---
sidebar:
    category: ["Services", "environment"]
---
# environment Service

The `environment` service provides access to the current runtime environment (typically "development", "production", or "test"). It intelligently handles both server-side and client-side environments, using deferred execution to ensure consistent behavior across different execution contexts.

## Interface

```javascript
// Returns a Promise<string>
await this.environment
```

## Key Features

- **Deferred Execution**: Uses `this.defer()` to ensure proper async handling
- **Universal Access**: Works on both server and client sides
- **Caching**: Implements intelligent caching for performance
- **Default Values**: Falls back to "development" when NODE_ENV is not set
- **Client-Server Sync**: Automatically syncs environment from server to client

## Server-Side Behavior

On the server, the service reads from `process.env.NODE_ENV` and caches the result:

```javascript
// Implementation details (for reference)
return this.defer(async () => {
    if(!cache){
        cache = process.env.NODE_ENV ?? 'development';
    }
    return cache;
});
```

## Client-Side Behavior

On the client, the service fetches the environment from the server via a JSON endpoint and caches it globally:

```javascript
// Implementation details (for reference)
return this.defer(async () => {
    if(!this.context.root.hasOwnProperty('environment')){
        if(!cache) cache = fetch('/_pinstripe/_shell/environment.json').then(response => response.json());
        this.context.root.environment = await cache
    }
    return this.context.root.environment;
});
```

## Common Values

- `"development"` - Default value, used during local development
- `"production"` - Used in production deployments
- `"test"` - Used during automated testing

## Examples

### Basic Environment Check

```javascript
export default {
    async render(){
        const env = await this.environment;
        
        if(env === 'development') {
            return this.renderHtml`<div class="dev-banner">Development Mode</div>`;
        }
        
        return this.renderHtml`<div>Running in ${env} mode</div>`;
    }
}
```

### Conditional Behavior Based on Environment

```javascript
export default {
    async render(){
        const env = await this.environment;
        const isDevelopment = env === 'development';
        const isProduction = env === 'production';
        
        return this.renderHtml`
            <script>
                console.log('Environment: ${env}');
                ${isDevelopment ? 'window.DEBUG = true;' : ''}
                ${isProduction ? 'window.ANALYTICS_ENABLED = true;' : ''}
            </script>
        `;
    }
}
```

### Version Stamping with Environment

```javascript
// Example from the version service showing environment usage
export default {
    create(){
        return this.defer(async () => {
            let version = await this.project.config.version || '0.1.0';
            
            // Add timestamp in development for cache busting
            if(await this.environment === 'development'){
                version += `.${Date.now()}`;
            }
            
            return version;
        });
    }
}
```

### Environment-Specific Configuration

```javascript
export default {
    async render(){
        const env = await this.environment;
        
        const config = {
            development: {
                apiUrl: 'http://localhost:3000/api',
                debug: true,
                logLevel: 'verbose'
            },
            production: {
                apiUrl: 'https://api.example.com',
                debug: false,
                logLevel: 'error'
            },
            test: {
                apiUrl: 'http://localhost:3001/api',
                debug: false,
                logLevel: 'silent'
            }
        };
        
        const currentConfig = config[env] || config.development;
        
        return this.renderHtml`
            <script>
                window.APP_CONFIG = ${JSON.stringify(currentConfig)};
            </script>
        `;
    }
}
```

### Server Endpoint Usage

```javascript
// Server endpoint that returns environment info
export default {
    async render(){
        const env = await this.environment;
        return [200, {'content-type': 'application/json'}, [JSON.stringify(env)]];
    }
}
```

### Client-Side Environment Detection

```javascript
// Client-side component that needs environment info
export default {
    async connectedCallback(){
        const env = await this.environment;
        
        if(env === 'development') {
            // Enable development tools
            this.classList.add('dev-mode');
            console.log('Development mode enabled');
        }
        
        // Environment-specific initialization
        this.initializeForEnvironment(env);
    },
    
    initializeForEnvironment(env){
        switch(env) {
            case 'development':
                this.enableDevTools();
                break;
            case 'production':
                this.enableAnalytics();
                break;
            case 'test':
                this.disableAnimations();
                break;
        }
    }
}
```

### Environment-Based Feature Flags

```javascript
export default {
    async render(){
        const env = await this.environment;
        
        const features = {
            showDebugInfo: env === 'development',
            enableBetaFeatures: env !== 'production',
            logErrors: env === 'production',
            mockExternalServices: env === 'test'
        };
        
        return this.renderView('dashboard', { features });
    }
}
```

## Integration with Other Services

The environment service is commonly used alongside other Pinstripe services:

### With Config Service

```javascript
export default {
    async render(){
        const env = await this.environment;
        const config = await this.config;
        
        // Use environment-specific database
        const dbName = `${config.database.name}_${env}`;
        
        return this.renderHtml`<div>Connected to: ${dbName}</div>`;
    }
}
```

### With Version Service

```javascript
export default {
    async render(){
        const env = await this.environment;
        const version = await this.version;
        
        return this.renderHtml`
            <footer>
                Version: ${version} (${env})
            </footer>
        `;
    }
}
```

## Best Practices

1. **Always Use Await**: The service returns a Promise, so always use `await`
2. **Cache Results**: If you need the environment multiple times in the same method, store it in a variable
3. **Default to Development**: The service defaults to "development" when NODE_ENV is not set
4. **Environment-Specific Logic**: Use clear conditional statements for environment-specific behavior
5. **Client-Server Consistency**: The service ensures the same environment value on both client and server

## Error Handling

The service is designed to be robust and will always return a string value:

```javascript
export default {
    async render(){
        try {
            const env = await this.environment;
            // env will always be a string, defaulting to "development"
            return this.renderView(`${env}-specific-view`);
        } catch (error) {
            // This should rarely happen due to the service's defensive implementation
            console.error('Environment service error:', error);
            return this.renderView('development-specific-view');
        }
    }
}
```

## Related Services

- **config**: Environment-specific configuration values
- **version**: Uses environment to determine version formatting
- **defer**: The underlying mechanism that makes the service work across client/server boundaries