---
menus:
    sidebar: ["Services", "bundler"]
---
# bundler

JavaScript bundling for client-side code.

## Interface

```javascript
await this.bundler.build(name, options)
```

### Parameters

- **name** - Bundle environment: `'window'` (default) or `'serviceWorker'`
- **options** - `{ force: boolean }` - Force rebuild even if cached

### Returns

```javascript
{
    js: string,   // Bundled JavaScript
    map: string   // Source map as JSON
}
```

## Description

The `bundler` service compiles JavaScript modules using ESBuild for client-side delivery. It automatically includes services and views marked with `addToClient()` and provides source maps for debugging.

## Examples

### Generate Browser Bundle

```javascript
export default {
    async render() {
        const { js, map } = await this.bundler.build('window');

        return this.renderHtml`
            <script>${js}</script>
        `;
    }
}
```

### Service Worker Bundle

```javascript
export default {
    async render() {
        const { js } = await this.bundler.build('serviceWorker');

        return [200, {
            'content-type': 'text/javascript'
        }, [
            `${js}\n//# sourceMappingURL=/sw.js.map`
        ]];
    }
}
```

### Force Rebuild in Development

```javascript
export default {
    async render() {
        const isDev = process.env.NODE_ENV !== 'production';
        const { js } = await this.bundler.build('window', { force: isDev });

        return this.renderHtml`<script>${js}</script>`;
    }
}
```

## Notes

- Bundles are cached after first build
- ESBuild provides fast compilation
- Minification enabled in production
- Source maps generated for all bundles
- Services with `addToClient()` are included automatically
