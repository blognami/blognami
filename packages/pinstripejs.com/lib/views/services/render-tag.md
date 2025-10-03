---
sidebar:
    category: ["Services", "renderTag"]
---
# renderTag Service

The `renderTag` service provides a clean and flexible way to render HTML tags with attributes and content. It handles both self-closing and container tags, with automatic attribute formatting and content injection.

## Interface

The service creates a function that can be called in multiple ways:

### Default Tag Name (div)
```javascript
this.renderTag({ 
    tagName: 'span',
    class: 'my-class',
    body: 'Content'
})
```

### Explicit Tag Name as First Parameter
```javascript
this.renderTag('button', {
    class: 'btn',
    type: 'submit',
    body: 'Click me'
})
```

### Tag Name in Attributes Object
```javascript
this.renderTag({
    tagName: 'input',
    type: 'text',
    name: 'username',
    placeholder: 'Enter username'
})
```

## Description

The `renderTag` service is a utility for generating HTML tags with proper attribute handling and content injection. It:

1. **Handles any HTML tag** by accepting a tag name as either the first parameter or within the attributes object
2. **Manages self-closing tags** automatically based on HTML5 standards (input, img, br, etc.)
3. **Formats attributes properly** including boolean attributes, data attributes, and special characters
4. **Injects content safely** using the `body` attribute for tag content
5. **Defaults to div** when no tag name is specified
6. **Integrates with renderHtml** to return safe HTML content

The service automatically recognizes self-closing tags (`area`, `base`, `br`, `embed`, `hr`, `iframe`, `img`, `input`, `link`, `meta`, `param`, `slot`, `source`, `track`, `wbr`) and renders them without closing tags.

## Key Features

- **Flexible Tag Creation**: Support for any HTML tag with dynamic tag name selection
- **Smart Attribute Handling**: Proper formatting of boolean attributes, data attributes, and special cases
- **Self-Closing Detection**: Automatic handling of void/self-closing HTML elements
- **Content Injection**: Safe content insertion via the `body` attribute
- **HTML Integration**: Returns `Html` instances that integrate with other rendering services
- **Boolean Attributes**: Proper handling of HTML boolean attributes (disabled, checked, etc.)

## Examples

### Basic Tag Creation
```javascript
// Simple div with class
this.renderTag({ class: 'container' })
// Result: <div class="container"></div>

// Paragraph with content
this.renderTag('p', { body: 'Hello World' })
// Result: <p>Hello World</p>

// Input field (self-closing)
this.renderTag('input', { type: 'text', name: 'email' })
// Result: <input type="text" name="email">
```

### Button Components
```javascript
// Primary button
this.renderTag('button', {
    type: 'submit',
    class: 'btn btn-primary',
    body: 'Save Changes'
})
// Result: <button type="submit" class="btn btn-primary">Save Changes</button>

// Disabled button
this.renderTag('button', {
    disabled: true,
    body: 'Loading...'
})
// Result: <button disabled>Loading...</button>

// Button with data attributes
this.renderTag('button', {
    'data-action': 'delete',
    'data-confirm': 'Are you sure?',
    class: 'btn-danger',
    body: 'Delete'
})
// Result: <button data-action="delete" data-confirm="Are you sure?" class="btn-danger">Delete</button>
```

### Form Elements
```javascript
// Text input with placeholder
this.renderTag('input', {
    type: 'text',
    name: 'username',
    placeholder: 'Enter your username',
    required: true
})
// Result: <input type="text" name="username" placeholder="Enter your username" required>

// Select dropdown
this.renderTag('select', {
    name: 'country',
    class: 'form-control',
    body: this.renderHtml`
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="uk">United Kingdom</option>
    `
})
// Result: <select name="country" class="form-control">...</select>

// Checkbox with label wrapper
this.renderTag('label', {
    class: 'checkbox-wrapper',
    body: this.renderHtml`
        ${this.renderTag('input', { type: 'checkbox', name: 'terms', value: '1' })}
        I agree to the terms and conditions
    `
})
```

### Link and Navigation Elements
```javascript
// Navigation link
this.renderTag('a', {
    href: '/dashboard',
    class: 'nav-link',
    'data-active': isActive,
    body: 'Dashboard'
})
// Result: <a href="/dashboard" class="nav-link" data-active="true">Dashboard</a>

// External link with target
this.renderTag('a', {
    href: 'https://example.com',
    target: '_blank',
    rel: 'noopener noreferrer',
    body: 'Visit Example'
})
```

### Media and Embedded Content
```javascript
// Image tag (self-closing)
this.renderTag('img', {
    src: '/images/logo.png',
    alt: 'Company Logo',
    class: 'logo',
    width: '200',
    height: '100'
})
// Result: <img src="/images/logo.png" alt="Company Logo" class="logo" width="200" height="100">

// Video element
this.renderTag('video', {
    controls: true,
    width: '640',
    height: '480',
    body: this.renderHtml`
        <source src="movie.mp4" type="video/mp4">
        <source src="movie.ogg" type="video/ogg">
        Your browser does not support the video tag.
    `
})
```

### Custom Components and Web Components
```javascript
// Custom redirect component
this.renderTag('pinstripe-redirect', {
    url: '/dashboard',
    target: '_top'
})
// Result: <pinstripe-redirect url="/dashboard" target="_top"></pinstripe-redirect>

// Custom data component
this.renderTag('data-table', {
    'data-source': '/api/users',
    'data-columns': JSON.stringify(['name', 'email', 'role']),
    class: 'responsive-table'
})
```

