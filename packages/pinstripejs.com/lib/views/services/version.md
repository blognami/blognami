---
menus:
    sidebar: ["Services", "version"]
---
# version

Get application version with cache-busting support.

## Interface

```javascript
const version = await this.version;
// "1.2.3" (production) or "1.2.3.1696234567890" (development)
```

### Returns

- Version string from `package.json` or config

## Description

The `version` service retrieves the application version from project configuration. In development, it appends a timestamp for automatic cache busting.

## Sources (in order)

1. `pinstripe.config.js`: `version` property
2. `package.json`: `version` field
3. Default: `'0.1.0'`

## Examples

### Basic Usage

```javascript
export default {
    async render() {
        const version = await this.version;
        console.log(`Running version: ${version}`);
        return this.renderHtml`<footer>v${version}</footer>`;
    }
}
```

### Asset Cache Busting

```javascript
export default {
    async render() {
        const version = await this.version;
        const params = new URLSearchParams({ version });

        return this.renderHtml`
            <link rel="stylesheet" href="/styles.css?${params}">
            <script src="/app.js?${params}"></script>
        `;
    }
}
```

### Service Worker Registration

```javascript
export default {
    async render() {
        const version = await this.version;

        return this.renderHtml`
            <meta name="pinstripe-service-worker-url"
                  content="/service_worker.js?version=${version}">
        `;
    }
}
```

### Version Endpoint

```javascript
export default {
    async render() {
        return [200, { 'content-type': 'application/json' }, [
            JSON.stringify(await this.version)
        ]];
    }
}
```

## Development vs Production

| Environment | Output |
|-------------|--------|
| Development | `"1.2.3.1696234567890"` |
| Production | `"1.2.3"` |

## Notes

- Available on both server and client
- Client fetches from `/_pinstripe/_shell/version.json`
- Timestamp uses `Date.now()` in development
- Cached after first access
