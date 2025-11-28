---
menus:
    sidebar: ["Services", "environment"]
---
# environment

Access the current runtime environment.

## Interface

```javascript
await this.environment
```

### Returns

- String: `'development'`, `'production'`, or `'test'`

## Description

The `environment` service returns the current runtime environment, reading from `NODE_ENV` on the server. It defaults to `'development'` when not set. On the client, it fetches the environment from the server.

## Examples

### Basic Environment Check

```javascript
export default {
    async render() {
        const env = await this.environment;

        if (env === 'development') {
            return this.renderHtml`<div class="dev-banner">Development Mode</div>`;
        }

        return this.renderView('_content');
    }
}
```

### Environment-Specific Behavior

```javascript
export default {
    async render() {
        const env = await this.environment;

        return this.renderHtml`
            <script>
                window.DEBUG = ${env === 'development'};
                window.ANALYTICS = ${env === 'production'};
            </script>
        `;
    }
}
```

### Version Stamping

```javascript
export default {
    create() {
        return this.defer(async () => {
            let version = await this.project.config.version || '0.1.0';

            // Add timestamp in development for cache busting
            if (await this.environment === 'development') {
                version += `.${Date.now()}`;
            }

            return version;
        });
    }
}
```

## Notes

- Returns a Promise, always use `await`
- Defaults to `'development'` when `NODE_ENV` is not set
- Value is cached after first access
- Works on both server and client
