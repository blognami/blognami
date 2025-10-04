---
sidebar:
    category: ["Services", "featureFlags"]
---
# featureFlags Service

The `featureFlags` service provides a system for conditionally enabling or disabling features and views in Pinstripe applications. It supports both server-side and client-side environments, allowing for dynamic feature toggling based on configuration, HTTP headers, or other runtime conditions.

## Interface

```javascript
// Service interface
const featureFlags = await this.featureFlags;
// Returns: Object with feature names as keys and boolean values

// Examples of returned values:
// { betaFeatures: true, newUI: false, experimentalSearch: true }
// {} (empty object when no flags are set)
```

## Description

The `featureFlags` service manages feature toggles that can control:

- **View Visibility**: Views can be conditionally rendered based on feature flags
- **Feature Availability**: Different parts of the application can check flags to enable/disable functionality
- **A/B Testing**: Support for experimental features and user segments
- **Environment-Specific Features**: Different feature sets for development, staging, and production

The service automatically handles both server-side and client-side execution contexts, ensuring consistent behavior across different rendering environments.

## Key Features

- **Dual Environment Support**: Works seamlessly on both server and client sides
- **Header-Based Flags**: Supports `x-feature-flags` HTTP header for dynamic flag setting
- **Configuration Integration**: Reads from `pinstripe.config.js` for static flag definitions
- **View Integration**: Automatically filters views based on their required features
- **Caching**: Implements smart caching to avoid repeated computation
- **Deferred Execution**: Uses lazy loading for optimal performance

## Examples

### Basic Feature Flag Usage

```javascript
// Check if a feature is enabled
export default {
    async render(){
        const flags = await this.featureFlags;
        
        if(flags.betaFeatures) {
            return this.renderView('beta-dashboard');
        }
        
        return this.renderView('standard-dashboard');
    }
}
```

### View-Level Feature Requirements

```javascript
// Define a view that requires specific features
export default {
    meta(){
        this.featureFor('advancedSearch');
        this.featureFor('experimentalUI');
    },
    
    async render(){
        // This view will only be available if both 
        // advancedSearch AND experimentalUI flags are enabled
        return this.renderHtml`
            <div class="advanced-search-ui">
                <!-- Advanced search interface -->
            </div>
        `;
    }
}
```

### Configuration-Based Feature Flags

```javascript
// pinstripe.config.js
export default {
    // Static feature flags
    featureFlags: {
        newDashboard: true,
        experimentalFeatures: false,
        betaUI: process.env.NODE_ENV === 'development'
    },
    
    // Dynamic feature flags using function
    featureFlags() {
        const headers = this.initialParams._headers;
        const userAgent = headers['user-agent'] || '';
        
        return {
            mobileOptimizations: userAgent.includes('Mobile'),
            modernBrowser: !userAgent.includes('IE'),
            betaFeatures: headers['x-beta-user'] === 'true'
        };
    }
};
```

### Multi-Source Feature Flag Resolution

```javascript
// Complex configuration combining multiple sources
export default {
    featureFlags() {
        const headers = this.initialParams._headers;
        const flags = {};
        
        // Parse header-based flags
        const headerFlags = headers['x-feature-flags'] || '';
        headerFlags.split(/\s+/)
                  .filter(name => !!name)
                  .forEach(name => flags[name] = true);
        
        // Add environment-specific flags
        if (process.env.NODE_ENV === 'development') {
            flags.debugMode = true;
            flags.showMetrics = true;
        }
        
        // Add user-specific flags
        const userId = headers['x-user-id'];
        if (userId && this.betaUserIds.includes(userId)) {
            flags.betaFeatures = true;
        }
        
        return flags;
    }
};
```

### HTTP Header Usage

```bash
# Enable features via HTTP headers
curl -H "x-feature-flags: betaUI experimentalSearch newDashboard" \
     https://example.com/
```

### Client-Side Feature Detection

```javascript
// The service automatically handles client-side requests
export default {
    async render(){
        // On the client, this will fetch from /_pinstripe/_shell/feature_flags.json
        const flags = await this.featureFlags;
        
        // Use flags for conditional rendering
        const showAdvancedFeatures = flags.advancedUI && flags.betaFeatures;
        
        return this.renderHtml`
            <div class="app">
                ${showAdvancedFeatures ? 
                    this.renderView('advanced-toolbar') : 
                    this.renderView('basic-toolbar')
                }
            </div>
        `;
    }
}
```

