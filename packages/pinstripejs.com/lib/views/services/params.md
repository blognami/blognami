---
menus:
    sidebar: ["Services", "params"]
---
# params

Access request parameters for the current context.

## Interface

```javascript
this.params
```

### Returns

- Object containing URL parameters, form data, and HTTP metadata

## Properties

| Property | Description |
|----------|-------------|
| `_method` | HTTP method (GET, POST, PUT, DELETE, etc.) |
| `_url` | URL object with pathname, hostname, searchParams |
| `_headers` | HTTP headers (lowercase keys) |
| `_body` | Raw request body (POST/PUT/PATCH only) |
| `_bodyErrors` | Validation errors from body parsing |
| Custom properties | URL query params and form fields merged in |

## Description

The `params` service provides access to all request data: URL query parameters, form fields, JSON payloads, file uploads, and HTTP metadata. Parameters from different sources are merged into a single object.

## Examples

### Basic Parameter Access

```javascript
export default {
    async render() {
        const { id, name, email } = this.params;

        return this.renderHtml`
            <p>ID: ${id}</p>
            <p>Name: ${name}</p>
        `;
    }
}
```

### Request Method Handling

```javascript
export default {
    async render() {
        if (this.params._method === 'GET') {
            return this.renderForm(this.database.users, { fields: ['name', 'email'] });
        }

        if (this.params._method === 'POST') {
            const { name, email } = this.params;
            await this.database.users.insert({ name, email });
            return this.renderRedirect({ url: '/users' });
        }
    }
}
```

### Pagination

```javascript
export default {
    async render() {
        const page = parseInt(this.params.page) || 1;
        const search = this.params.search || '';

        const posts = await this.database.posts
            .where({ titleContains: search })
            .paginate(page, 10);

        return this.renderView('posts/list', { posts, page, search });
    }
}
```

### File Uploads

```javascript
export default {
    async render() {
        if (this.params._method === 'POST') {
            const { title, image } = this.params;

            if (image && image.data) {
                const { filename, mimeType, data } = image;
                // Process uploaded file
            }
        }
    }
}
```

## Notes

- URL query params are strings (convert with `parseInt()` as needed)
- Form checkbox values are `'on'` or `undefined`
- File uploads include `filename`, `mimeType`, and `data` (Buffer)
- Check `_bodyErrors` for upload/parsing errors
