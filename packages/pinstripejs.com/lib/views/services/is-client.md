---
menus:
    sidebar: ["Services", "isClient"]
---
# isClient

Detect browser vs server execution environment.

## Interface

```javascript
this.isClient  // boolean (synchronous)
```

### Returns

- `true` in browser, `false` on server

## Description

The `isClient` service provides a synchronous boolean to detect the execution environment. It's determined at build time, enabling dead code elimination. Use it when client and server need different implementations.

## Examples

### Environment-Specific Code

```javascript
export default {
    async render() {
        if (this.isClient) {
            this.setupEventListeners();
        } else {
            this.setupServerResources();
        }

        return this.renderView('my-component');
    }
}
```

### Conditional Data Fetching

```javascript
export default {
    async loadData() {
        if (this.isClient) {
            // Client: fetch from API
            const response = await fetch('/api/data');
            return await response.json();
        } else {
            // Server: direct database access
            return await this.database.data.all();
        }
    }
}
```

### Service Implementation

```javascript
export default {
    meta() {
        this.addToClient();
    },

    create() {
        if (this.isClient) {
            // Client: fetch from endpoint
            return this.defer(async () => {
                const response = await fetch('/_pinstripe/_shell/environment.json');
                return await response.json();
            });
        }

        // Server: read from process
        return this.defer(() => process.env.NODE_ENV ?? 'development');
    }
};
```

### Progressive Enhancement

```javascript
export default {
    async connectedCallback() {
        this.setupBasicFeatures();

        if (this.isClient) {
            this.setupInteractiveFeatures();
            this.enableKeyboardShortcuts();
        }
    }
}
```

## Notes

- Synchronous (no `await` needed)
- Value determined at build time
- Uses Pinstripe's conditional compilation (`pinstripe-if-client`)
- Zero runtime overhead
