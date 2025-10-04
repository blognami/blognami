---
sidebar:
    category: ["Services", "serviceWorker"]
---
# serviceWorker Service

The `serviceWorker` service provides comprehensive service worker functionality for offline-first Progressive Web Applications (PWAs). It handles request interception, parameter extraction, and automatic fallback to network requests when server-side rendering is not available.

## Interface

```javascript
{
    // Lifecycle methods
    start(): void,
    
    // Request parameter extraction
    extractParams(request: Request): Promise<object>,
    extractUrl(request: Request): URL,
    extractUrlParams(request: Request): object,
    extractHeaders(request: Request): object,
    extractBodyParams(request: Request): Promise<object>,
    
    // Service properties
    version: Promise<string>,
    callHandler: CallHandler,
    
    // Meta configuration
    meta(): void  // Configures service for client-side inclusion
}
```

## Description

The `serviceWorker` service is a specialized service that runs in the browser's service worker context to provide offline-first functionality. It intercepts network requests and attempts to handle them server-side using the same request handling pipeline that runs on the server, falling back to network requests when necessary.

### Key Features

1. **Request Interception**: Automatically intercepts all fetch requests in the service worker scope
2. **Parameter Extraction**: Extracts URL parameters, headers, and body data from requests
3. **Server-Side Rendering**: Attempts to render responses using the same callHandler pipeline as the server
4. **Graceful Fallback**: Falls back to network requests when server-side rendering fails
5. **Version Management**: Includes version tracking for cache busting and updates
6. **Client-Side Bundle**: Automatically included in service worker bundles

## Examples

### Basic Service Worker Integration

```javascript
// Automatically started in service worker context
// In pinstripe initialization, this runs automatically:
if(typeof window == 'undefined' && typeof addEventListener == 'function'){
    Workspace.run(({ serviceWorker }) => serviceWorker.start());
}
```

### Service Worker Bundle Generation

