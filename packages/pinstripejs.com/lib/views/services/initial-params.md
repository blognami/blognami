---
menus:
    sidebar: ["Services", "initialParams"]
---
# initialParams Service

The `initialParams` service provides access to the original request parameters that were used to initialize the current workspace context. Unlike the regular `params` service which reflects the current request being processed, `initialParams` preserves the parameters from the initial request that started the workspace, making it essential for multi-tenant applications, background jobs, and maintaining context across nested operations.

## Interface

```javascript
const initialParams = this.initialParams;
```

- **Returns**: `Object` - The original request parameters object containing headers, URL, method, and additional request data

### Parameter Structure

```javascript
initialParams = {
    _headers: Object,     // HTTP headers from the original request
    _url: URL,           // URL object of the original request
    _method: String,     // HTTP method (default: 'GET')
    session: Object,     // Session object (when available)
    ...otherParams       // Additional parameters from URL query or body
}
```

## Description

The `initialParams` service stores the original request parameters that were used to create the current workspace context. This is particularly important in scenarios where the workspace context is reused across multiple operations, such as background jobs, multi-tenant applications, or nested request processing.

The service maintains a cached reference to the root context's parameters, ensuring that even when child contexts or new requests are processed, the original initialization parameters remain accessible. This enables consistent tenant resolution, header inspection, and URL-based configuration throughout the application lifecycle.

## Key Features

- **Context Preservation**: Maintains original request context across nested operations
- **Multi-Tenant Support**: Enables consistent tenant resolution using headers and URLs
- **Background Job Context**: Preserves request context for background job execution
- **Header Access**: Provides access to original HTTP headers for authentication and configuration
- **URL Inspection**: Maintains original URL for hostname-based routing and configuration
- **Immutable Reference**: Points to root context parameters, preventing accidental overwrites

## Examples

### Basic Parameter Access

```javascript
// Access original request information
export default {
    async render(){
        const params = this.initialParams;
        
        console.log('Original Method:', params._method);
        console.log('Original URL:', params._url.toString());
        console.log('Original Headers:', params._headers);
        
        // Access specific headers
        const userAgent = params._headers['user-agent'];
        const contentType = params._headers['content-type'];
        
        return this.renderHtml`
            <p>Request came from: ${params._url.hostname}</p>
            <p>Using: ${userAgent}</p>
        `;
    }
}
```

### Multi-Tenant Resolution

```javascript
// Resolve tenant based on original request headers and URL
export default {
    create(){
        return this.defer(async () => {
            if(!await this.database.info.tenants) return;
            
            const headers = this.initialParams._headers;
            const hostname = this.initialParams._url.hostname;
            
            // Try header-based tenant resolution first
            const tenantId = headers['x-tenant-id'];
            if(tenantId) {
                return await this.database.tenants.where({ id: tenantId }).first();
            }
            
            // Fall back to hostname-based resolution
            const host = (headers['host'] || hostname)
                         .replace(/:\d+$/, '')
                         .toLowerCase();
            
            return await this.database.tenants.where({ host }).first();
        });
    }
}
```

### Cookie Parsing from Original Request

```javascript
// Parse cookies from original request headers
export default {
    create(){
        if(!this.context.root.hasOwnProperty('cookies')){
            const cookies = {};
            const cookieHeader = this.initialParams._headers?.cookie;
            
            if(cookieHeader){
                cookieHeader.split(/;/).forEach(cookie => {
                    const matches = cookie.trim().match(/^([^=]+)=(.*)$/);
                    if(matches){
                        cookies[matches[1]] = decodeURI(matches[2]);
                    }
                });
            }
            
            this.context.root.cookies = cookies;
        }
        return this.context.root.cookies;
    }
}
```

### Feature Flag Resolution

```javascript
// Extract feature flags from original request headers
export default {
    create(){
        return this.defer(async () => {
            if(!this.context.root.hasOwnProperty('featureFlags')){
                let { featureFlags = this.defaultFeatureFlags } = await this.config;
                
                if(typeof featureFlags === 'function') {
                    featureFlags = await featureFlags.call(this);
                }
                
                this.context.root.featureFlags = featureFlags;
            }
            return this.context.root.featureFlags;
        });
    },
    
    defaultFeatureFlags(){
        let flagsHeader = this.initialParams._headers['x-feature-flags'] || '';
        return flagsHeader.split(/\s+/)
                         .filter(name => !!name)
                         .reduce((out, name) => ({ ...out, [name]: true }), {});
    }
}
```

### Background Job Context Preservation

