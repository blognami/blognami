---
menu:
    path: ["Services", "cookies"]
---
# cookies

Read-only access to HTTP cookies from the request.

## Interface

```javascript
this.cookies
```

### Returns

- Object with cookie names as keys and URL-decoded values as strings

## Description

The `cookies` service parses the HTTP `Cookie` header and provides access to individual cookie values. Values are automatically URL-decoded. To set cookies, include `Set-Cookie` headers in your response.

## Examples

### Basic Cookie Access

```javascript
export default {
    async render() {
        const { sessionId, theme } = this.cookies;

        return this.renderHtml`
            <p>Session: ${sessionId}</p>
            <p>Theme: ${theme || 'light'}</p>
        `;
    }
}
```

### Session Management

```javascript
export default {
    create() {
        return this.defer(async () => {
            const { pinstripeSession } = this.cookies;
            if (!pinstripeSession) return;

            const [id, passString] = pinstripeSession.split(':');
            return this.database.sessions
                .where({ id, passString })
                .first();
        });
    }
}
```

### User Preferences

```javascript
export default {
    async render() {
        const { theme = 'light', language = 'en' } = this.cookies;

        return this.renderHtml`
            <div class="${theme}-theme" lang="${language}">
                <!-- Content -->
            </div>
        `;
    }
}
```

## Setting Cookies

To set cookies, add `Set-Cookie` headers to your response:

```javascript
export default {
    async render() {
        const content = this.renderHtml`<p>Cookie set!</p>`;
        const [status, headers, body] = content.toResponseArray();

        headers['Set-Cookie'] = 'theme=dark; Path=/';

        return [status, headers, body];
    }
}
```

### Session Cookie with Security

```javascript
const [status, headers, body] = this.renderRedirect({ target: '_top' }).toResponseArray();

headers['Set-Cookie'] = [
    `pinstripeSession=${session.id}:${passString}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    process.env.NODE_ENV === 'production' ? 'Secure' : ''
].filter(Boolean).join('; ');
```

### Clear Cookie

```javascript
headers['Set-Cookie'] = 'pinstripeSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
```

## Notes

- Read-only: use response headers to set cookies
- Values are automatically URL-decoded
- Parsed once and cached for the request duration
- Malformed cookies are silently ignored