### Dynamic Tag Names
```javascript
// Dynamic tag selection based on level
const level = 2;
this.renderTag(`h${level}`, {
    class: 'section-title',
    body: 'Section Title'
})
// Result: <h2 class="section-title">Section Title</h2>

// Conditional tag names
const tagName = isLink ? 'a' : 'span';
this.renderTag(tagName, {
    ...(isLink ? { href: '/profile' } : {}),
    class: 'user-name',
    body: userName
})
```

### Boolean and Conditional Attributes
```javascript
// Boolean attributes
this.renderTag('input', {
    type: 'checkbox',
    name: 'newsletter',
    checked: userPreferences.newsletter,
    disabled: !canModify
})

// Conditional attributes (undefined values are ignored)
this.renderTag('div', {
    class: 'modal',
    id: modalId || undefined,
    'data-backdrop': showBackdrop ? 'true' : undefined,
    'aria-hidden': !isVisible
})

// Complex conditional attribute building
this.renderTag('button', {
    type: isSubmit ? 'submit' : 'button',
    class: [
        'btn',
        isPrimary && 'btn-primary',
        isDangerous && 'btn-danger',
        isSmall && 'btn-sm'
    ].filter(Boolean).join(' '),
    disabled: isLoading || isDisabled,
    body: isLoading ? 'Loading...' : buttonText
})
```

### Advanced Content Injection
```javascript
// Complex body content with nested rendering
this.renderTag('article', {
    class: 'blog-post',
    body: this.renderHtml`
        ${this.renderTag('header', {
            class: 'post-header',
            body: this.renderHtml`
                ${this.renderTag('h1', { body: post.title })}
                ${this.renderTag('time', { datetime: post.publishedAt, body: formatDate(post.publishedAt) })}
            `
        })}
        ${this.renderTag('div', {
            class: 'post-content',
            body: this.renderMarkdown(post.content)
        })}
    `
})

// Building complex forms
this.renderTag('form', {
    method: 'post',
    action: '/contact',
    class: 'contact-form',
    body: fields.map(field => this.renderTag('div', {
        class: 'form-group',
        body: this.renderHtml`
            ${this.renderTag('label', { 
                for: field.name, 
                body: field.label 
            })}
            ${this.renderTag('input', {
                type: field.type,
                name: field.name,
                id: field.name,
                required: field.required,
                placeholder: field.placeholder
            })}
        `
    }))
})
```

### Integration with CSS Classes and Styling
```javascript
// Using CSS class utilities
this.renderTag('div', {
    class: [
        this.cssClasses.root,
        isActive && this.cssClasses.active,
        hasError && this.cssClasses.error
    ].filter(Boolean).join(' '),
    body: content
})

// Inline styles (when necessary)
this.renderTag('div', {
    style: `
        background-color: ${backgroundColor};
        width: ${width}px;
        height: ${height}px;
    `,
    body: content
})
```

### Meta Tags and Document Head Elements
```javascript
// Meta tags (self-closing)
this.renderTag('meta', {
    name: 'description',
    content: pageDescription
})
// Result: <meta name="description" content="Page description">

this.renderTag('meta', {
    property: 'og:title',
    content: pageTitle
})
// Result: <meta property="og:title" content="Page Title">

// Link tags for stylesheets and resources
this.renderTag('link', {
    rel: 'stylesheet',
    href: '/css/styles.css'
})
// Result: <link rel="stylesheet" href="/css/styles.css">
```

## Special Attribute Handling

### Boolean Attributes
```javascript
// Boolean true adds attribute without value
this.renderTag('input', { disabled: true, checked: true })
// Result: <input disabled checked>

// Boolean false or undefined omits the attribute
this.renderTag('input', { disabled: false, checked: undefined })
// Result: <input>
```

### Data Attributes
```javascript
// Data attributes are passed through as-is
this.renderTag('div', {
    'data-component': 'modal',
    'data-config': JSON.stringify(config),
    'data-toggle': 'collapse'
})
```

### Aria Attributes
```javascript
// Accessibility attributes
this.renderTag('button', {
    'aria-label': 'Close dialog',
    'aria-expanded': isOpen,
    'aria-controls': 'menu-items',
    body: '×'
})
```

## Self-Closing Tags

The service automatically handles these self-closing HTML5 tags:
- `area`, `base`, `br`, `embed`, `hr`, `iframe`, `img`, `input`, `link`, `meta`, `param`, `slot`, `source`, `track`, `wbr`

Self-closing tags ignore the `body` attribute and render without closing tags.

## Return Value

The service returns an `Html` instance that:
- Can be converted to string with `toString()`
- Can be used in HTTP responses with `toResponseArray()`
- Is recognized by other `renderHtml` calls as safe HTML content
- Integrates seamlessly with the Pinstripe view system

## Common Patterns

### Component-Style Usage
```javascript
// Reusable button component
renderButton(text, options = {}) {
    return this.renderTag('button', {
        type: 'button',
        class: 'btn',
        ...options,
        body: text
    });
}

// Usage
this.renderButton('Save', { type: 'submit', class: 'btn btn-primary' })
```

### Form Field Generation
```javascript
// Generate form fields dynamically
const fields = [
    { name: 'email', type: 'email', label: 'Email Address', required: true },
    { name: 'password', type: 'password', label: 'Password', required: true }
];

return fields.map(field => this.renderTag('div', {
    class: 'form-group',
    body: this.renderHtml`
        ${this.renderTag('label', { 
            for: field.name,
            body: field.label 
        })}
        ${this.renderTag('input', {
            type: field.type,
            name: field.name,
            id: field.name,
            required: field.required
        })}
    `
}));
```

## Error Handling

The service handles undefined and null values gracefully:
- Undefined attribute values are omitted from the output
- Null values are converted to empty strings
- Missing `body` content results in empty tag content (for non-self-closing tags)
- Invalid tag names are passed through as-is (browser will handle invalid HTML)