```javascript
// Generate service worker JavaScript bundle
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

### Service Worker Registration in HTML

```javascript
// Automatically included in shell HTML
export default {
    async render(){
        const version = await this.version;
        const urlSearchParams = new URLSearchParams({ version });
        
        return this.renderHtml`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="pinstripe-service-worker-url" 
                      content="/service_worker.js?${urlSearchParams}">
            </head>
            <body>
                <!-- Content -->
            </body>
            </html>
        `;
    }
}
```

### Client-Side Service Worker Registration

```javascript
// Automatic registration when service worker is supported
if (typeof navigator != 'undefined' && "serviceWorker" in navigator) {
    (async () => {
        try {
            let scriptUrl = Component.instanceFor(document).head
                .find('meta[name="pinstripe-service-worker-url"]')?.params.content;
            
            if(!scriptUrl) return;

            const registration = await navigator.serviceWorker.getRegistration(scriptUrl);
            if(registration) await registration.unregister();

            await navigator.serviceWorker.register(scriptUrl, {
                scope: "./",
                updateViaCache: "none"
            });
        } catch (error) {
            console.error(`Service worker registration failed with ${error}`);
        }
    })();
}
```

### Custom Parameter Extraction

```javascript
// Service worker with custom parameter handling
export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        return this;
    },
    
    async customRequestHandler(request){
        // Extract parameters using serviceWorker methods
        const params = await this.serviceWorker.extractParams(request);
        const url = this.serviceWorker.extractUrl(request);
        const headers = this.serviceWorker.extractHeaders(request);
        
        // Custom processing
        params.customData = await this.processRequest(request);
        
        // Handle with callHandler
        const [status, responseHeaders, body] = await this.callHandler.handleCall(params);
        
        return new Response(body, { status, headers: responseHeaders });
    }
}
```

### Offline-First Request Handling

```javascript
// The service worker automatically handles requests like this:
addEventListener("fetch", (event) => {
    event.respondWith((async () => {
        const request1 = event.request.clone();
        const request2 = event.request.clone();
        
        try {
            // Extract parameters from request
            const params = await this.extractParams(request1);
            
            // Try to handle server-side
            const [status, headers, body] = await this.callHandler.handleCall(params);
            
            // Return server-side response if successful
            if(status >= 200 && status < 300) {
                return new Response(body, { status, headers });
            }
            
            // Fallback to network
            return fetch(request2);
        } catch (error) {
            if(!(error instanceof MissingResourceError)) throw error;
            console.log(error);
            return fetch(request2);
        }
    })());
});
```

### Version-Aware Service Worker

```javascript
// Service worker with version logging
export default {
    async connectedCallback(){
        // Access version information
        const version = await this.serviceWorker.version;
        console.log(`Service worker version: ${version}`);
        
        // Version is automatically used for cache busting
        this.updateCacheStrategy(version);
    }
}
```

### Request Type Handling

```javascript
// Handle different request types
export default {
    async handleRequest(request){
        const params = await this.serviceWorker.extractParams(request);
        
        // params includes:
        // - URL parameters from query string
        // - Body parameters (form data, JSON)
        // - _method: HTTP method
        // - _url: parsed URL object
        // - _headers: request headers
        
        switch(params._method) {
            case 'GET':
                return this.handleGetRequest(params);
            case 'POST':
                return this.handlePostRequest(params);
            case 'PUT':
                return this.handlePutRequest(params);
            default:
                return this.handleGenericRequest(params);
        }
    }
}
```

### Error Handling and Fallback

```javascript
// Custom error handling in service worker context
export default {
    async processWithFallback(request){
        try {
            const params = await this.serviceWorker.extractParams(request);
            const [status, headers, body] = await this.callHandler.handleCall(params);
            
            if(status >= 200 && status < 300) {
                return new Response(body, { status, headers });
            }
            
            // Handle error responses
            throw new Error(`Server returned ${status}`);
            
        } catch (error) {
            console.warn('Service worker handling failed:', error);
            
            // Fallback strategies
            if(navigator.onLine) {
                return fetch(request);
            } else {
                return this.getCachedResponse(request) || 
                       new Response('Offline', { status: 503 });
            }
        }
    }
}
```

## Advanced Usage Patterns

### Progressive Enhancement

The service worker automatically enhances applications with offline functionality without requiring changes to existing server-side code.

### API Consistency

Requests handled by the service worker use the same parameter extraction and handling logic as server-side requests, ensuring consistent behavior.

### Development vs Production

The service worker includes version information that automatically updates in development mode, enabling seamless updates during development.

### Multi-Format Support

The service worker can handle various request formats:
- URL-encoded form data
- JSON payloads
- Multipart form data
- Query parameters

## Implementation Details

- **Automatic Registration**: Service workers are automatically registered when supported
- **Bundle Integration**: Automatically included in `serviceWorker` bundle target
- **Version Cache Busting**: Uses version service for automatic cache invalidation
- **Graceful Degradation**: Falls back to network requests when offline functionality isn't available
- **Error Boundaries**: Handles errors gracefully with network fallback

## Use Cases

- **Progressive Web Apps**: Enable offline functionality for web applications
- **Performance Optimization**: Cache and serve frequently accessed content
- **Network Resilience**: Provide fallback responses when networks are unreliable
- **Development Experience**: Consistent behavior between server and client environments
- **Static Site Generation**: Use same rendering pipeline for static and dynamic content

## Best Practices

1. **Always Provide Fallback**: Ensure network requests work when service worker fails
2. **Version Management**: Use the version service for proper cache invalidation
3. **Error Handling**: Log errors appropriately but don't break user experience
4. **Performance**: Be mindful of service worker overhead for simple requests
5. **Testing**: Test both online and offline scenarios

## Related Services

- **bundler**: Generates service worker JavaScript bundles
- **callHandler**: Processes requests using the same pipeline as the server
- **version**: Provides version information for cache busting
- **environment**: Determines runtime environment for conditional behavior

## Limitations

- **Browser Support**: Only available in browsers that support service workers
- **HTTPS Requirement**: Service workers require HTTPS in production
- **Scope Limitations**: Service worker scope is limited by registration path
- **Resource Constraints**: Limited by browser memory and storage quotas

## Bundle Integration

The service worker is automatically included in the `serviceWorker` bundle target and can be built using:

```javascript
const { js, map } = await this.bundler.build('serviceWorker');
```

This bundle includes all necessary services and handles the service worker lifecycle automatically.