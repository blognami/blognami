---
menus:
    sidebar: ["Services", "parseHtml"]
---
# parseHtml

Parse HTML strings into a traversable virtual DOM.

## Interface

```javascript
this.parseHtml(htmlString)
```

### Parameters

- **htmlString** - HTML string to parse

### Returns

- VirtualNode tree structure

## Description

The `parseHtml` service converts HTML strings into VirtualNode objects for traversal and manipulation. Useful for content processing, URL extraction, and HTML transformation.

## VirtualNode API

```javascript
node.type          // Element type ('div', '#text', '#comment', '#fragment')
node.attributes    // Object of element attributes
node.children      // Array of child VirtualNodes
node.text          // Concatenated text content of all descendants
node.traverse(fn)  // Recursively call fn on all nodes
node.toString()    // Serialize back to HTML
```

## Examples

### Basic Parsing

```javascript
const node = this.parseHtml('<div class="container">Hello</div>');

node.children[0].type              // 'div'
node.children[0].attributes.class  // 'container'
node.text                          // 'Hello'
```

### Extract Content

```javascript
const html = await this.renderMarkdown(body);

this.parseHtml(html).traverse(node => {
    if (node.type === 'h1') {
        title = node.text;
    }
});
```

### Find All Links

```javascript
const links = [];
const virtualDom = this.parseHtml(htmlContent);

virtualDom.traverse(node => {
    if (node.type === 'a' && node.attributes.href) {
        links.push({
            href: node.attributes.href,
            text: node.text
        });
    }
});
```

### Extract URLs

```javascript
const urls = [];
const virtualDom = this.parseHtml(html);

virtualDom.traverse(({ attributes }) => {
    ['src', 'href'].forEach(name => {
        if (attributes[name]) {
            urls.push(attributes[name]);
        }
    });
});
```

## Notes

- Handles self-closing tags (`img`, `br`, `input`)
- Preserves comments and doctypes
- HTML entity decoding for attributes and text
- Gracefully handles malformed HTML
