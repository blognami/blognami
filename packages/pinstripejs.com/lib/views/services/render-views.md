---
sidebar:
    category: ["Services", "renderViews"]
---
# renderViews Service

## Interface

The service creates an async function that accepts multiple parameters:

```javascript
await this.renderViews(includePattern, excludePattern, params)
await this.renderViews(includePattern, params)
await this.renderViews(includePattern)
```

### Parameters

- **`includePattern`** (string) - Glob pattern for matching view names to include (e.g., `'_sidebar/_*'`, `'index/_*'`). Uses `*` as wildcard for matching any characters except `/`.
- **`excludePattern`** (string, optional) - Glob pattern for excluding specific views from the matched set
- **`params`** (object, optional) - Parameters to pass to all matched views. Defaults to `{}`. These become available as `this.params` within each rendered view.

### Return Value

Returns a `Promise` that resolves to:
- An **array** of rendered content from all matching views (typically `Html` instances)
- Views are automatically sorted by their `displayOrder` property (default: 100), then alphabetically by name
- Empty array if no views match the pattern

## Description

The `renderViews` service is a powerful batch rendering mechanism that:

1. **Matches multiple views** using glob patterns through the `matchViews` service
2. **Renders all matching views** by calling `renderView` for each matched view
3. **Passes shared parameters** to all rendered views, making it ideal for consistent data distribution
4. **Maintains rendering order** by sorting views by `displayOrder` metadata, then alphabetically
5. **Returns an array** of rendered content that can be easily composed into larger templates
6. **Supports pattern-based view organization** enabling modular and extensible view architectures

This service is essential for creating modular layouts where multiple related views need to be rendered together with consistent parameters.

## Examples

### Basic Multiple View Rendering

```javascript
// Render all sidebar components
export default {
    async render() {
        return this.renderHtml`
            <aside class="sidebar">
                ${this.renderViews('_sidebar/_*')}
            </aside>
        `;
    }
}
```

### Layout with Multiple Sections

```javascript
// Render all views in the index directory
export default {
    async render() {
        const home = await this.database.home;
        
        return this.renderView('_layout', {
            meta: [{ title: home.metaTitle || await this.database.site.title }],
            body: this.renderViews('index/_*', this.params)
        });
    }
}
```

### Passing Parameters to Multiple Views

```javascript
// Pass tag data to all tag-related views
export default {
    async render() {
        const { tag } = this.params;
        
        return this.renderView('_layout', {
            meta: [
                { title: tag.metaTitle || tag.name },
                { name: 'description', content: tag.metaDescription }
            ],
            body: this.renderViews('_pageables/_tag/_*', { tag })
        });
    }
}
```

### Navigation Menu Generation

```javascript
// Render all navigation links
export default {
    async render() {
        return this.renderHtml`
            <nav class="navbar">
                <ul class="nav-links">
                    ${this.renderViews('_navbar/_links/_*')}
                </ul>
            </nav>
        `;
    }
}
```

### Dropdown Menu with Dynamic Items

```javascript
// Render menu items inside a popover
export default {
    async render() {
        if (await this.isSignedOut) return;

        return this.renderHtml`
            <pinstripe-popover>
                <pinstripe-menu>
                    ${this.renderViews('_navbar/_links/_find_content/menu/_*')}
                </pinstripe-menu>
            </pinstripe-popover>
        `;
    }
}
```

### Conditional Rendering with Shared Parameters

```javascript
// Render user account actions with user context
export default {
    async render() {
        const user = await this.session?.user;
        if (!user) return;

        return this.renderHtml`
            <div class="user-actions">
                <h3>Your Account</h3>
                <div class="actions">
                    ${this.renderViews('_actions/user/your_account/_*', { user })}
                </div>
            </div>
        `;
    }
}
```

### Template Composition Pattern

```javascript
// Compose multiple view sections into a cohesive layout
export default {
    async render() {
        const { post } = this.params;
        
        return this.renderView('_layout', {
            title: post.title,
            body: this.renderHtml`
                <article class="post">
                    <header>
                        ${this.renderViews('_post/_header/_*', { post })}
                    </header>
                    
                    <div class="content">
                        ${this.renderViews('_post/_content/_*', { post })}
                    </div>
                    
                    <footer>
                        ${this.renderViews('_post/_footer/_*', { post })}
                    </footer>
                </article>
            `
        });
    }
}
```

### Reusable Component Pattern

```javascript
// Create reusable link components using renderViews
export default {
    async render() {
        if (await this.isSignedIn) return;

        return this.renderViews('_navbar/_link', {
            href: '/_actions/guest/sign_in',
            target: '_overlay',
            'data-preload': 'true',
            'data-test-id': 'sign-in',
            body: 'Sign in'
        });
    }
}
```

### Admin Interface Pattern

```javascript
// Conditionally render admin-specific views
export default {
    async render() {
        if (await this.isSignedOut) return;
        if (await this.user.role !== 'admin') return;

        return this.renderViews('_navbar/_link', {
            href: '/_navbar/_links/_find_content/menu',
            target: '_overlay',
            'data-preload': 'true',
            'data-test-id': 'find-content',
            body: 'Find'
        });
    }
}
```

