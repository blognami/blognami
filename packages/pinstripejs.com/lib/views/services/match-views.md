---
sidebar:
    category: ["Services", "matchViews"]
---
# matchViews Service

## Interface

The service creates an async function that accepts multiple parameters:

```javascript
await this.matchViews(includePatterns, excludePatterns)
await this.matchViews(includePatterns)
await this.matchViews()
```

### Parameters

- **`includePatterns`** (string|array, optional) - Glob pattern(s) for matching view names to include. Defaults to `"*"` (matches all views)
- **`excludePatterns`** (string|array, optional) - Glob pattern(s) for excluding specific views from the matched set. Defaults to `[]` (no exclusions)

### Return Value

Returns a `Promise` that resolves to:
- An **array of strings** containing the names of matching views
- Views are automatically sorted by their `displayOrder` property (default: 100), then alphabetically by name
- Empty array if no views match the pattern

## Description

The `matchViews` service is a view discovery and filtering mechanism that:

1. **Finds views by pattern matching** using glob-style patterns with `*` wildcards
2. **Filters the view registry** by checking all registered view names against include/exclude patterns
3. **Normalizes patterns** by converting string patterns to regular expressions for efficient matching
4. **Supports both inclusion and exclusion** patterns for precise view selection
5. **Returns sorted view names** ordered by `displayOrder` metadata, then alphabetically
6. **Powers higher-level services** like `renderViews` by providing the list of views to render

The service is essential for dynamic view discovery in modular architectures where views are organized by naming conventions and need to be discovered at runtime.

## Examples

### Basic Pattern Matching

```javascript
// Match all views
const allViews = await this.matchViews();
// Returns: ['index', 'about', 'contact', '_layout', '_sidebar/_about', ...]

// Match all views starting with underscore
const privateViews = await this.matchViews('_*');
// Returns: ['_layout', '_sidebar', '_navbar', ...]

// Match views in a specific directory
const sidebarViews = await this.matchViews('_sidebar/_*');
// Returns: ['_sidebar/_about', '_sidebar/_links', ...]
```

### Multiple Pattern Matching

```javascript
// Using array of include patterns
const navAndSidebarViews = await this.matchViews(['_navbar/_*', '_sidebar/_*']);
// Returns: ['_navbar/_links', '_sidebar/_about', ...]

// Complex pattern matching
const specificViews = await this.matchViews(['index/_*', '_pageables/_*']);
// Returns: ['index/_header', '_pageables/_tag/_title', ...]
```

### Exclusion Patterns

```javascript
// Include all sidebar views except private ones
const publicSidebarViews = await this.matchViews('_sidebar/_*', '_sidebar/__*');
// Returns: ['_sidebar/_about', '_sidebar/_links'] (excludes '__private' views)

// Include all views except layouts and errors
const contentViews = await this.matchViews('*', ['_layout*', '_error*']);
// Returns: all views except those starting with '_layout' or '_error'

// Exclude multiple patterns
const filteredViews = await this.matchViews(
    '_components/_*', 
    ['_components/_deprecated*', '_components/_test*']
);
// Returns: component views excluding deprecated and test components
```

### Navigation Menu Discovery

```javascript
// Find all navigation link views
export default {
    async render() {
        const linkViews = await this.matchViews('_navbar/_links/_*');
        // Returns: ['_navbar/_links/_home', '_navbar/_links/_about', ...]
        
        return this.renderHtml`
            <nav>
                ${linkViews.map(name => this.renderView(name))}
            </nav>
        `;
    }
}
```

### Dynamic Component Loading

```javascript
// Discover all dashboard widgets
export default {
    async render() {
        if (!await this.isAdmin) return;
        
        const widgetViews = await this.matchViews('_dashboard/_widgets/_*');
        // Returns: ['_dashboard/_widgets/_analytics', '_dashboard/_widgets/_users', ...]
        
        const widgets = await Promise.all(
            widgetViews.map(name => this.renderView(name, this.params))
        );
        
        return this.renderHtml`
            <div class="dashboard">
                ${widgets}
            </div>
        `;
    }
}
```

### Plugin/Extension Discovery

```javascript
// Find all plugin views dynamically
export default {
    async render() {
        // Core features
        const coreViews = await this.matchViews('_core/_features/_*');
        
        // Third-party plugins
        const pluginViews = await this.matchViews('_plugins/_*/features/_*');
        
        return this.renderHtml`
            <div class="features">
                <h2>Core Features</h2>
                ${coreViews.map(name => this.renderView(name))}
                
                <h2>Plugin Features</h2>
                ${pluginViews.map(name => this.renderView(name))}
            </div>
        `;
    }
}
```

### Conditional View Discovery

