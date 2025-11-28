---
menus:
    sidebar: ["Services", "view"]
---
# view

Access the current view instance.

## Interface

```javascript
const currentView = this.view;
```

### Returns

- Current view instance, or `undefined` outside view context

## Properties

| Property | Description |
|----------|-------------|
| `hash` | Unique hash identifier for the view |
| `isRoot` | Boolean - is this the root view? |
| `cssClasses` | Auto-generated CSS class helpers |
| `context` | Execution context with params and parent |
| `constructor.name` | View class name |

## Description

The `view` service provides access to the current view instance, enabling introspection of view properties and context hierarchy. Useful for debugging, conditional rendering, and style scoping.

## Examples

### Access View Properties

```javascript
export default {
    render() {
        const view = this.view;

        return this.renderHtml`
            <div class="${view.cssClasses.container}">
                <p>View: ${view.constructor.name}</p>
                <p>Hash: ${view.hash}</p>
                <p>Is Root: ${view.isRoot}</p>
            </div>
        `;
    }
}
```

### Root vs Nested Behavior

```javascript
export default {
    render() {
        if (this.view.isRoot) {
            return this.renderView('_layout', {
                body: this.renderHtml`<h1>Root Page</h1>`
            });
        }

        return this.renderHtml`
            <div class="nested">
                ${this.params.body}
            </div>
        `;
    }
}
```

### Development Debugging

```javascript
export default {
    async render() {
        const env = await this.environment;

        if (env === 'development') {
            console.log('View:', {
                name: this.view.constructor.name,
                hash: this.view.hash,
                params: this.view.context.params
            });
        }

        return this.renderView('_layout', { body: 'Content' });
    }
}
```

### Scoped Styles

```javascript
export default {
    render() {
        const uniqueClass = `view-${this.view.hash}`;

        return this.renderHtml`
            <div class="${uniqueClass}">
                <style>
                    .${uniqueClass} { padding: 1rem; }
                </style>
                <p>Scoped content</p>
            </div>
        `;
    }
}
```

## Notes

- Synchronous access (no `await` needed)
- Only available within view rendering context
- Same instance as the executing view
- `cssClasses` is equivalent to `this.cssClasses`
