---
sidebar:
    category: ["Services", "version"]
---
# version Service

The `version` service provides application version information that works seamlessly across server-side and client-side environments. It handles version retrieval, caching, and development-specific version stamping for cache busting.

## Interface

```javascript
// Returns a deferred promise that resolves to a version string
await this.version

// The service is available on both server and client
this.version // Promise<string>
```

## Description

The `version` service retrieves the application version from the project configuration (`package.json` or `pinstripe.config.js`) and provides it consistently across server and client environments. 

**Key features:**
- **Cross-environment compatibility**: Works on both server and client using different strategies
- **Development cache busting**: Automatically appends timestamps in development mode
- **Client-side caching**: Efficiently fetches version info from server when running on client
- **Server-side optimization**: Reads version directly from project configuration
- **Automatic client inclusion**: Uses `addToClient()` to make the service available in browser

**Server-side behavior:**
- Reads version from `project.config.version` (typically from `package.json`)
- Falls back to `'0.1.0'` if no version is specified
- In development environment, appends `.{timestamp}` for cache busting
- Caches the result to avoid repeated computation

**Client-side behavior:**
- Fetches version information from `/_pinstripe/_shell/version.json` endpoint
- Caches the result in `context.root.version` to avoid repeated network requests
- Uses the same cached instance across multiple service calls

## Examples

### Basic Version Access

```javascript
// In any view, command, or service
export default {
    async render(){
        const appVersion = await this.version;
        console.log(`Running application version: ${appVersion}`);
        
        return [200, {}, [`Version: ${appVersion}`]];
    }
};
```

### Version-Aware Asset Loading

```javascript
// Using version for cache busting in asset URLs
export default {
    async render(){
        const version = await this.version;
        const urlSearchParams = new URLSearchParams({ version });
        
        const meta = [
            { tagName: 'link', rel: 'stylesheet', href: `/styles.css?${urlSearchParams}` },
            { tagName: 'script', src: `/app.js?${urlSearchParams}` }
        ];
        
        return this.renderHtml({ meta, body: 'Hello World' });
    }
};
```

### Service Worker Version Logging

```javascript
// From the service worker - logging the current version
export default {
    start(){
        // Service worker startup logic...
        
        this.version.then(version => {
            console.log(`Worker started. Running version ${JSON.stringify(version)}.`);
        });
    }
};
```

### Version Endpoint Implementation

```javascript
// Creating a version API endpoint
export default {
    async render(){
        return [200, {'content-type': 'application/json'}, [JSON.stringify(
            await this.version
        )]];
    }
};
```

### Development vs Production Behavior

```javascript
// Example showing different behavior in different environments
export default {
    async connectedCallback(){
        const version = await this.version;
        
        if(await this.environment === 'development'){
            // In development: "0.35.0.1696234567890"
            console.log(`Development version with timestamp: ${version}`);
        } else {
            // In production: "0.35.0"
            console.log(`Production version: ${version}`);
        }
    }
};
```

### Custom Version Configuration

```javascript
// In pinstripe.config.js
export default {
    version: '1.2.3-beta',
    // other config...
};

// Or in package.json
{
    "version": "1.2.3-beta",
    // other fields...
}
```

### Conditional Feature Loading

```javascript
// Using version for feature flags or conditional loading
export default {
    async render(){
        const version = await this.version;
        const [major, minor, patch] = version.split('.').map(Number);
        
        const features = [];
        if(major >= 1) features.push('advanced-editor');
        if(minor >= 5) features.push('real-time-collaboration');
        
        return this.renderView('dashboard', { features });
    }
};
```

### Version Comparison Utility

```javascript
// Service that uses version for compatibility checks
export default {
    async isCompatible(requiredVersion){
        const currentVersion = await this.version;
        
        // Remove development timestamp if present
        const cleanVersion = currentVersion.split('.').slice(0, 3).join('.');
        
        return this.compareVersions(cleanVersion, requiredVersion);
    },
    
    compareVersions(current, required){
        const currentParts = current.split('.').map(Number);
        const requiredParts = required.split('.').map(Number);
        
        for(let i = 0; i < 3; i++){
            if(currentParts[i] > requiredParts[i]) return true;
            if(currentParts[i] < requiredParts[i]) return false;
        }
        return true; // Equal versions are compatible
    }
};
```

## Configuration Sources

The version service reads from the following sources in order of preference:

1. **`pinstripe.config.js`**: 
   ```javascript
   export default {
       version: '2.1.0'
   };
   ```

2. **`package.json`**:
   ```json
   {
       "version": "2.1.0"
   }
   ```

3. **Default fallback**: `'0.1.0'`

## Development Mode Behavior

In development environment (`NODE_ENV=development`), the service automatically appends a timestamp to the version:

- **Configuration version**: `"1.2.3"`
- **Development output**: `"1.2.3.1696234567890"`

This ensures cache busting during development while maintaining clean version numbers in production.

## Client-Server Synchronization

The service ensures version consistency between server and client:

1. **Server**: Reads version from project configuration during service creation
2. **Client**: Fetches version from `/_pinstripe/_shell/version.json` endpoint
3. **Caching**: Both server and client cache the version to avoid repeated computation/network requests

## Related Services

- **`environment`**: Used to determine development vs production behavior
- **`project`**: Source of configuration including version information
- **`defer`**: Underlying mechanism for async service resolution
- **`isClient`**: Used internally to determine execution context
- **`context`**: Used for client-side version caching

## Technical Notes

- The service uses `addToClient()` to ensure availability in browser environments
- Client-side version fetching is lazy-loaded and cached
- Development timestamps are generated using `Date.now()`
- The service is implemented as a deferred service, returning promises
- Server-side caching prevents repeated file system access to configuration