```javascript
// Admin-only view discovery
export default {
    async render() {
        const basePattern = '_admin/_tools/_*';
        const excludePattern = await this.user.isSuperAdmin 
            ? [] 
            : '_admin/_tools/_system*';
            
        const toolViews = await this.matchViews(basePattern, excludePattern);
        
        return this.renderHtml`
            <div class="admin-tools">
                ${toolViews.map(name => this.renderView(name, { user: this.user }))}
            </div>
        `;
    }
}
```

### View Inventory and Debugging

```javascript
// List all views for debugging
export default {
    async render() {
        if (!await this.isDevelopment) return;
        
        const allViews = await this.matchViews();
        const publicViews = await this.matchViews('*', '_*');
        const privateViews = await this.matchViews('_*');
        
        return this.renderHtml`
            <div class="view-inventory">
                <h3>All Views (${allViews.length})</h3>
                <ul>${allViews.map(name => `<li>${name}</li>`)}</ul>
                
                <h3>Public Views (${publicViews.length})</h3>
                <ul>${publicViews.map(name => `<li>${name}</li>`)}</ul>
                
                <h3>Private Views (${privateViews.length})</h3>
                <ul>${privateViews.map(name => `<li>${name}</li>`)}</ul>
            </div>
        `;
    }
}
```

## Pattern Matching Rules

### Wildcard Patterns
- **`*`** matches any characters except `/` (single directory level)
- **`_*`** matches all views starting with underscore in current directory
- **`_sidebar/_*`** matches all views in the `_sidebar` directory
- **`admin/*`** matches all views directly under `admin/` directory

### Exact Patterns
- **`index`** matches only the `index` view
- **`_layout`** matches only the `_layout` view
- **`admin/users`** matches only the `admin/users` view

### Multiple Directory Levels
- **`admin/users/_*`** matches all views under `admin/users/`
- **`_pageables/_tag/_*`** matches all views under `_pageables/_tag/`

### Pattern Normalization
- String patterns are converted to regular expressions
- `*` wildcards become `[^/]*` regex patterns
- Patterns are anchored with `^` and `$` for exact matching
- Array patterns are processed individually and combined with OR logic

## Display Order Control

Views are sorted by:
1. **`displayOrder`** property (numeric, default: 100)
2. **Alphabetical order** by view name (as tiebreaker)

```javascript
// In a view file
export const displayOrder = 10;  // This view appears first

export default {
    render() {
        return this.renderHtml`<div>Priority content</div>`;
    }
}
```

## Integration with Other Services

### Used by renderViews Service
```javascript
// renderViews internally uses matchViews
export default {
    async renderViews(...args) {
        const lastArg = args[args.length - 1];
        const params = typeof lastArg == 'object' && !Array.isArray(lastArg) ? args.pop() : {};
        const out = [];
        for(const name of await this.matchViews(...args)){
            out.push(await this.renderView(name, params));
        }
        return out;
    }
}
```

### Service Creation Pattern
```javascript
// Service uses defer pattern for lazy evaluation
export default {
    create(){
        return (...args) => this.defer(() => this.matchViews(...args));
    }
}
```

## Performance Considerations

- **View registry caching**: The `viewMap` is cached for performance
- **Pattern compilation**: Patterns are compiled to regex once and reused
- **Sorting optimization**: Views are sorted once after filtering
- **Lazy evaluation**: Service uses `defer()` pattern for on-demand execution

## Common Use Cases

1. **Navigation generation** - Discover menu items dynamically
2. **Widget/component loading** - Find all widgets in a section
3. **Plugin architecture** - Discover third-party extensions
4. **Admin interfaces** - Find admin-specific tools and views
5. **Theme customization** - Allow themes to override specific view sets
6. **Feature flags** - Conditionally include/exclude views based on features
7. **Development tools** - List and debug available views

## Error Handling

The service handles edge cases gracefully:
- Returns empty array if no views match
- Handles undefined or null patterns
- Normalizes single strings to arrays internally
- Filters out non-existent views from the registry

## Common Anti-Patterns

### ❌ Avoid overly broad patterns
```javascript
// Too broad - matches everything
await this.matchViews('*')  // Returns hundreds of views
```

### ❌ Avoid complex nested exclusions
```javascript
// Too complex to understand and maintain
await this.matchViews('_*', ['_admin/_*', '_test/_*', '_deprecated/_*'])
```

### ❌ Avoid dynamic pattern generation
```javascript
// Pattern should be predictable, not dynamic
const pattern = Math.random() > 0.5 ? '_admin/_*' : '_user/_*';
await this.matchViews(pattern);  // Unpredictable behavior
```

## Best Practices

### ✅ Use descriptive patterns
```javascript
// Clear intent - get all sidebar components
await this.matchViews('_sidebar/_components/_*')
```

### ✅ Combine with conditionals
```javascript
// Check permissions before matching admin views
if (await this.isAdmin) {
    const adminViews = await this.matchViews('_admin/_*');
}
```

### ✅ Use consistent naming conventions
```javascript
// Following naming patterns makes matching predictable
// _navbar/_links/_*, _sidebar/_widgets/_*, _footer/_components/_*
```