---
menus:
    sidebar: ["Services", "callHandler"]
---
# callHandler

Core request processing engine.

## Interface

```javascript
await this.callHandler.handleCall(params, useContext)
```

### Parameters

- **params** - Request parameters: `_url`, `_method`, `_headers`, plus custom params
- **useContext** - Use current context (`true`) or create new (`false`, default)

### Returns

- `[status, headers, body]` - HTTP response array

## Description

The `callHandler` service orchestrates the request-response cycle. It normalizes parameters, resolves views (guards, main views, defaults), and converts responses to HTTP format. Used by the server, service worker, and for programmatic view rendering.

## View Resolution Order

1. **Guard views** - `guard.js`, `admin/guard.js` (for authorization)
2. **Main view** - The requested view (if not `_` prefixed)
3. **Default views** - `default.js`, `admin/default.js` (fallbacks)

## Examples

### Programmatic Request

```javascript
const [status, headers, body] = await this.callHandler.handleCall({
    _url: new URL('/dashboard', 'http://localhost'),
    _method: 'get'
});

console.log(status);  // 200
console.log(body);    // ['<html>...</html>']
```

### POST Request with Data

```javascript
const [status, headers, body] = await this.callHandler.handleCall({
    _url: new URL('/contact', 'http://localhost'),
    _method: 'post',
    _headers: { 'content-type': 'application/json' },
    name: 'John',
    email: 'john@example.com'
});
```

### Static Site Generation

```javascript
export default {
    async run() {
        const urls = View.names
            .filter(path => !path.match(/(^|\/)_/))
            .map(path => new URL(path, 'http://127.0.0.1/'));

        for (const url of urls) {
            const [status, headers, body] = await this.callHandler.handleCall({
                _url: url
            });

            if (status === 200) {
                await this.writeFile(url.pathname, body.join(''));
            }
        }
    }
}
```

### Testing Views

```javascript
test('homepage renders', async () => {
    const [status, headers, body] = await this.callHandler.handleCall({
        _url: new URL('/', 'http://localhost')
    });

    assert.equal(status, 200);
    assert(body.join('').includes('<title>'));
});
```

## Notes

- Creates isolated workspace context by default
- Returns `[404, {...}, ['Not found']]` for missing views
- Used internally by `server` and `serviceWorker` services