```javascript
// Preserve tenant context for background jobs
export default {
    async runBackgroundJob(name){
        const { multiTenant = true } = BackgroundJob.for(name);
        
        if(multiTenant){
            const tenants = await this.database.tenants.all();
            
            for(let tenant of tenants){
                await Workspace.run(async function(){
                    // Preserve tenant context in initialParams
                    this.initialParams._headers['x-tenant-id'] = tenant.id;
                    
                    // Background job will now run with correct tenant context
                    await BackgroundJob.run(this.context, name);
                });
            }
        } else {
            await BackgroundJob.run(this.context, name);
        }
    }
}
```

### Session Access

```javascript
// Access session from initial parameters
export default {
    async render(){
        const session = this.initialParams.session;
        
        if(!session){
            return this.renderRedirect('/login');
        }
        
        const user = await this.database.users.find(session.userId);
        
        return this.renderHtml`
            <h1>Welcome, ${user.name}!</h1>
            <p>Session started: ${new Date(session.createdAt)}</p>
        `;
    }
}
```

### URL-Based Configuration

```javascript
// Configure services based on original URL
export default {
    create(){
        return this.defer(async () => {
            const { hostname, protocol, port } = this.initialParams._url;
            
            // Environment detection based on hostname
            let environment = 'production';
            if(hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
                environment = 'development';
            } else if(hostname.includes('staging') || hostname.includes('test')) {
                environment = 'staging';
            }
            
            // Protocol-based configuration
            const isSecure = protocol === 'https:';
            
            return {
                environment,
                hostname,
                port: port || (isSecure ? 443 : 80),
                secure: isSecure,
                baseUrl: `${protocol}//${hostname}${port ? `:${port}` : ''}`
            };
        });
    }
}
```

### Webhook URL Generation

```javascript
// Generate webhook URLs using original request context
export default {
    getWebhookUrl(){
        const host = this.initialParams._headers.host;
        const baseUrl = new URL("/", this.initialParams._url);
        
        // Ensure HTTPS for webhooks in production
        baseUrl.protocol = "https:";
        baseUrl.host = host;
        
        return new URL("/_webhook/stripe", baseUrl);
    },
    
    getCallbackUrl(path = '/'){
        const { hostname } = this.initialParams._url;
        const host = this.initialParams._headers.host || hostname;
        
        const callbackUrl = new URL(path, `https://${host}`);
        return callbackUrl.toString();
    }
}
```

### Authentication Context

```javascript
// Extract authentication information from original headers
export default {
    create(){
        return this.defer(async () => {
            const headers = this.initialParams._headers;
            
            // Check for API key authentication
            const apiKey = headers['x-api-key'] || headers['authorization']?.replace(/^Bearer /, '');
            if(apiKey){
                const app = await this.database.apps.where({ apiKey }).first();
                if(app) return { type: 'api', app };
            }
            
            // Check for session-based authentication
            const sessionId = this.extractSessionId();
            if(sessionId){
                const session = await this.database.sessions.find(sessionId);
                if(session) return { type: 'session', session };
            }
            
            return { type: 'anonymous' };
        });
    },
    
    extractSessionId(){
        const cookieHeader = this.initialParams._headers?.cookie;
        if(!cookieHeader) return null;
        
        const sessionMatch = cookieHeader.match(/pinstripeSession=([^;]+)/);
        return sessionMatch ? sessionMatch[1].split(':')[0] : null;
    }
}
```

### Request Logging and Analytics

```javascript
// Log request information using initial parameters
export default {
    async logRequest(){
        const params = this.initialParams;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: params._method,
            url: params._url.toString(),
            hostname: params._url.hostname,
            userAgent: params._headers['user-agent'],
            referrer: params._headers['referer'],
            clientIp: params._headers['x-forwarded-for'] || 
                     params._headers['x-real-ip'] ||
                     'unknown',
            tenantId: params._headers['x-tenant-id'],
            sessionId: this.extractSessionId()
        };
        
        // Log to database or external service
        await this.database.requestLogs.insert(logEntry);
        
        return logEntry;
    }
}
```

### Cross-Origin Resource Sharing (CORS)

```javascript
// Handle CORS based on original request headers
export default {
    async render(){
        const origin = this.initialParams._headers['origin'];
        const allowedOrigins = await this.getAllowedOrigins();
        
        const [status, headers, body] = await this.processRequest();
        
        // Add CORS headers based on original request
        if(origin && allowedOrigins.includes(origin)){
            headers['Access-Control-Allow-Origin'] = origin;
            headers['Access-Control-Allow-Credentials'] = 'true';
        }
        
        // Handle preflight requests
        if(this.initialParams._method === 'OPTIONS'){
            headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Tenant-ID';
            return [200, headers, ['']];
        }
        
        return [status, headers, body];
    }
}
```

## Common Patterns

### Tenant Context Preservation

```javascript
// Ensure tenant context is maintained across operations
const preserveTenantContext = (operation) => {
    return async function(...args) {
        const tenantId = this.initialParams._headers['x-tenant-id'];
        
        return await Workspace.run(async function(){
            // Restore tenant context
            this.initialParams._headers['x-tenant-id'] = tenantId;
            
            // Execute operation with preserved context
            return await operation.apply(this, args);
        });
    };
};
```

### Header Extraction Utilities

```javascript
// Utility functions for common header operations
const HeaderUtils = {
    getTenantId(initialParams){
        return initialParams._headers['x-tenant-id'];
    },
    
    getHost(initialParams){
        const { hostname } = initialParams._url;
        return initialParams._headers['host'] || hostname;
    },
    
    isSecureRequest(initialParams){
        return initialParams._url.protocol === 'https:' ||
               initialParams._headers['x-forwarded-proto'] === 'https';
    },
    
    getClientIp(initialParams){
        return initialParams._headers['x-forwarded-for']?.split(',')[0]?.trim() ||
               initialParams._headers['x-real-ip'] ||
               initialParams._headers['cf-connecting-ip'] ||
               'unknown';
    }
};
```

## Implementation Details

### Default Values

The service provides default values when parameters are missing:
- `_method`: Defaults to 'GET'
- `_url`: Defaults to `new URL('http://127.0.0.1/')`
- `_headers`: Defaults to empty object `{}`

### Context Binding

- Parameters are stored in `this.context.root.params`
- The root context ensures parameters persist across child workspaces
- The service returns a reference to the cached parameters object
- Parameters are only initialized once per root context

### Memory Management

- Parameters are cached for the lifetime of the root context
- No automatic cleanup or garbage collection
- Large parameter objects may impact memory usage
- Consider the scope and lifetime when storing references

## Security Considerations

### Header Validation

Always validate and sanitize header values:

```javascript
// Validate tenant ID format
const tenantId = this.initialParams._headers['x-tenant-id'];
if(tenantId && !tenantId.match(/^[a-f0-9-]{36}$/)) {
    throw new Error('Invalid tenant ID format');
}
```

### URL Safety

Be cautious when using URLs for redirects or external calls:

```javascript
// Validate redirect URLs
const redirectUrl = new URL(this.initialParams._url);
const allowedHosts = ['example.com', 'app.example.com'];

