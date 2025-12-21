---
menu:
    path: ["Services", "renderView"]
---
# renderView

Render a view by name with optional parameters.

## Interface

```javascript
await this.renderView(viewName, params)
```

### Parameters

- **viewName** (string) - The view name/path to render (e.g., `'_layout'`, `'admin/dashboard'`)
- **params** (object, optional) - Parameters passed to the view as `this.params`

### Returns

- Rendered HTML content, or `undefined` if the view doesn't exist

## Description

The `renderView` service is the primary way to compose views in Pinstripe. It resolves view names through the view mapping system, creates isolated parameter contexts, and renders views asynchronously. Views can render other views recursively to build complex page structures.

## Examples

### Basic Usage

```javascript
export default {
    async render() {
        return this.renderView('_layout', {
            title: 'Welcome',
            body: this.renderHtml`<p>Hello World!</p>`
        });
    }
}
```

### Nested View Composition

```javascript
export default {
    async render() {
        return this.renderView('_layout', {
            title: 'Dashboard',
            body: this.renderHtml`
                <div class="dashboard">
                    ${this.renderView('_sidebar')}
                    ${this.renderView('_content', { data: this.params.data })}
                </div>
            `
        });
    }
}
```

### Conditional Rendering with Fallback

```javascript
export default {
    async render() {
        const { type } = this.params;

        // Try type-specific view first
        const result = await this.renderView(`_types/_${type}`);

        // Fall back to default if view doesn't exist
        if (result === undefined) {
            return this.renderView('_types/_default');
        }

        return result;
    }
}
```

## Notes

- View names starting with `_` are typically partials (e.g., `_header`, `_footer`)
- Use `/` for nested views (e.g., `'admin/users'`)
- The service is available both server-side and client-side
- Returns `undefined` for non-existent views, enabling graceful fallbacks
