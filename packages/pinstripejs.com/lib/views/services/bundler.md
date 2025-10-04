---
sidebar:
    category: ["Services", "bundler"]
---
# bundler Service

## Interface

```javascript
{
    create(): DeferredBundler,
    build(name?: string, options?: object): Promise<Bundle>
}
```

### Parameters

- **name** (string, optional): The bundle environment name. Defaults to `'window'`. Built-in environments:
  - `'window'` - Client-side browser bundle
  - `'serviceWorker'` - Service worker bundle for offline functionality
- **options** (object, optional): Build configuration options
  - **force** (boolean): Force rebuild even if a cached build exists

### Return Value

Returns a Promise that resolves to a Bundle object:

```javascript
{
    js: string,    // The bundled JavaScript code
    map: string    // The source map as JSON string
}
```

## Description

The `bundler` service is a powerful JavaScript bundling system that:

1. **Compiles JavaScript modules** using ESBuild to create optimized client-side bundles
2. **Manages multiple environments** with separate bundles for `window` (browser) and `serviceWorker` contexts
3. **Handles client-side code injection** by automatically including services and views marked with `addToClient()`
4. **Provides source maps** for debugging bundled code in development
5. **Caches builds** to avoid unnecessary recompilation on subsequent requests
6. **Processes conditional compilation** using `pinstripe-if-client` comments for environment-specific code
7. **Supports hot module replacement** during development with force rebuild options

The service is deferred, meaning it returns a promise that resolves to the bundler instance, allowing for lazy initialization and proper dependency management.

## Examples

### Basic Bundle Generation

```javascript
// Generate a window (browser) bundle
export default {
    async render(){
        const { js, map } = await this.bundler.build('window');
        return this.renderHtml`
            <script>${js}</script>
            <script>console.log('Source map:', ${map})</script>
        `;
    }
}
```

### Service Worker Bundle

```javascript
// Generate service worker bundle for offline functionality
export default {
    async render(){
        const { js } = await this.bundler.build('serviceWorker');
        return [200, { 
            'content-type': 'text/javascript' 
        }, [ 
            `${js}\n//# sourceMappingURL=/service-worker.js.map` 
        ]];
    }
}
```

### Bundle with Source Maps

```javascript
// Serve JavaScript with source map reference
export default {
    async render(){
        const bundle = await this.bundler.build('window');
        
        // Serve the main JavaScript file
        if(this.url.pathname.endsWith('.js')){
            return [200, { 
                'content-type': 'text/javascript' 
            }, [ 
                `${bundle.js}\n//# sourceMappingURL=${this.url.pathname}.map` 
            ]];
        }
        
        // Serve the source map
        if(this.url.pathname.endsWith('.js.map')){
            return [200, { 
                'content-type': 'application/json' 
            }, [ 
                bundle.map 
            ]];
        }
    }
}
```

### Force Rebuild During Development

```javascript
// Force rebuild for development hot reloading
export default {
    async render(){
        const isDevelopment = process.env.NODE_ENV !== 'production';
        
        const { js } = await this.bundler.build('window', { 
            force: isDevelopment 
        });
        
        return this.renderHtml`
            <script>
                ${js}
                ${isDevelopment ? '// Development build - recompiled' : ''}
            </script>
        `;
    }
}
```

### Custom Bundle Environment

```javascript
// Create bundle for a custom environment (advanced usage)
export default {
    async render(){
        // This would require extending Bundle.addModule() calls
        // to register modules for your custom environment
        const { js } = await this.bundler.build('admin');
        
        return this.renderHtml`
            <script type="module">
                ${js}
            </script>
        `;
    }
}
```

### Conditional Asset Loading

```javascript
// Load different bundles based on user agent or features
export default {
    async render(){
        const isServiceWorkerSupported = this.headers['user-agent']
            ?.includes('Chrome') || this.headers['user-agent']?.includes('Firefox');
            
        if(isServiceWorkerSupported){
            const { js } = await this.bundler.build('serviceWorker');
            return this.renderHtml`
                <script>
                    navigator.serviceWorker.register('/service-worker.js');
                </script>
            `;
        }
        
        // Fallback to regular window bundle
        const { js } = await this.bundler.build('window');
        return this.renderHtml`<script>${js}</script>`;
    }
}
```

### Bundle Size Optimization

```javascript
// Check bundle size and provide alternatives
export default {
    async render(){
        const bundle = await this.bundler.build('window');
        const bundleSize = new TextEncoder().encode(bundle.js).length;
        
        if(bundleSize > 100000){ // 100KB threshold
            console.warn(`Bundle size is ${bundleSize} bytes - consider code splitting`);
        }
        
        return this.renderHtml`
            <script>
                ${bundle.js}
                console.log('Bundle loaded: ${bundleSize} bytes');
            </script>
        `;
    }
}
```

### Integration with HTML Templates

```javascript
// Embed bundles in full HTML pages
export default {
    async render(){
        const windowBundle = await this.bundler.build('window');
        const serviceWorkerBundle = await this.bundler.build('serviceWorker');
        
        return this.renderHtml`
            <!DOCTYPE html>
            <html>
            <head>
                <title>My App</title>
            </head>
            <body>
                <div id="app"></div>
                
                <script>
                    // Main application bundle
                    ${windowBundle.js}
                </script>
                
                <script>
                    // Register service worker
                    if('serviceWorker' in navigator){
                        navigator.serviceWorker.register('/sw.js');
                    }
                </script>
            </body>
            </html>
        `;
    }
}
```

## Common Use Cases

### Client-Side Application Loading
- **Single Page Apps**: Bundle all client-side JavaScript for SPAs
- **Progressive Web Apps**: Generate service worker bundles for offline functionality
- **Component Libraries**: Package reusable UI components for browser consumption
- **Interactive Features**: Bundle JavaScript for dynamic page interactions

### Development Workflow
- **Hot Module Replacement**: Force rebuild during development for instant updates
- **Source Map Generation**: Debug bundled code with proper source mapping
- **Environment-Specific Code**: Conditional compilation for client vs server code
- **Asset Pipeline**: Integrate with build systems and deployment processes

### Performance Optimization
- **Code Splitting**: Generate separate bundles for different application areas
- **Lazy Loading**: Create bundles that can be loaded on demand
- **Cache Management**: Leverage built-in caching to avoid unnecessary rebuilds
- **Minification**: Automatic minification in production environments

## Performance Notes

- Bundles are cached after first build - use `force: true` option to rebuild
- ESBuild provides fast compilation with minimal overhead
- Source maps are generated for all bundles to aid in debugging
- Minification is automatically enabled in production environments
- Bundle size scales with the number of included modules and dependencies
- The service uses temporary directories for build artifacts that are cleaned up automatically

## Technical Details

The bundler service wraps the underlying `Bundle` class and provides:

- **Deferred initialization** through the `defer()` method
- **ESBuild integration** for fast JavaScript compilation
- **Plugin system** for conditional compilation using `pinstripe-if-client` comments
- **Module registration** system for including services and views in client bundles
- **Source map support** for debugging bundled code
- **Environment separation** with distinct module collections for different contexts

The service automatically includes framework code and any services/views marked with `addToClient()` in the appropriate bundle environments.