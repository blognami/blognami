---
sidebar:
    category: ["Services", "cssClassesFor"]
---
# cssClassesFor Service

The `cssClassesFor` service generates scoped CSS class names for views based on a view name identifier. It creates unique, collision-free CSS class names by combining a view name with a hash and dynamically generating property names.

## Interface

```javascript
cssClassesFor(viewName: string): ProxyObject
```

### Parameters

- **`viewName`** (string) - The name of the view or component to generate CSS classes for. This can be any string identifier, typically a view path like `'_markdown_editor/modal'` or a component name.

### Returns

- **ProxyObject** - A proxy object that dynamically generates CSS class names when properties are accessed. Each property access returns a string in the format: `view-{hash}-{dasherized-property-name}`

## How It Works

1. **Hash Generation**: Creates a 10-character hash from the provided view name using SHA1
2. **Dynamic Property Access**: Uses a proxy with `__getMissing` to handle any property access
3. **Class Name Format**: Returns CSS class names in the format `view-{hash}-{property-name}`
4. **Property Name Transformation**: Converts camelCase property names to dasherized format (e.g. `lineInserter` → `line-inserter`)

## Examples

### Basic Usage

```javascript
// Generate CSS classes for a modal component
const modalClasses = this.cssClassesFor('_markdown_editor/modal');

// Access properties to get generated class names
modalClasses.lineInserter
// Result: "view-a1b2c3d4e5-line-inserter"

modalClasses.submitButton  
// Result: "view-a1b2c3d4e5-submit-button"

modalClasses.errorMessage
// Result: "view-a1b2c3d4e5-error-message"
```

### In HTML Templates

```javascript
// Using in renderHtml templates
export default {
    render(){
        const editorClasses = this.cssClassesFor('_markdown_editor/modal');
        
        return this.renderHtml`
            <div class="${editorClasses.container}">
                <button class="${editorClasses.lineInserter}" data-line-content="/help">
                    Insert Help
                </button>
                <button class="${editorClasses.submitButton}">
                    Save Changes
                </button>
            </div>
        `;
    }
}
```

### Cross-Component Class Sharing

```javascript
// Different views can reference the same component's classes
export default {
    render(){
        // Reference classes from another component
        const modalClasses = this.cssClassesFor('_markdown_editor/modal');
        
        return this.renderHtml`
            <span class="${modalClasses.lineInserter}" data-line-content="![${image.title}](/${image.slug})">
                <script type="pinstripe">
                    this.parent.trigger('click');
                </script>
            </span>
        `;
    }
}
```

### Dynamic Class Generation

```javascript
// Generate classes dynamically based on context
export default {
    render(){
        const componentName = this.params.component || 'default';
        const classes = this.cssClassesFor(`components/${componentName}`);
        
        return this.renderHtml`
            <div class="${classes.wrapper}">
                <header class="${classes.header}">Title</header>
                <main class="${classes.content}">Content</main>
                <footer class="${classes.footer}">Footer</footer>
            </div>
        `;
    }
}
```

### Form Elements with Generated Classes

```javascript
// Generate form-specific classes
export default {
    render(){
        const formClasses = this.cssClassesFor('forms/user_profile');
        
        return this.renderHtml`
            <form class="${formClasses.container}">
                <div class="${formClasses.fieldGroup}">
                    <label class="${formClasses.label}">Name</label>
                    <input class="${formClasses.textInput}" type="text" name="name">
                </div>
                <div class="${formClasses.fieldGroup}">
                    <label class="${formClasses.label}">Email</label>
                    <input class="${formClasses.emailInput}" type="email" name="email">
                </div>
                <div class="${formClasses.actions}">
                    <button class="${formClasses.submitButton}" type="submit">Save</button>
                    <button class="${formClasses.cancelButton}" type="button">Cancel</button>
                </div>
            </form>
        `;
    }
}
```

### Multiple Component Classes in One View

```javascript
// Use classes from multiple components
export default {
    render(){
        const editorClasses = this.cssClassesFor('_markdown_editor/modal');
        const toolbarClasses = this.cssClassesFor('_toolbar/actions');
        const buttonClasses = this.cssClassesFor('_ui/buttons');
        
        return this.renderHtml`
            <div class="${editorClasses.container}">
                <div class="${toolbarClasses.wrapper}">
                    <button class="${buttonClasses.primary} ${editorClasses.saveAction}">
                        Save
                    </button>
                    <button class="${buttonClasses.secondary} ${editorClasses.cancelAction}">
                        Cancel
                    </button>
                </div>
                <textarea class="${editorClasses.textArea}"></textarea>
            </div>
        `;
    }
}
```

## Class Name Format

The generated CSS class names follow this format:

```
view-{10-char-hash}-{dasherized-property-name}
```

### Examples:
- `this.cssClassesFor('_modal').container` → `"view-a1b2c3d4e5-container"`
- `this.cssClassesFor('_modal').submitButton` → `"view-a1b2c3d4e5-submit-button"`
- `this.cssClassesFor('user/profile').firstName` → `"view-x9y8z7w6v5-first-name"`

## Use Cases

### Component Styling
- **Scoped CSS**: Generate unique class names that won't conflict with other components
- **Component Libraries**: Create reusable components with predictable class names
- **Theme Systems**: Generate themed class names based on component types

### Cross-View Integration
- **Shared Components**: Reference the same component's classes from multiple views
- **Plugin Systems**: Allow plugins to reference core component styles
- **Modal Integration**: Reference modal-specific classes from trigger elements

### Dynamic Styling
- **Conditional Classes**: Generate classes based on runtime conditions
- **User Preferences**: Create user-specific styling variations
- **A/B Testing**: Generate different class sets for testing

## Performance Notes

- **Hash Caching**: The same view name will always generate the same hash
- **Lazy Generation**: Class names are only generated when properties are accessed
- **Memory Efficient**: Uses proxy objects rather than pre-generating all possible class names
- **Deterministic**: Same input always produces the same output across server/client

## Integration with View System

The `cssClassesFor` service integrates with the view system's built-in `cssClasses` property:

```javascript
// Every view automatically has access to its own scoped classes
export default {
    render(){
        // This uses cssClassesFor internally with the view's constructor name
        return this.renderHtml`<div class="${this.cssClasses.container}">Content</div>`;
    }
}
```

The `this.cssClasses` property is equivalent to calling `this.cssClassesFor(this.constructor.name)`.