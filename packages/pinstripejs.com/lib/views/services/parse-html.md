---
sidebar:
    category: ["Services", "parseHtml"]
---
# parseHtml Service

## Interface

The service creates a function that takes an HTML string and returns a VirtualNode:

```javascript
this.parseHtml(htmlString) → VirtualNode
```

## Description

The `parseHtml` service is an HTML parser that converts HTML strings into a virtual DOM representation using the `VirtualNode` class. It provides:

1. **Complete HTML parsing** - Parses all HTML elements, attributes, text nodes, comments, and doctypes
2. **Virtual DOM creation** - Returns a `VirtualNode` tree structure that can be traversed and manipulated
3. **Safe attribute handling** - Properly handles HTML entity decoding for attributes and text content
4. **Self-closing tag support** - Correctly handles self-closing tags like `<img>`, `<br>`, `<input>`, etc.
5. **Text-only tag handling** - Special handling for `<script>` and `<style>` tags where content is treated as raw text
6. **Comment and doctype preservation** - Preserves HTML comments and doctype declarations

The parsed VirtualNode provides methods for:
- **Tree traversal** via `traverse(callback)` method
- **Text extraction** via `.text` getter that concatenates all text nodes
- **HTML serialization** via `toString()` method
- **JSON serialization** via `serialize()` method

## Examples

### Basic HTML Parsing

```javascript
// Simple element parsing
const node = this.parseHtml('<div class="container">Hello World</div>');
console.log(node.children[0].type); // 'div'
console.log(node.children[0].attributes.class); // 'container'
console.log(node.text); // 'Hello World'
```

### Complex HTML Structure

```javascript
// Parsing complex HTML with nested elements
const html = `
    <article class="post">
        <header>
            <h1>Article Title</h1>
            <meta name="author" content="John Doe">
        </header>
        <div class="content">
            <p>First paragraph.</p>
            <p>Second paragraph with <strong>bold text</strong>.</p>
        </div>
    </article>
`;

const virtualDom = this.parseHtml(html);
console.log(virtualDom.children.length); // Number of top-level elements
```

### Extracting Text Content

```javascript
// Extract text from HTML for title generation
const renderedBody = await this.renderMarkdown(body);
this.parseHtml(renderedBody).traverse(node => {
    if(node.type == 'h1') {
        entity.title = node.text; // Gets all text within the h1
    }
});
```

### Traversing the DOM Tree

```javascript
// Find all links in HTML content
const links = [];
const virtualDom = this.parseHtml(htmlContent);

virtualDom.traverse(node => {
    if(node.type === 'a' && node.attributes.href) {
        links.push({
            href: node.attributes.href,
            text: node.text
        });
    }
});
```

### Extracting URLs from HTML

```javascript
// Extract all URLs from src and href attributes
const urls = [];
const virtualDom = this.parseHtml(html);

virtualDom.traverse(({ attributes }) => {
    ['src', 'href'].forEach(name => {
        const value = attributes[name];
        if(value) {
            const url = new URL(value, 'http://127.0.0.1/');
            if(url.host === '127.0.0.1') {
                urls.push(url);
            }
        }
    });
});
```

### Processing Markdown with Custom Blocks

```javascript
// Parse markdown-rendered HTML and transform custom blocks
const html = new MarkdownIt({ html: true }).render(markdown);
const virtualNode = this.parseHtml(html);

virtualNode.children.forEach(paragraph => {
    if(paragraph.type !== 'p') return;
    
    const text = paragraph.children[0];
    if(!text || text.type !== '#text') return;
    
    const { value } = text.attributes;
    const matches = value.match(/^\/([^\/\s]*)(.*)$/);
    
    if(matches) {
        const [, name, args] = matches;
        
        // Transform paragraph into custom component
        paragraph.type = 'div';
        paragraph.attributes = {
            ...paragraph.attributes,
            'data-component': 'pinstripe-frame',
            'data-url': `/_markdown_slash_blocks/${name}?args=${encodeURIComponent(args)}`
        };
        paragraph.children = [];
    }
});
```

### Working with Attributes

```javascript
// Parse HTML with complex attributes
const html = '<a class="&pound; special" href="?foo=apple&bar=pear">Link</a>';
const node = this.parseHtml(html);

const linkElement = node.children[0];
console.log(linkElement.attributes.class); // "£ special" (unescaped)
console.log(linkElement.attributes.href);  // "?foo=apple&bar=pear"
```

### Handling Self-Closing Tags

```javascript
// Self-closing tags are parsed correctly
const html = '<img src="image.jpg" alt="Photo"><br><input type="text" name="email">';
const virtualDom = this.parseHtml(html);

virtualDom.traverse(node => {
    console.log(`${node.type}: ${node.attributes.src || node.attributes.type || 'no-attr'}`);
});
// Output: img: image.jpg, br: no-attr, input: text
```

### Comments and Doctypes

```javascript
// Comments and doctypes are preserved
const html = '<!DOCTYPE html><!-- This is a comment --><html><head></head></html>';
const virtualDom = this.parseHtml(html);

virtualDom.traverse(node => {
    if(node.type === '#doctype') console.log('Found doctype');
    if(node.type === '#comment') console.log('Comment:', node.attributes.value);
});
```

### Converting Back to HTML

```javascript
// Parse and then serialize back to HTML
const originalHtml = '<div class="test">Content <strong>here</strong></div>';
const virtualDom = this.parseHtml(originalHtml);

// Modify the virtual DOM
virtualDom.children[0].attributes.class = 'modified';

// Convert back to HTML string
const modifiedHtml = virtualDom.toString();
console.log(modifiedHtml); // '<div class="modified">Content <strong>here</strong></div>'
```

### Error-Safe Parsing

```javascript
// parseHtml handles malformed HTML gracefully
const malformedHtml = '<div><p>Unclosed paragraph<div>Nested div</div>';
const virtualDom = this.parseHtml(malformedHtml);

// The parser will do its best to create a valid tree structure
console.log(virtualDom.toString()); // Returns valid HTML
```

## VirtualNode API

The returned VirtualNode provides the following interface:

### Properties
- `type` - Element type (`'div'`, `'p'`, `'#text'`, `'#comment'`, `'#doctype'`, `'#fragment'`)
- `attributes` - Object containing element attributes
- `children` - Array of child VirtualNode instances
- `parent` - Reference to parent VirtualNode
- `text` - Getter that returns concatenated text content of all descendant text nodes

### Methods
- `traverse(callback)` - Recursively calls callback on this node and all descendants
- `toString()` - Serializes the virtual DOM back to HTML string
- `serialize()` - Returns JSON representation of the virtual DOM tree
- `appendNode(type, attributes)` - Adds a new child node and returns it
- `appendHtml(html)` - Parses and appends HTML content as children

## Use Cases

The `parseHtml` service is commonly used for:

1. **Content processing** - Extracting titles, metadata, or specific elements from HTML
2. **URL extraction** - Finding all links and resources in HTML content  
3. **HTML transformation** - Modifying DOM structure before rendering
4. **Static site generation** - Analyzing HTML content for crawling and optimization
5. **Markdown post-processing** - Transforming rendered markdown with custom logic
6. **Content analysis** - Traversing HTML structure for SEO or accessibility analysis
7. **Template manipulation** - Programmatically modifying HTML templates

The service provides a robust and safe way to work with HTML content in a structured manner, making it ideal for server-side HTML processing and manipulation tasks.