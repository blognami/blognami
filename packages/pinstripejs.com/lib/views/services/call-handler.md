---
menus:
    sidebar: ["Services", "callHandler"]
---
# callHandler Service

## Interface

```javascript
this.callHandler.handleCall(params = {}, useContext = false)
```

- **`params`** (`Object`, optional): Request parameters containing URL, method, headers, and body data
- **`useContext`** (`Boolean`, optional): Whether to use the current workspace context or create a new one
- **Returns**: Promise resolving to `[status, headers, body]` response array

### Parameter Structure

```javascript
params = {
    _url: URL,           // URL object representing the request URL
    _method: String,     // HTTP method (default: 'get')
    _headers: Object,    // Request headers object
    ...additionalParams  // Additional request parameters from URL query or body
}
```

## Description

The `callHandler` service is the core request processing engine of the Pinstripe framework. It orchestrates the entire request-response cycle by:

1. **Request Processing**: Normalizes incoming request parameters and creates execution context
2. **View Resolution**: Implements a sophisticated view resolution system with guard, main, and default view patterns
3. **Response Normalization**: Converts various response types into standardized HTTP response arrays
4. **Context Management**: Manages workspace contexts and parameter passing between components

This service acts as the bridge between HTTP requests (from servers, service workers, or programmatic calls) and the Pinstripe view system, enabling consistent request handling across different environments.

## Key Features

- **Multi-Environment Support**: Works in server, service worker, and programmatic contexts
- **Hierarchical View Resolution**: Supports guard views, main views, and fallback default views
- **Response Normalization**: Handles various response formats and converts them to HTTP response arrays
- **Parameter Processing**: Normalizes URL parameters, headers, and request data
- **Context Isolation**: Creates isolated workspace contexts for each request
- **Error Handling**: Provides structured error responses with appropriate HTTP status codes

## Examples

### Basic Request Handling

```javascript
// Simple programmatic request
const [status, headers, body] = await this.callHandler.handleCall({
    _url: new URL('/', 'http://localhost'),
    _method: 'get'
});

console.log(status); // 200
console.log(headers); // { 'content-type': 'text/html' }
console.log(body); // ['<html>...</html>']
```

### Server Integration

```javascript
// HTTP server using callHandler
http.createServer(async (request, response) => {
    try {
        const params = await this.extractParams(request, baseUrl, limits);
        const [status, headers, body] = await this.callHandler.handleCall(params);
        
        response.statusCode = status;
        Object.keys(headers).forEach(name => 
            response.setHeader(name, headers[name])
        );
        body.forEach(chunk => response.write(chunk));
        response.end();
    } catch (error) {
        response.statusCode = 500;
        response.end('Internal Server Error');
    }
});
```

### Service Worker Integration

```javascript
// Service worker using callHandler for offline-first functionality
addEventListener("fetch", (event) => {
    event.respondWith((async () => {
        const request1 = event.request.clone();
        const request2 = event.request.clone();
        
        try {
            const params = await this.extractParams(request1);
            const [status, headers, body] = await this.callHandler.handleCall(params);
            
            if(status >= 200 && status < 300) {
                return new Response(body, { status, headers });
            }
            return fetch(request2);
        } catch (error) {
            return fetch(request2);
        }
    })());
});
```

### Static Site Generation

```javascript
// Generate static files using callHandler
export default {
    async run(){
        const urls = View.names
            .filter(path => !path.match(/(^|\/)_/))
            .map(path => new URL(path, 'http://127.0.0.1/'));

        for(const url of urls) {
            const [status, headers, body] = await this.callHandler.handleCall({ 
                _url: url 
            });
            
            if(status === 200) {
                const content = body.join('');
                await this.writeFile(url.pathname, content);
            }
        }
    }
}
```

### Advanced Parameter Handling

```javascript
// POST request with form data
const [status, headers, body] = await this.callHandler.handleCall({
    _url: new URL('/contact', 'http://localhost'),
    _method: 'post',
    _headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello world'
});
```

### JSON API Requests

```javascript
// API endpoint handling
const [status, headers, body] = await this.callHandler.handleCall({
    _url: new URL('/api/users', 'http://localhost'),
    _method: 'post',
    _headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer token123'
    },
    userData: { name: 'Jane', email: 'jane@example.com' }
});
```

### Multi-Tenant Requests

```javascript
// Tenant-specific request handling
const [status, headers, body] = await this.callHandler.handleCall({
    _url: new URL('/dashboard', 'http://tenant1.example.com'),
    _headers: {
        'host': 'tenant1.example.com',
        'x-tenant-id': 'tenant-uuid-123'
    }
});
```

### Error Response Handling

