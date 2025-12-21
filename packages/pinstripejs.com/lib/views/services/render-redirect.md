---
menu:
    path: ["Services", "renderRedirect"]
---
# renderRedirect

Perform client-side redirects via custom elements.

## Interface

```javascript
this.renderRedirect(attributes)
```

### Parameters

- **attributes** - Object with redirect options
  - `url` - The URL to redirect to
  - `target` - Redirect context: `'_top'` (whole page), `'_parent'` (parent frame/overlay)

### Returns

- Html instance containing a `<pinstripe-redirect>` element

## Description

The `renderRedirect` service generates redirect elements that are processed by the client-side framework to perform navigation. It's commonly used after form submissions, authentication flows, and action handlers.

## Examples

### Basic Redirect

```javascript
// Redirect to a path
return this.renderRedirect({ url: '/dashboard' });
```

### Full Page Redirect

```javascript
// Redirect the entire page
return this.renderRedirect({ url: '/login', target: '_top' });
```

### After Form Submission

```javascript
this.renderForm(this.database.posts, {
    fields: ['title', 'body'],
    success: ({ id }) => this.renderRedirect({
        url: `/posts/${id}`,
        target: '_top'
    })
})
```

### Conditional Redirect

```javascript
export default {
    async render() {
        if (await this.isSignedOut) {
            return this.renderRedirect({ url: '/login' });
        }
        return this.renderView('dashboard');
    }
}
```

## Notes

- Use `target: '_top'` for full page navigation
- Use `target: '_parent'` within overlay/modal contexts
- Omitting `target` uses context-dependent behavior
- Integrates with HTTP responses via `toResponseArray()`