if(!allowedHosts.includes(redirectUrl.hostname)) {
    throw new Error('Invalid redirect host');
}
```

### Header Injection Prevention

Prevent header injection attacks:

```javascript
// Sanitize header values
const sanitizeHeader = (value) => {
    if(typeof value !== 'string') return '';
    return value.replace(/[\r\n]/g, '').substring(0, 1000);
};

const userAgent = sanitizeHeader(this.initialParams._headers['user-agent']);
```

## Related Services

- **params**: Current request parameters (may differ from initial parameters)
- **cookies**: Parses cookies from `initialParams._headers.cookie`
- **session**: Uses initial parameters for session cookie extraction
- **callHandler**: Normalizes parameters before passing to initialParams
- **database**: Uses initial parameters for tenant resolution in multi-tenant setups
- **featureFlags**: Extracts feature flags from initial request headers
- **server**: Extracts and processes initial parameters from HTTP requests
- **serviceWorker**: Handles initial parameter extraction in service worker contexts

## Troubleshooting

### Common Issues

**Parameters not persisting across operations:**
- Ensure you're accessing `this.initialParams` and not `this.params`
- Check that operations are running within the same root context

**Tenant resolution failing:**
- Verify that `x-tenant-id` header is being set correctly
- Check hostname normalization for domain-based tenant resolution

**Session not available:**
- Ensure session middleware is processing cookies before accessing `initialParams.session`
- Verify cookie parsing is working correctly

**Headers missing or incorrect:**
- Check proxy configuration for header forwarding
- Verify that headers are being extracted correctly from the original request

### Debug Information

```javascript
// Debug initial parameters
console.log('Initial Params Debug:', {
    method: this.initialParams._method,
    url: this.initialParams._url.toString(),
    headers: Object.keys(this.initialParams._headers),
    hasSession: !!this.initialParams.session,
    tenantId: this.initialParams._headers['x-tenant-id']
});
```