```javascript
// Handling various response types
const params = { _url: new URL('/nonexistent', 'http://localhost') };
const [status, headers, body] = await this.callHandler.handleCall(params);

if(status === 404) {
    console.log('Page not found');
    console.log(body); // ['Not found']
}
```

## View Resolution System

The callHandler implements a sophisticated view resolution hierarchy:

### 1. Guard Views
```javascript
// Checks for authentication/authorization guards
// Pattern: guard.js, admin/guard.js, admin/users/guard.js
async renderGuardViews(viewName, params) {
    // Traverses from most specific to least specific guard
    // If any guard returns a response, stops execution
}
```

### 2. Main Views
```javascript
// Renders the primary view if it exists and isn't private (_prefixed)
// Pattern: index.js, admin/users.js, contact.js
if(!viewName.match(/(^|\/)_[^\/]+(|\/index)$/)) {
    const out = await this.renderView(viewName, params);
    if(out) return out;
}
```

### 3. Default Views
```javascript
// Falls back to default views for missing routes
// Pattern: default.js, admin/default.js, admin/users/default.js
async renderDefaultViews(viewName, params) {
    // Traverses from most specific to least specific default
}
```

## Parameter Normalization

```javascript
normalizeParams(params) {
    const out = { ...params };
    if(!out._method) out._method = 'get';
    out._url = new URL(out._url ?? '/', 'http://localhost');
    if(!params._headers) out._headers = {};
    return out;
}
```

## Response Normalization

```javascript
normalizeResponse(response) {
    // Handles various response formats:
    // - Objects with toResponseArray() method
    // - Plain strings/numbers (converted to 200 OK)
    // - Raw [status, headers, body] arrays
    // - null/undefined (becomes 404)
}
```

## Context Management

```javascript
// Workspace isolation
async handleCall(params = {}, useContext = false) {
    if(!useContext) {
        return Workspace.run(function(){
            return this.callHandler.handleCall(params, true);
        });
    }
    
    // Process request in current context
    this.context.params = this.normalizeParams(params);
    // ... rest of processing
}
```

## Integration Patterns

### Server Middleware Pattern
```javascript
// Custom middleware using callHandler
const middleware = (req, res, next) => {
    this.callHandler.handleCall(extractParams(req))
        .then(([status, headers, body]) => {
            if(status === 404) return next();
            res.status(status).set(headers).send(body.join(''));
        })
        .catch(next);
};
```

### Testing Pattern
```javascript
// Testing views programmatically
test('homepage renders correctly', async () => {
    const [status, headers, body] = await this.callHandler.handleCall({
        _url: new URL('/', 'http://localhost')
    });
    
    assert.equal(status, 200);
    assert.equal(headers['content-type'], 'text/html');
    assert(body.join('').includes('<title>Welcome</title>'));
});
```

### Programmatic View Rendering
```javascript
// Render any view programmatically
async function renderPage(path, params = {}) {
    return await this.callHandler.handleCall({
        _url: new URL(path, 'http://localhost'),
        ...params
    });
}

// Usage
const [status, headers, body] = await renderPage('/admin/users', {
    userId: '123'
});
```

## Performance Considerations

- **Context Reuse**: Setting `useContext=true` reuses current context for better performance
- **Parameter Caching**: Normalized parameters are cached in context for subsequent access
- **View Caching**: View instances are cached and reused where possible
- **Response Streaming**: Body arrays support efficient streaming to clients
- **Memory Management**: Workspace contexts are properly cleaned up after requests

## Error Handling

The service provides structured error handling:

```javascript
// Standard 404 response for missing views
return [404, {'content-type': 'text/plain'}, ['Not found']];

// Server errors are propagated up the call stack
try {
    const response = await this.callHandler.handleCall(params);
} catch (error) {
    // Handle 500 errors appropriately
}
```

## Return Value Format

All responses follow the standard HTTP response array format:

```javascript
[
    status,   // Number: HTTP status code (200, 404, 500, etc.)
    headers,  // Object: Response headers (all lowercase keys)
    body      // Array: Response body chunks (strings or buffers)
]
```

## Common Use Cases

### Web Server Integration
- Processing HTTP requests in Express, Koa, or native Node.js servers
- Handling both static and dynamic routes
- Managing authentication and authorization flows

### Static Site Generation
- Pre-rendering all application routes to static files
- Building JAMstack applications with server-side rendering
- Creating offline-capable progressive web apps

### Service Worker Implementation
- Implementing offline-first functionality
- Caching strategies for dynamic content
- Background sync and push notifications

### API Development
- Building RESTful APIs with consistent response formats
- Handling different content types (JSON, form data, multipart)
- Multi-tenant API architectures

### Testing and Development
- Programmatic testing of views and routes
- Development tooling and debugging utilities
- Mock request/response cycles for unit tests