### A/B Testing Implementation

```javascript
// Use feature flags for A/B testing
export default {
    async render(){
        const flags = await this.featureFlags;
        
        // Determine user segment
        const isVariantA = flags.experimentVariantA;
        const isVariantB = flags.experimentVariantB;
        
        if(isVariantA) {
            return this.renderView('variant-a-layout');
        } else if(isVariantB) {
            return this.renderView('variant-b-layout');
        }
        
        return this.renderView('control-layout');
    }
}
```

### Feature-Dependent Service Creation

```javascript
// Create services conditionally based on feature flags
export default {
    create(){
        return this.defer(async () => {
            const flags = await this.featureFlags;
            
            if(flags.enhancedAnalytics) {
                return this.createEnhancedAnalytics();
            }
            
            return this.createBasicAnalytics();
        });
    }
}
```

## View Map Integration

The `featureFlags` service integrates with the view mapping system to automatically exclude views that require disabled features:

```javascript
// Views are automatically filtered based on their feature requirements
// If a view calls this.featureFor('advancedUI') in its meta() method,
// it will only be available when the advancedUI feature flag is enabled

export default {
    meta(){
        // This view requires the 'adminPanel' feature
        this.featureFor('adminPanel');
    },
    
    async render(){
        // This view will only be accessible if adminPanel flag is true
        return this.renderView('admin-interface');
    }
}
```

## Server Endpoint

The service automatically exposes feature flags to client-side code via:

```
GET /_pinstripe/_shell/feature_flags.json
```

This endpoint returns the current feature flags as JSON, enabling consistent flag access across server and client environments.

## Default Behavior

When no feature flags are configured, the service falls back to parsing the `x-feature-flags` HTTP header:

1. Extract the `x-feature-flags` header value
2. Split on whitespace to get individual flag names
3. Create an object with each flag name set to `true`
4. Return the resulting flags object

## Caching Strategy

- **Server-side**: Caches flags in the context root to avoid repeated computation
- **Client-side**: Uses a promise-based cache to prevent multiple HTTP requests
- **View Map**: Caches view maps per unique feature flag combination

## Performance Considerations

- Feature flags are computed once and cached for the duration of the request
- Client-side requests are batched and cached globally
- View filtering happens at application startup, not per request
- Deferred execution ensures flags are only computed when actually needed

## Error Handling

The service provides graceful fallbacks:

- Invalid configuration functions are caught and logged
- Missing headers default to empty flag sets
- Network failures on client-side fall back to empty objects
- Malformed flag values are filtered out automatically

## Common Use Cases

### Gradual Feature Rollouts
- Enable features for specific user segments
- Test new functionality with limited audiences
- Roll back features quickly if issues arise

### Environment-Specific Features
- Enable debug tools only in development
- Show different UIs based on deployment environment
- Configure different service integrations per environment

### User Experience Testing
- A/B test different interfaces or workflows
- Personalize experiences based on user preferences
- Implement feature toggles for experimental functionality

### Administrative Controls
- Allow administrators to enable/disable features runtime
- Implement maintenance mode flags
- Control access to sensitive functionality

## Related Services

- **viewMap**: Uses feature flags to filter available views
- **config**: Provides the configuration source for feature flags
- **environment**: Often used in conjunction for environment-specific flags
- **cookies**: Can be used to store user-specific feature preferences
- **session**: May influence feature availability based on user authentication state

## Integration Patterns

### With Configuration Service
```javascript
// Feature flags can be functions that access other config
export default {
    featureFlags() {
        const dbConfig = this.database;
        return {
            advancedFeatures: dbConfig.adapter !== 'sqlite',
            cloudIntegration: !!dbConfig.cloudUrl
        };
    }
};
```

### With User Authentication
```javascript
export default {
    featureFlags() {
        const session = this.initialParams.session;
        const user = session?.user;
        
        return {
            adminFeatures: user?.role === 'admin',
            betaFeatures: user?.betaAccess === true,
            premiumFeatures: user?.subscription === 'premium'
        };
    }
};
```

### With Multi-Tenant Architecture
```javascript
export default {
    featureFlags() {
        const tenant = this.tenant;
        
        return {
            customBranding: tenant?.plan === 'enterprise',
            advancedReporting: tenant?.features?.includes('reporting'),
            apiAccess: tenant?.apiEnabled === true
        };
    }
};
```