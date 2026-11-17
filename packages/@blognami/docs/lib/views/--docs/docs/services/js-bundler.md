---
section: docs
menu:
    path: ["Services", "jsBundler"]
---
# jsBundler

JavaScript bundling for client-side code.

## Interface

```javascript
await this.jsBundler.build(name, options)
```

### Parameters

- **name** - Bundle to build: `'window'` (default), `'clientServiceWorker'` or `'serviceWorker'`
- **options** - `{ force: boolean }` - Force rebuild even if cached

### Returns

```javascript
{
    js: string,   // Bundled JavaScript
    map: string   // Source map as JSON
}
```

## Description

The `jsBundler` service compiles JavaScript modules using ESBuild for client-side delivery. It automatically includes services and views marked with `addToClient()` and provides source maps for debugging.

## Bundles

Each bundle carries the flags that say where it runs:

| Bundle | Flags | Runs as |
| --- | --- | --- |
| `window` | `client`, `window` | The page's script in the browser |
| `clientServiceWorker` | `client`, `service-worker` | The client service worker, the one the browser runs |
| `serviceWorker` | `server`, `service-worker` | The server service worker |

## Conditional compilation

A line ending in a `blognami-if(<flags>):` comment is swapped for the code after the marker when the bundle is built:

```javascript
return false; // blognami-if(client): return true;
```

The flags are `client`, `server`, `window` and `service-worker`, comma-separated with no spaces. The swap applies only in a bundle carrying every flag listed, so `blognami-if(client)` applies in `window` and `clientServiceWorker`, and `blognami-if(server,service-worker)` in `serviceWorker` alone. In any other bundle, and on Node, the line is left as it is.

## Examples

### Generate Browser Bundle

```javascript
export default {
    async render() {
        const { js, map } = await this.jsBundler.build('window');

        return this.renderHtml`
            <script>${js}</script>
        `;
    }
}
```

### Client Service Worker Bundle

```javascript
export default {
    async render() {
        const { js } = await this.jsBundler.build('clientServiceWorker');

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
        const { js } = await this.jsBundler.build('window', { force: isDev });

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
