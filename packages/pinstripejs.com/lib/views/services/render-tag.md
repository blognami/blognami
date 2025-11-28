---
menus:
    sidebar: ["Services", "renderTag"]
---
# renderTag

Generate HTML elements with attributes.

## Interface

```javascript
this.renderTag(tagName, attributes)
this.renderTag(attributes)  // defaults to 'div'
```

### Parameters

- **tagName** (optional) - HTML tag name, defaults to 'div'
- **attributes** - Object with attributes and optional `body` for content

### Returns

- Rendered HTML element

## Description

The `renderTag` service generates HTML elements with proper attribute formatting. It handles self-closing tags automatically and supports boolean attributes.

## Self-Closing Tags

Automatically handled: `area`, `base`, `br`, `embed`, `hr`, `iframe`, `img`, `input`, `link`, `meta`, `param`, `slot`, `source`, `track`, `wbr`

## Examples

### Basic Elements

```javascript
// Div with class
this.renderTag({ class: 'container', body: 'Content' })
// <div class="container">Content</div>

// Paragraph
this.renderTag('p', { body: 'Hello World' })
// <p>Hello World</p>

// Input (self-closing)
this.renderTag('input', { type: 'text', name: 'email' })
// <input type="text" name="email">
```

### Buttons and Links

```javascript
// Submit button
this.renderTag('button', {
    type: 'submit',
    class: 'btn btn-primary',
    body: 'Save'
})
// <button type="submit" class="btn btn-primary">Save</button>

// Link
this.renderTag('a', {
    href: '/dashboard',
    body: 'Go to Dashboard'
})
// <a href="/dashboard">Go to Dashboard</a>
```

### Boolean Attributes

```javascript
// Disabled button
this.renderTag('button', { disabled: true, body: 'Loading...' })
// <button disabled>Loading...</button>

// Checked checkbox
this.renderTag('input', { type: 'checkbox', checked: isActive })
// <input type="checkbox" checked>  (if isActive is true)
```

### Complex Content

```javascript
// Nested elements
this.renderTag('div', {
    class: 'card',
    body: this.renderHtml`
        ${this.renderTag('h2', { body: title })}
        ${this.renderTag('p', { body: description })}
    `
})
```

## Notes

- Attributes with `undefined` values are omitted
- Boolean `true` adds attribute without value (`disabled`, not `disabled="true"`)
- Use `body` attribute for element content
- Integrates with `renderHtml` for nested content
