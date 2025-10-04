---
sidebar:
    category: ["Services", "renderHtml"]
---
# renderHtml Service

The `renderHtml` service provides a safe and powerful way to render HTML content with automatic escaping, template literal support, and advanced value resolution.

## Interface

The service creates a function that can be called in two ways:

### Template Literal Syntax (Primary Usage)
```javascript
this.renderHtml`<div>Content here</div>`
```

### Function Call Syntax
```javascript
this.renderHtml(value1, value2, ...)
```

## Description

The `renderHtml` service is a template rendering utility built on top of the `Html` class that:

1. **Automatically escapes values** to prevent XSS attacks by converting special characters (`&`, `<`, `>`, `"`) to HTML entities
2. **Supports template literals** with interpolated values using tagged template syntax
3. **Resolves complex values** including promises, arrays, functions, and objects with `toHtml()` methods
4. **Handles conditional rendering** with support for `false`, `undefined`, and `null` values (renders as empty string)
5. **Processes nested structures** by recursively resolving arrays and callable values

The service is available on all views via `this.renderHtml` and is automatically added to the client-side context.

## Key Features

- **XSS Protection**: All interpolated values are automatically escaped unless they are already `Html` instances
- **Async Resolution**: Supports promises and async functions in interpolated values
- **Array Handling**: Arrays are flattened and joined automatically
- **Function Support**: Functions are called and their return values are processed
- **Object Integration**: Objects with `toHtml()` methods are properly integrated
- **Conditional Logic**: Falsy values (`false`, `undefined`, `null`) render as empty strings

## Examples

### Basic HTML Rendering
```javascript
// Simple HTML with escaped content
this.renderHtml`<h1>${title}</h1>`

// With attributes
this.renderHtml`<div class="${className}" id="${elementId}">Content</div>`
```

### Conditional Rendering
```javascript
// Conditional attributes
this.renderHtml`<input ${disabled ? this.renderHtml`disabled` : ''} />`

// Conditional content blocks
${isAdmin ? this.renderHtml`
    <div class="admin-panel">
        <a href="/admin">Admin Dashboard</a>
    </div>
` : ''}
```

### Array and List Rendering
```javascript
// Rendering lists
this.renderHtml`
    <ul>
        ${items.map(item => this.renderHtml`
            <li>${item.name}</li>
        `)}
    </ul>
`

// Table rows
${rows.map(row => this.renderHtml`
    <tr>
        ${columns.map(column => this.renderHtml`
            <td>${column.cell(row)}</td>
        `)}
    </tr>
`)}
```

### Complex Nested Structures
```javascript
// Nested rendering with functions
this.renderHtml`
    <section>
        ${() => {
            if(user.isAdmin) {
                return this.renderHtml`
                    <div class="admin-tools">
                        ${adminActions.map(action => this.renderHtml`
                            <button onclick="${action.handler}">${action.label}</button>
                        `)}
                    </div>
                `;
            }
            return this.renderHtml`<p>Access denied</p>`;
        }}
    </section>
`
```

### Form Elements with Dynamic Attributes
```javascript
// Select with dynamic options
this.renderHtml`
    <select name="${fieldName}">
        ${Object.entries(options).map(([value, label]) => this.renderHtml`
            <option value="${value}"${value == selectedValue ? this.renderHtml` selected="selected"` : ''}>${label}</option>
        `)}
    </select>
`

// Input with conditional attributes
this.renderHtml`
    <input 
        type="text" 
        name="${name}"
        ${placeholder ? this.renderHtml`placeholder="${placeholder}"` : undefined}
        ${component ? this.renderHtml`data-component="${component}"` : undefined}
        class="${baseClass}${error ? ` ${errorClass}` : ''}"
    />
`
```

### Function Call Syntax for JSON Data
```javascript
// Rendering JSON data safely
this.renderHtml`
    <script type="application/json">
        ${this.renderHtml(JSON.stringify(data))}
    </script>
`

// In JavaScript contexts
this.renderHtml`
    <script>
        window.config = ${this.renderHtml(JSON.stringify(config))};
    </script>
`
```

### Building HTML Programmatically
```javascript
// Building HTML in parts
const out = [];
out.push(this.renderHtml`<div class="${className}">`);
if(hasHeader) {
    out.push(this.renderHtml`<header>${headerContent}</header>`);
}
out.push(this.renderHtml`<main>${mainContent}</main>`);
out.push(this.renderHtml`</div>`);

return this.renderHtml`${out}`;
```

### Integration with Other Services
```javascript
// Using with renderTag service
const attributes = { 
    class: 'button', 
    'data-action': 'submit',
    disabled: isDisabled || undefined 
};

return this.renderTag('button', {
    ...attributes,
    body: this.renderHtml`${buttonText}`
});
```

### Error-Safe Rendering
```javascript
// Values that are null, undefined, or false render as empty strings
this.renderHtml`
    <div>
        ${user?.name}  <!-- Safe even if user is null -->
        ${showBadge && this.renderHtml`<span class="badge">New</span>`}
    </div>
`
```

## Security Considerations

- **Automatic Escaping**: All string values are automatically HTML-escaped
- **Raw HTML**: To include raw HTML, wrap it in an `Html` instance or use nested `renderHtml` calls
- **XSS Prevention**: The service helps prevent Cross-Site Scripting attacks through automatic escaping
- **JSON Safety**: When embedding JSON in HTML, always use `this.renderHtml(JSON.stringify(data))`

## Return Value

The service returns an `Html` instance that:
- Can be converted to string with `toString()`
- Can be used in HTTP responses with `toResponseArray()`
- Is recognized by other `renderHtml` calls as safe HTML content
- Integrates seamlessly with the Pinstripe view system

## Performance Notes

- Template processing is async-aware and handles promises efficiently
- Array flattening is optimized for nested structures
- Function calls are resolved recursively with proper context
- The service is designed for server-side rendering with client-side availability