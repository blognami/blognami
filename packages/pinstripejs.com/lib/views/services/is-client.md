---
menus:
    sidebar: ["Services", "isClient"]
---
# isClient Service

The `isClient` service provides a simple boolean indicator to determine whether code is currently executing in a client-side (browser) or server-side (Node.js) environment. This service is essential for implementing universal/isomorphic applications where the same code needs to behave differently on client and server.

## Interface

```javascript
// Returns a boolean value
this.isClient  // boolean (not a Promise)
```

## Key Features

- **Simple Boolean Value**: Returns `true` on client-side, `false` on server-side
- **Synchronous Access**: No need to `await` - returns an immediate boolean value
- **Conditional Compilation**: Uses Pinstripe's build-time transformation to provide different values per environment
- **Universal Access**: Available in all views and services through `this.isClient`
- **Build-Time Optimization**: The boolean value is determined at build time, not runtime

## Implementation Details

The service uses Pinstripe's conditional compilation system with `pinstripe-if-client` comments:

```javascript
export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        return false; // pinstripe-if-client: return true;
    }
};
```

During the build process:
- **Server bundle**: Returns `false`
- **Client bundle**: The comment is processed and the line becomes `return true;`

## Usage Patterns

The `isClient` service is commonly used for:

1. **Environment-specific service implementations**
2. **Conditional data fetching strategies**
3. **Feature detection and progressive enhancement**
4. **Resource loading decisions**

## Examples

### Basic Environment Detection

```javascript
export default {
    async render(){
        if(this.isClient) {
            // Client-side only code
            console.log('Running in browser');
            this.setupEventListeners();
        } else {
            // Server-side only code
            console.log('Running on server');
            this.setupServerResources();
        }
        
        return this.renderView('my-component');
    }
}
```

### Conditional Service Implementation

This is the most common pattern, seen in services like `environment`, `version`, and `featureFlags`:

```javascript
export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        if(this.isClient) {
            // Client-side implementation - fetch from server
            return this.defer(async () => {
                if(!this.context.root.hasOwnProperty('environment')){
                    const response = await fetch('/_pinstripe/_shell/environment.json');
                    this.context.root.environment = await response.json();
                }
                return this.context.root.environment;
            });
        }
        
        // Server-side implementation - read from process.env
        return this.defer(async () => {
            return process.env.NODE_ENV ?? 'development';
        });
    }
};
```

### Progressive Enhancement

```javascript
export default {
    async connectedCallback(){
        // Basic functionality works everywhere
        this.setupBasicFeatures();
        
        if(this.isClient) {
            // Enhanced client-side features
            this.setupInteractiveFeatures();
            this.enableKeyboardShortcuts();
            this.startPolling();
        }
    },
    
    setupBasicFeatures(){
        // Works on both client and server
        this.textContent = 'Basic content';
    },
    
    setupInteractiveFeatures(){
        // Client-only enhancements
        this.addEventListener('click', this.handleClick);
        this.classList.add('interactive');
    }
}
```

### Data Fetching Strategy

```javascript
export default {
    async loadData(){
        if(this.isClient) {
            // Client-side: fetch from API
            const response = await fetch('/api/data');
            return await response.json();
        } else {
            // Server-side: direct database access
            return await this.database.query('SELECT * FROM data');
        }
    }
}
```

### Feature Flag Implementation

```javascript
export default {
    create(){
        if(this.isClient) {
            return this.defer(async () => {
                // Client gets feature flags from server endpoint
                if(!this.context.root.hasOwnProperty('featureFlags')){
                    const response = await fetch('/_pinstripe/_shell/feature_flags.json');
                    this.context.root.featureFlags = await response.json();
                }
                return this.context.root.featureFlags;
            });
        }
        
        return this.defer(async () => {
            // Server reads from config or headers
            let { featureFlags = defaultCallback } = await this.config;
            if(typeof featureFlags == 'function') {
                featureFlags = await featureFlags.call(this);
            }
            return featureFlags;
        });
    }
};
```

### Conditional Resource Loading

```javascript
export default {
    async render(){
        let styles = '';
        let scripts = '';
        
        if(!this.isClient) {
            // Server-side: include all resources for initial render
            styles = await this.renderView('critical-styles');
            scripts = await this.renderView('essential-scripts');
        } else {
            // Client-side: lazy load resources
            this.loadResourcesAsync();
        }
        
        return this.renderView('layout', { styles, scripts });
    }
}
```

## Integration with Other Services

The `isClient` service is frequently used alongside:

- **`defer`**: For conditional async execution
- **`environment`**: For environment-specific behavior
- **`config`**: For loading configuration data
- **`featureFlags`**: For feature toggling
- **`initialParams`**: For request context

## Comparison with Constants

While Pinstripe also provides `IS_CLIENT` and `IS_SERVER` constants from `@pinstripe/utils`, the `isClient` service is preferred in views and services because:

1. **Consistent API**: Follows the same pattern as other services
2. **Context Integration**: Available through `this.isClient`
3. **Build Optimization**: Leverages Pinstripe's conditional compilation
4. **Service Ecosystem**: Integrates seamlessly with other services

```javascript
// Using constants (less preferred in services)
import { IS_CLIENT } from '@pinstripe/utils';

// Using service (preferred)
if(this.isClient) { /* ... */ }
```

## Best Practices

1. **Use for Different Implementations**: Ideal when client and server need completely different approaches
2. **Combine with Defer**: Often used with `this.defer()` for async operations
3. **Progressive Enhancement**: Start with server-compatible code, enhance on client
4. **Avoid Overuse**: Don't use for simple feature detection that could be handled with standard web APIs
5. **Cache Results**: The boolean value doesn't change during execution, so it's safe to store

## Error Handling

Since `isClient` returns a simple boolean, error handling is minimal:

```javascript
export default {
    async render(){
        // isClient is always a boolean, no error handling needed
        const isClientSide = this.isClient;
        
        if(isClientSide) {
            // Client-side code might need error handling
            try {
                await this.setupClientFeatures();
            } catch (error) {
                console.error('Client setup failed:', error);
            }
        }
    }
}
```

## Related Services

- **`defer`**: Used for conditional async execution
- **`environment`**: Environment detection that uses `isClient`
- **`version`**: Version service that uses `isClient`
- **`featureFlags`**: Feature flags service that uses `isClient`
- **`initialParams`**: Request parameters (server-side context)

## Technical Notes

- The service value is determined at **build time**, not runtime
- Uses Pinstripe's conditional compilation system
- The bundler processes `pinstripe-if-client` comments during build
- Results in zero runtime overhead for environment detection
- Client and server bundles contain different implementations