---
sidebar:
    category: ["Services", "cookies"]
---
# cookies Service

The `cookies` service provides read-only access to HTTP cookies sent by the client. It parses the `Cookie` header from incoming requests and makes individual cookie values available as an object with key-value pairs.

## Interface

```javascript
const cookies = this.cookies;
```

- **Returns**: `Object` - A plain object containing all cookies sent by the client, with cookie names as keys and URL-decoded values as strings

## Description

The cookies service automatically parses the HTTP `Cookie` header from incoming requests and extracts individual cookie name-value pairs. Cookie values are automatically URL-decoded using `decodeURI()`. The service implements caching at the context level to avoid reparsing the same cookie header multiple times during a single request.

The service only provides read access to cookies. To set cookies in responses, you must include `Set-Cookie` headers in your response using the appropriate response methods.

## Key Features

- **Automatic Parsing**: Parses the `Cookie` header automatically on first access
- **URL Decoding**: Cookie values are automatically URL-decoded
- **Caching**: Parsed cookies are cached to avoid reprocessing during the same request
- **Read-Only**: Provides read-only access to client-sent cookies
- **Error Handling**: Gracefully handles malformed cookies and missing headers

## Examples

### Basic Cookie Access

```javascript
// Access all cookies
export default {
    async render(){
        const cookies = this.cookies;
        console.log(cookies);
        // Output: { sessionId: 'abc123', theme: 'dark', language: 'en' }
        
        // Access specific cookies
        const sessionId = cookies.sessionId;
        const userTheme = cookies.theme || 'light';
        
        return this.renderHtml`<p>Session: ${sessionId}</p>`;
    }
}
```

### Session Management

```javascript
// Using cookies for session authentication
export default {
    create(){
        return this.defer(async () => {
            const { pinstripeSession } = this.cookies;
            if(!pinstripeSession){
                return; // No session cookie found
            }
            
            // Parse session cookie format: "id:passString"
            const [id, passString] = pinstripeSession.split(/:/);
            const session = await this.database.sessions
                .where({ id, passString })
                .first();
                
            if(session && session.lastAccessedAt < (Date.now() - 1000 * 60 * 5)){
                await session.update({
                    lastAccessedAt: Date.now()
                });
            }
            
            return session;
        });
    }
}
```

### Conditional Rendering Based on Cookies

```javascript
// Show different content based on user preferences
export default {
    async render(){
        const { theme = 'light', language = 'en' } = this.cookies;
        
        const cssClass = theme === 'dark' ? 'dark-theme' : 'light-theme';
        const greeting = language === 'es' ? 'Hola' : 'Hello';
        
        return this.renderHtml`
            <div class="${cssClass}">
                <h1>${greeting}, User!</h1>
            </div>
        `;
    }
}
```

### User Preferences Service

```javascript
// Service for accessing user preferences from cookies
export default {
    create(){
        return this.defer(() => {
            const {
                theme = 'system',
                fontSize = 'medium',
                sidebarCollapsed = 'false',
                language = 'en'
            } = this.cookies;
            
            return {
                theme,
                fontSize,
                sidebarCollapsed: sidebarCollapsed === 'true',
                language
            };
        });
    }
}

// Usage in views
export default {
    async render(){
        const prefs = await this.userPreferences;
        
        return this.renderHtml`
            <div class="app ${prefs.theme} ${prefs.fontSize}">
                <aside class="${prefs.sidebarCollapsed ? 'collapsed' : ''}">
                    <!-- Sidebar content -->
                </aside>
            </div>
        `;
    }
}
```

### Cookie Validation and Sanitization

```javascript
// Safely access and validate cookie values
export default {
    async render(){
        const cookies = this.cookies;
        
        // Validate session cookie format
        const sessionCookie = cookies.pinstripeSession;
        if(sessionCookie && sessionCookie.match(/^[a-f0-9-]+:[a-f0-9-]+$/)) {
            // Valid session format
            const session = await this.session;
            if(session) {
                return this.renderView('dashboard');
            }
        }
        
        // Validate numeric preferences
        const fontSize = parseInt(cookies.fontSize) || 16;
        const maxItems = Math.min(parseInt(cookies.maxItems) || 10, 100);
        
        return this.renderHtml`
            <div style="font-size: ${fontSize}px">
                <!-- Show ${maxItems} items -->
            </div>
        `;
    }
}
```

