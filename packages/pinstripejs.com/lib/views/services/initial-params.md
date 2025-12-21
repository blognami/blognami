---
menu:
    path: ["Services", "initialParams"]
---
# initialParams

Access the original request parameters from the workspace root context.

## Interface

```javascript
this.initialParams
```

### Returns

- Object with `_method`, `_url`, `_headers`, and custom parameters

## Description

The `initialParams` service preserves the original request parameters that initialized the workspace. Unlike `params` which reflects the current request, `initialParams` maintains the root context parameters, making it useful for multi-tenant resolution, session handling, and maintaining context across nested operations.

## Properties

| Property | Description |
|----------|-------------|
| `_method` | Original HTTP method (default: 'GET') |
| `_url` | Original URL object |
| `_headers` | Original HTTP headers (lowercase keys) |

## Examples

### Multi-Tenant Resolution

```javascript
export default {
    create() {
        return this.defer(async () => {
            const headers = this.initialParams._headers;
            const hostname = this.initialParams._url.hostname;

            // Resolve tenant from header or hostname
            const tenantId = headers['x-tenant-id'];
            if (tenantId) {
                return this.database.tenants.where({ id: tenantId }).first();
            }

            const host = (headers['host'] || hostname).toLowerCase();
            return this.database.tenants.where({ host }).first();
        });
    }
}
```

### Feature Flags from Headers

```javascript
export default {
    create() {
        return this.defer(async () => {
            const flagsHeader = this.initialParams._headers['x-feature-flags'] || '';
            return flagsHeader
                .split(/\s+/)
                .filter(Boolean)
                .reduce((out, name) => ({ ...out, [name]: true }), {});
        });
    }
}
```

### URL-Based Configuration

```javascript
export default {
    create() {
        return this.defer(() => {
            const { hostname, protocol } = this.initialParams._url;
            const isLocal = hostname.includes('localhost');

            return {
                environment: isLocal ? 'development' : 'production',
                baseUrl: `${protocol}//${hostname}`
            };
        });
    }
}
```

## Notes

- Preserved in `this.context.root.params` for the workspace lifetime
- Use for consistent tenant/session resolution across nested operations
- Different from `params` which may change during request processing