### Complex Dashboard Layout

```javascript
// Render dashboard widgets with shared data
export default {
    async render() {
        const user = await this.session.user;
        const stats = await this.database.getUserStats(user.id);
        
        return this.renderView('_layout', {
            title: 'Dashboard',
            body: this.renderHtml`
                <div class="dashboard">
                    <aside class="sidebar">
                        ${this.renderViews('_dashboard/_sidebar/_*', { user, stats })}
                    </aside>
                    
                    <main class="content">
                        <div class="widgets">
                            ${this.renderViews('_dashboard/_widgets/_*', { user, stats })}
                        </div>
                        
                        <div class="recent-activity">
                            ${this.renderViews('_dashboard/_activity/_*', { user })}
                        </div>
                    </main>
                </div>
            `
        });
    }
}
```

### Plugin/Extension Pattern

```javascript
// Allow third-party views to extend functionality
export default {
    async render() {
        const baseViews = this.renderViews('_core/_features/_*', this.params);
        const pluginViews = this.renderViews('_plugins/_*/features/_*', this.params);
        
        return this.renderHtml`
            <div class="feature-grid">
                ${baseViews}
                ${pluginViews}
            </div>
        `;
    }
}
```

## View Organization Strategies

### Directory-Based Grouping
```
_navbar/
  _links/
    _sign_in.js
    _sign_out.js
    _profile.js
    _admin.js
```

```javascript
// Renders all navigation links
this.renderViews('_navbar/_links/_*')
```

### Feature-Based Grouping
```
_dashboard/
  _widgets/
    _stats.js
    _recent_posts.js
    _activity_feed.js
```

```javascript
// Renders all dashboard widgets
this.renderViews('_dashboard/_widgets/_*', { user })
```

### Role-Based Grouping
```
_actions/
  user/
    your_account/
      _edit_profile.js
      _change_password.js
      _view_history.js
```

```javascript
// Renders all user account actions
this.renderViews('_actions/user/your_account/_*', { user })
```

## Display Order Control

Views are automatically sorted by their `displayOrder` metadata:

```javascript
// In _sidebar/_search.js
export default {
    meta() {
        this.assignProps({
            displayOrder: 10  // Renders early
        });
    },
    
    async render() {
        return this.renderHtml`<div class="search">...</div>`;
    }
}

// In _sidebar/_recent.js  
export default {
    meta() {
        this.assignProps({
            displayOrder: 20  // Renders after search
        });
    },
    
    async render() {
        return this.renderHtml`<div class="recent">...</div>`;
    }
}
```

## Error Handling

The service handles rendering errors gracefully:

```javascript
export default {
    async render() {
        try {
            const views = await this.renderViews('_components/_*', this.params);
            return this.renderHtml`<div class="components">${views}</div>`;
        } catch (error) {
            console.error('Component rendering failed:', error);
            return this.renderView('_error', { 
                message: 'Some components failed to load' 
            });
        }
    }
}
```

## Pattern Matching Rules

- **`*`** matches any characters except `/` (single directory level)
- **`_*`** matches all views starting with underscore in current directory
- **`_sidebar/_*`** matches all views in the `_sidebar` directory
- **Exact names** like `_layout` match only that specific view
- **No wildcards** means exact match only

## Performance Considerations

- **Batch rendering**: More efficient than multiple individual `renderView` calls
- **Shared parameters**: Parameters are passed to all views, avoid heavy objects unless needed by all
- **View sorting**: Automatic sorting by `displayOrder` happens once per call
- **Parallel rendering**: Views are rendered sequentially, not in parallel
- **Empty results**: Returns empty array rather than null/undefined for easier template composition

## Common Anti-Patterns

### ❌ Avoid excessive nesting
```javascript
// Too complex - hard to debug
this.renderViews('_deep/_nested/_complex/_views/_*')
```

### ❌ Avoid heavy parameters
```javascript
// Don't pass large objects unless all views need them
this.renderViews('_widgets/_*', { 
    massiveDataSet: allDatabaseRecords  // Wasteful
})
```

### ❌ Avoid logic in patterns
```javascript
// Pattern should be static, not dynamic
const pattern = someCondition ? '_admin/_*' : '_user/_*';
this.renderViews(pattern); // Better to handle conditionally
```

## Integration with Other Services

### With renderView
```javascript
// Mix single and multiple view rendering
return this.renderView('_layout', {
    header: this.renderView('_header'),
    sidebar: this.renderViews('_sidebar/_*'),
    footer: this.renderView('_footer')
});
```

### With renderHtml
```javascript
// Compose with HTML templates
return this.renderHtml`
    <div class="container">
        ${this.renderViews('_components/_*', this.params)}
    </div>
`;
```

### With Database Queries
```javascript
// Share database results across multiple views
const posts = await this.database.posts.recent(10);
return this.renderViews('_post/_summary/_*', { posts });
```