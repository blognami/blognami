---
menus:
    sidebar: ["Services", "renderHtml"]
---
# renderHtml

Render HTML using tagged template literals with automatic escaping.

## Interface

```javascript
this.renderHtml`<div>${value}</div>`
```

### Returns

- An Html instance that can be converted to an HTTP response

## Description

The `renderHtml` service is a tagged template literal function that safely renders HTML. It automatically escapes interpolated values to prevent XSS attacks while allowing nested `renderHtml` calls to embed trusted HTML content.

## Examples

### Basic Usage

```javascript
export default {
    render() {
        const { title, message } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <h1>${title}</h1>
                <p>${message}</p>
            </div>
        `;
    }
}
```

### Composing Views

```javascript
export default {
    render() {
        return this.renderHtml`
            <main>
                ${this.renderView('_header')}
                <article>${this.params.body}</article>
                ${this.renderView('_footer')}
            </main>
        `;
    }
}
```

### Conditional Content

```javascript
export default {
    render() {
        const { user, showBadge } = this.params;

        return this.renderHtml`
            <nav>
                ${user
                    ? this.renderHtml`<span>Welcome, ${user.name}</span>`
                    : this.renderHtml`<a href="/login">Sign In</a>`
                }
                ${showBadge && this.renderHtml`<span class="badge">New</span>`}
            </nav>
        `;
    }
}
```

### Lists and Iteration

```javascript
export default {
    async render() {
        const items = await this.database.posts.all();

        return this.renderHtml`
            <ul>
                ${items.map(item => this.renderHtml`
                    <li>${item.title}</li>
                `)}
            </ul>
        `;
    }
}
```

## Notes

- String values are automatically HTML-escaped to prevent XSS
- Nested `renderHtml` calls are rendered as trusted HTML
- Arrays are automatically joined
- Falsy values (`false`, `undefined`, `null`) render as empty strings
- Available both server-side and client-side