### A/B Testing with Cookies

```javascript
// Use cookies for A/B testing and feature flags
export default {
    async render(){
        const { 
            experiment_variant = 'control',
            feature_beta = 'false'
        } = this.cookies;
        
        const isBetaUser = feature_beta === 'true';
        const isVariantB = experiment_variant === 'variant_b';
        
        if(isBetaUser) {
            return this.renderView('beta-features');
        }
        
        if(isVariantB) {
            return this.renderView('variant-b-layout');
        }
        
        return this.renderView('default-layout');
    }
}
```

## Setting Cookies in Responses

While the cookies service only reads cookies, you can set cookies in responses using the `Set-Cookie` header:

### Basic Cookie Setting

```javascript
// Set cookies in response headers
export default {
    async render(){
        const content = this.renderHtml`<p>Cookie has been set!</p>`;
        const [status, headers, body] = content.toResponseArray();
        
        // Set a simple cookie
        headers['Set-Cookie'] = 'theme=dark; Path=/';
        
        return [status, headers, body];
    }
}
```

### Session Cookie Management

```javascript
// Login action that sets session cookie
export default {
    async render(){
        // ... authentication logic ...
        
        const passString = crypto.randomUUID();
        const session = await this.database.sessions.insert({
            userId: user.id,
            passString,
            lastAccessedAt: Date.now()
        });
        
        const [status, headers, body] = this.renderRedirect({ 
            target: '_top' 
        }).toResponseArray();
        
        // Set session cookie with security attributes
        headers['Set-Cookie'] = [
            `pinstripeSession=${session.id}:${passString}`,
            'Path=/',
            'HttpOnly',
            'SameSite=Strict',
            process.env.NODE_ENV === 'production' ? 'Secure' : ''
        ].filter(Boolean).join('; ');
        
        return [status, headers, body];
    }
}
```

### Cookie Removal

```javascript
// Logout action that removes session cookie
export default {
    async render(){
        // Delete session from database
        if(await this.session){
            await this.session.delete();
        }
        
        const [status, headers, body] = this.renderRedirect({ 
            target: '_top' 
        }).toResponseArray();
        
        // Clear the session cookie
        headers['Set-Cookie'] = 'pinstripeSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        return [status, headers, body];
    }
}
```

## Implementation Details

### Cookie Header Parsing

The service parses the HTTP `Cookie` header using the following logic:

1. Splits the header on semicolons (`;`)
2. Trims whitespace from each cookie
3. Matches the pattern `name=value` using regex `^([^=]+)=(.*)$`
4. URL-decodes the value using `decodeURI()`
5. Stores the result in a plain object

### Caching Behavior

- Parsed cookies are cached in `this.context.root.cookies`
- The cache persists for the duration of a single request
- Subsequent accesses to `this.cookies` return the cached object
- No automatic cache invalidation or refresh

### Error Handling

- Malformed cookies (without `=`) are silently ignored
- Missing `Cookie` header results in an empty object `{}`
- URL decoding errors are not caught and may throw exceptions
- Invalid cookie formats don't prevent other cookies from being parsed

## Common Use Cases

### Authentication and Sessions
- Reading session tokens and authentication cookies
- Implementing user login state management
- Supporting remember-me functionality

### User Preferences
- Storing and reading theme preferences
- Language and localization settings
- UI customization options

### Analytics and Tracking
- Reading tracking cookies for analytics
- A/B testing variant assignments
- User behavior analysis

### Shopping and E-commerce
- Cart persistence across sessions
- Recently viewed items
- User preferences and filters

### Feature Flags
- Reading feature flag cookies for conditional functionality
- Beta user identification
- Gradual feature rollouts

## Related Services

- **session**: Uses cookies service to read session cookies for authentication
- **callHandler**: Processes request headers including cookies during request handling
- **server**: Extracts cookie headers from HTTP requests
- **serviceWorker**: Handles cookie headers in service worker contexts