---
menus:
    sidebar: ["Services", "cssClassesFor"]
---
# cssClassesFor

Generate scoped CSS class names for views.

## Interface

```javascript
this.cssClassesFor(viewName)
```

### Parameters

- **viewName** - View name/path to scope classes for

### Returns

- Proxy object that generates class names on property access

## Description

The `cssClassesFor` service generates unique, collision-free CSS class names by hashing the view name. Each property access returns a class name in the format `view-{hash}-{dasherized-name}`.

Views have automatic access to scoped classes via `this.cssClasses`, which is equivalent to `this.cssClassesFor(this.constructor.name)`.

## Examples

### Basic Usage

```javascript
const classes = this.cssClassesFor('_modal');

classes.container      // "view-a1b2c3d4e5-container"
classes.submitButton   // "view-a1b2c3d4e5-submit-button"
```

### In View Templates

```javascript
export default {
    render() {
        // Uses this.cssClasses (shorthand for cssClassesFor with view name)
        return this.renderHtml`
            <div class="${this.cssClasses.container}">
                <button class="${this.cssClasses.submitButton}">Save</button>
            </div>
        `;
    }
}
```

### Cross-Component References

```javascript
export default {
    render() {
        // Reference another component's classes
        const modalClasses = this.cssClassesFor('_markdown_editor/modal');

        return this.renderHtml`
            <span class="${modalClasses.lineInserter}" data-content="text">
                Insert
            </span>
        `;
    }
}
```

### Form Styling

```javascript
export default {
    render() {
        const formClasses = this.cssClassesFor('forms/user_profile');

        return this.renderHtml`
            <form class="${formClasses.container}">
                <label class="${formClasses.label}">Name</label>
                <input class="${formClasses.textInput}">
            </form>
        `;
    }
}
```

## Class Name Format

```
view-{10-char-hash}-{dasherized-property-name}
```

- `cssClassesFor('_modal').submitButton` → `"view-a1b2c3d4e5-submit-button"`
- `cssClassesFor('user/profile').firstName` → `"view-x9y8z7w6v5-first-name"`

## Notes

- Same view name always produces the same hash
- Class names generated lazily on property access
- camelCase properties are converted to dash-case
- Use `this.cssClasses` in views for automatic scoping
