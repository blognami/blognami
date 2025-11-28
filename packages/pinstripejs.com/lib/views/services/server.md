---
menus:
    sidebar: ["Services", "server"]
---
# server

HTTP server with request handling and file uploads.

## Interface

```javascript
this.server.start(options)
this.server.extractParams(request, baseUrl, limits)
this.server.parseBody(request, limits)
this.server.createHash(data)
```

## Methods

| Method | Description |
|--------|-------------|
| `start({ hostname, port })` | Start HTTP server |
| `extractParams(req, baseUrl, limits)` | Extract request parameters |
| `parseBody(req, limits)` | Parse request body |
| `createHash(data)` | Generate SHA1 ETag |

## Description

The `server` service creates HTTP servers, handles requests, parses bodies including file uploads, and integrates with the call handler system. Images are automatically resized using Sharp.

## Configuration

```javascript
// pinstripe.config.js
export default {
    server: {
        limits: {
            bodySize: 100_000_000,    // 100MB max body
            fileSize: 10_000_000,     // 10MB max file
            imageWidth: 1024,          // Max image width
            imageHeight: 1024          // Max image height
        }
    }
};
```

## Examples

### Start Server

```javascript
export default {
    run() {
        const { host = '127.0.0.1:3000' } = this.params;
        const [hostname, port] = host.split(':');

        this.server.start({
            hostname: hostname || '127.0.0.1',
            port: parseInt(port) || 3000
        });
    }
}
```

### Handle File Uploads

```javascript
export default {
    async render() {
        const { profileImage } = this.params;

        if (profileImage) {
            // profileImage: { filename, mimeType, encoding, data: Buffer }
            await this.saveImage(profileImage.data);
        }

        return this.renderView('upload-success');
    }
}
```

### Check Upload Errors

```javascript
export default {
    async render() {
        const { _bodyErrors } = this.params;

        if (_bodyErrors?.general) {
            return this.renderError(`Upload failed: ${_bodyErrors.general}`);
        }

        return this.processUpload(this.params);
    }
}
```

### Custom ETag

```javascript
export default {
    async render() {
        const data = await this.fetchData();
        const etag = this.server.createHash(data);

        if (this.params._headers['if-none-match'] === etag) {
            return [304, { etag }, []];
        }

        return [200, { etag, 'content-type': 'application/json' }, [data]];
    }
}
```

## Features

- Automatic image resizing with Sharp
- ETag generation for caching
- Multipart form data parsing
- JSON and URL-encoded body support
- Configurable size limits

## Notes

- Uses Node.js `http` module internally
- Integrates with `callHandler` for request processing
- TIFF images converted to WebP automatically
- Logs requests (disabled in test environment)
