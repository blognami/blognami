---
menu:
    path: ["Services", "serviceWorker"]
---
# serviceWorker

Service worker for offline-first PWA functionality.

## Interface

```javascript
this.serviceWorker.start()
this.serviceWorker.extractParams(request)
this.serviceWorker.extractUrl(request)
this.serviceWorker.extractHeaders(request)
this.serviceWorker.version
```

## Description

The `serviceWorker` service runs in the browser's service worker context, intercepting requests and handling them using the same call handler pipeline as the server. Falls back to network requests when server-side rendering isn't possible.

## Examples

### Service Worker Bundle

```javascript
// View to serve service worker JS
export default {
    async render() {
        const { js } = await this.bundler.build('serviceWorker');
        return [200, {
            'content-type': 'text/javascript'
        }, [
            `${js}\n//# sourceMappingURL=/service_worker.js.map`
        ]];
    }
}
```

### HTML Registration

```javascript
export default {
    async render() {
        const version = await this.version;
        const urlSearchParams = new URLSearchParams({ version });

        return this.renderHtml`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="pinstripe-service-worker-url"
                      content="/service_worker.js?${urlSearchParams}">
            </head>
            <body>...</body>
            </html>
        `;
    }
}
```

### Custom Request Handling

```javascript
export default {
    async handleRequest(request) {
        const params = await this.serviceWorker.extractParams(request);

        switch (params._method) {
            case 'GET':
                return this.handleGetRequest(params);
            case 'POST':
                return this.handlePostRequest(params);
            default:
                return fetch(request);
        }
    }
}
```

## Features

- Request interception in service worker scope
- Parameter extraction (URL, headers, body)
- Same rendering pipeline as server
- Automatic network fallback
- Version-based cache busting

## Automatic Behavior

The service worker automatically:
1. Intercepts fetch requests
2. Extracts parameters
3. Attempts server-side rendering via `callHandler`
4. Falls back to network on failure

## Notes

- Requires HTTPS in production
- Automatically registered when supported
- Included in `serviceWorker` bundle target
- Uses `version` service for cache invalidation
