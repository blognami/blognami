---
menus:
    sidebar: ["Services", "renderView"]
---
# renderView Service

## Interface

The service creates an async function that accepts two parameters:

```javascript
await this.renderView(viewName, params)
```

### Parameters

- **`viewName`** (string) - The name/path of the view to render. Can include path separators (`/`) for nested views (e.g., `'_layout'`, `'_pinstripe/_panel'`, `'legal/_page'`)
- **`params`** (object, optional) - Parameters to pass to the view. Defaults to `{}`. These become available as `this.params` within the rendered view.

### Return Value

Returns a `Promise` that resolves to:
- The rendered content (typically an `Html` instance that can be converted to an HTTP response)
- `undefined` if the view doesn't exist or the view mapping fails

## Description

The `renderView` service is the core view rendering mechanism in Pinstripe that:

1. **Resolves view names** through the view mapping system (`this.viewMap`) to find the actual view file
2. **Creates view contexts** with isolated parameter scopes for each view
3. **Renders views asynchronously** by calling the view's `render()` method
4. **Supports nested rendering** where views can render other views recursively
5. **Provides automatic context management** ensuring each view has access to services and parameters
6. **Handles view resolution** returning `undefined` for non-existent views (allowing graceful fallbacks)

The service is available on all views via `this.renderView` and is automatically added to the client-side context for use in browser environments.

## Examples

### Basic View Rendering

```javascript
// Render a simple view without parameters
export default {
    async render() {
        return this.renderView('_layout');
    }
}
```

### View with Parameters

```javascript
// Pass parameters to a view
export default {
    async render() {
        return this.renderView('_layout', {
            title: 'Welcome',
            body: 'Hello World!'
        });
    }
}
```

### Nested View Rendering

```javascript
// Views rendering other views
export default {
    async render() {
        return this.renderView('_layout', {
            title: 'My Page',
            body: this.renderView('_section', {
                title: 'Content Section',
                body: this.renderHtml`<p>Section content here</p>`
            })
        });
    }
}
```

### Complex Nested Structure

```javascript
export default {
    async render() {
        return this.renderView('_layout', {
            title: 'Complex Page',
            body: this.renderHtml`
                <div class="container">
                    ${this.renderView('_header')}
                    <main>
                        ${this.renderView('_sidebar')}
                        ${this.renderView('_content', { 
                            body: this.renderMarkdown(content) 
                        })}
                    </main>
                    ${this.renderView('_footer')}
                </div>
            `
        });
    }
}
```

### Conditional View Rendering

```javascript
export default {
    async render() {
        const { user } = this.params;
        const isAdmin = user?.role === 'admin';
        
        return this.renderView('_layout', {
            body: this.renderHtml`
                ${() => {
                    if (isAdmin) {
                        return this.renderView('_admin_panel', { user });
                    }
                    return this.renderView('_user_content', { user });
                }}
            `
        });
    }
}
```

### Dynamic View Selection

```javascript
export default {
    async render() {
        const { pageable } = this.params;
        
        // Dynamically select view based on object type
        const viewName = `_pageables/_${pageable.constructor.name}`;
        const result = await this.renderView(viewName, { 
            [pageable.constructor.name]: pageable 
        });
        
        // Fallback if specific view doesn't exist
        if (result === undefined) {
            return this.renderView('_404');
        }
        
        return result;
    }
}
```

### Async Data Loading with View Rendering

```javascript
export default {
    async render() {
        const posts = await this.database.posts.published();
        
        if (await posts.count() > 0) {
            return this.renderView('_posts', {
                posts,
                showLoadMore: true
            });
        }
        
        return this.renderView('_empty_state', {
            message: 'No posts found'
        });
    }
}
```

### Delegating to Pinstripe Components

```javascript
export default {
    render() {
        // Delegate to built-in Pinstripe views
        return this.renderView('_pinstripe/_panel', {
            title: 'User Settings',
            body: this.renderView('_pinstripe/_form', {
                model: this.user,
                fields: ['name', 'email']
            })
        });
    }
}
```

### Response Manipulation

```javascript
export default {
    async render() {
        const response = await this.renderView('_layout', {
            title: 'Not Found',
            body: this.renderHtml`<p>Page not found</p>`
        });
        
        // Convert to response array and modify status
        const [status, headers, body] = response.toResponseArray();
        return [404, headers, body];
    }
}
```

### Integration with Forms and Actions

```javascript
export default {
    async render() {
        return this.renderView('_layout', {
            body: this.renderView('_panel', {
                title: 'Edit Profile',
                body: this.renderForm(this.user, {
                    fields: ['name', 'email', 'bio']
                }),
                footer: this.renderView('_button', {
                    href: '/profile',
                    body: 'Cancel'
                })
            })
        });
    }
}
```

### Multi-View Composition

```javascript
export default {
    async render() {
        const user = await this.session?.user;
        
        return this.renderView('_layout', {
            body: this.renderHtml`
                <article>
                    <header>
                        ${this.renderView('_navbar')}
                    </header>
                    
                    <div class="content-wrapper">
                        <aside>
                            ${this.renderView('_sidebar/_navigation')}
                            ${this.renderView('_sidebar/_recent_posts')}
                            ${this.renderView('_sidebar/_categories')}
                        </aside>
                        
                        <main>
                            ${this.renderView('_content', this.params)}
                        </main>
                    </div>
                    
                    <footer>
                        ${this.renderView('_footer')}
                    </footer>
                </article>
            `
        });
    }
}
```

## Error Handling

The service handles missing views gracefully:

```javascript
export default {
    async render() {
        // Try specific view first
        let result = await this.renderView('custom/_special_layout');
        
        // Fallback to default if view doesn't exist
        if (result === undefined) {
            result = await this.renderView('_layout');
        }
        
        return result;
    }
}
```

## View Resolution

Views are resolved through the view mapping system:
- View names are mapped through `this.viewMap[name]`
- If no mapping exists, `renderView` returns `undefined`
- Views can be organized in nested directories using `/` separators
- Special prefixes like `_pinstripe/` refer to framework-provided views

## Performance Considerations

- **Async rendering**: Always `await` `renderView` calls when you need the result
- **Parameter passing**: Only pass necessary parameters to avoid unnecessary data transfer
- **View caching**: The framework handles view instance caching automatically
- **Nested efficiency**: Prefer composing views over deeply nested HTML templates

## Integration Patterns

### With Database Models
```javascript
const post = await this.database.posts.find(id);
return this.renderView('_pageables/_post', { post });
```

### With Services
```javascript
return this.renderView('_layout', {
    body: this.renderTable(this.database.users, {
        fields: ['name', 'email', 'role']
    })
});
```

### With Client-Side Features
```javascript
// renderView is available client-side too
return this.renderView('_modal', {
    body: await this.renderView('_form', formConfig)
});
```